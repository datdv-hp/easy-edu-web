<script lang="ts" setup>
import { ErrorCode, PageName } from '@/common/constants';
import {
  compareFormData,
  getDiffFormData,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import {
  BaseAutoComplete,
  BaseDialog,
  ColorPicker,
  DatePicker,
  InputText,
} from '@/components';
import { classCreationFormSchema } from '@/features/classroom/schema';
import { classroomApiService } from '@/features/classroom/services/classroom.api';
import { useClassroomDialog, useClassroomStore } from '@/features/classroom/stores';
import router from '@/plugins/vue-router';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { useField, useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { listColor } from '../contants';

const dialogStore = useClassroomDialog();
const { t } = useI18n();
const store = useClassroomStore();
const {
  handleSubmit,
  resetForm,
  meta,
  setValues,
  values: formValue,
  setFieldError,
} = useForm({
  validationSchema: classCreationFormSchema,
});
const { resetField: resetParticipants } = useField('participants');
const oldForm = ref();
const isValidSubmit = computed(
  () => meta.value.valid && !compareFormData(oldForm.value, formValue),
);
const isUpdate = computed(() => !!dialogStore.currentId);

const formTitle = computed(() =>
  isUpdate.value ? t(`classroom.form.title.edit`) : t(`classroom.form.title.create`),
);

const onCloseDialog = () => {
  dialogStore.close();
};

onMounted(async () => {
  dialogStore.isFetching = true;
  await Promise.all([
    store.getCoursesOptions(),
    store.getTeachersOptions(),
    store.getSyllabusOptions(),
  ]);
  if (isUpdate.value) {
    const response = await store.getBasicClassroomDetail(dialogStore.currentId);
    if (response.success) {
      const data = response.data;
      await store.getStudentOptions(data.courseId as string);
      const formValues = {
        courseId: data.courseId,
        endDate: data.endDate,
        startDate: data.startDate,
        name: data.name,
        participantIds: data.participantIds,
        color: data.color,
        teacherIds: data.teacherIds,
        syllabusIds: data?.syllabusIds,
      };
      setValues(formValues);
      oldForm.value = cloneDeep(formValue);
    } else {
      showErrorNotification(response.error);
    }
  }
  dialogStore.isFetching = false;
});

const handleChangeCourse = (value?: string) => {
  if (value) {
    store.getStudentOptions(value);
  }
  resetParticipants();
};

const goToListPage = () => {
  router.replace({ name: PageName.CLASSROOM_LIST_PAGE });
};

const handleCreateErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const errorKey = error.key;
  const i18nKey = `classroom.create.${errorCode}.${errorKey}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      setFieldError(errorKey, t(i18nKey));
      break;
    default:
      showErrorNotification(t('classroom.notification.error.errorCreate'));
      break;
  }
};

const handleUpdateErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const errorKey = error.key;
  const i18nKey = `classroom.update.${errorCode}.${errorKey}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      if (errorKey === 'id') {
        showErrorNotification(t(i18nKey));
        handleCloseDialog();
        goToListPage();
      } else if (errorKey === 'participants') {
        setFieldError(errorKey, t(i18nKey));
      }
      break;
    case ErrorCode.CONFLICT:
      showErrorNotification(t(i18nKey));
      break;
    default:
      showErrorNotification(t('classroom.notification.error.errorEdit'));
      break;
  }
};

const handleClickCreateClassroom = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const res = await classroomApiService.create(values);
  if (res.success) {
    showSuccessNotification(t('classroom.notification.success.create'));
    handleCloseDialog();
    store.getList();
    return;
  }
  dialogStore.isSubmitting = false;
  if (res.errors?.length) {
    handleCreateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
});

const handleClickUpdateClassroom = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const response = await classroomApiService.update(
    dialogStore.currentId as string,
    getDiffFormData(oldForm.value, values),
  );
  if (response.success) {
    showSuccessNotification(t('classroom.notification.success.edit'));
    await store.getDetail(dialogStore.currentId as string);
    handleCloseDialog();
    return;
  }
  dialogStore.isSubmitting = false;
  if (response?.errors?.length) {
    handleUpdateErrors(response.errors[0]);
  } else {
    showErrorNotification(response.error || (response.message as string));
  }
});

const handleCloseDialog = () => {
  resetForm();
  dialogStore.close();
};

function submit() {
  if (isUpdate.value) {
    handleClickUpdateClassroom();
    return;
  }
  handleClickCreateClassroom();
}
</script>

<template>
  <BaseDialog
    @close="onCloseDialog"
    :loading="dialogStore.isSubmitting"
    :disabled="!isValidSubmit"
    :title="formTitle"
    @submit="submit"
    content-class="py-4"
    :max-width="800"
  >
    <div class="list-group pt-2">
      <v-row>
        <v-col cols="6">
          <BaseAutoComplete
            class="list-item"
            :label="$t('classroom.form.fields.course.label')"
            :placeholder="$t('classroom.form.fields.course.placeholder')"
            :items="store.coursesOptions"
            name="courseId"
            clearable
            is-required
            :multiple="false"
            :is-disabled="!!store.detail?.totalLesson"
            @change="handleChangeCourse"
          />
        </v-col>
        <v-col cols="6">
          <InputText
            class="list-item"
            :label="$t('classroom.form.fields.name.label')"
            :placeholder="$t('classroom.form.fields.name.placeholder')"
            name="name"
            clearable
            is-required
          />
        </v-col>
      </v-row>
    </div>

    <div class="list-group">
      <v-row>
        <v-col cols="6">
          <BaseAutoComplete
            class="list-item"
            :label="$t('classroom.form.fields.syllabus.label')"
            :placeholder="$t('classroom.form.fields.syllabus.placeholder')"
            :items="store.syllabusOptions"
            name="syllabusIds"
            multiple
            clearable
          />
        </v-col>
        <v-col cols="6">
          <BaseAutoComplete
            class="list-item"
            name="teacherIds"
            :label="t('classroom.form.title.teacher')"
            :items="store.teacherOptions"
            multiple
            clearable
            :placeholder="$t('classroom.form.fields.teachers.placeholder')"
          />
        </v-col>
      </v-row>
    </div>

    <div class="list-group">
      <v-row>
        <v-col cols="6">
          <DatePicker
            class="list-item"
            name="startDate"
            is-required
            :label="$t('classroom.form.fields.startDate.label')"
            :placeholder="$t('classroom.form.fields.startDate.placeholder')"
            value-type="string"
            :min="new Date()"
            :max="
              formValue?.endDate
                ? dayjs(formValue?.endDate).subtract(1, 'day').toDate()
                : undefined
            "
          />
        </v-col>
        <v-col cols="6">
          <DatePicker
            class="list-item"
            name="endDate"
            is-required
            :label="$t('classroom.form.fields.endDate.label')"
            :placeholder="$t('classroom.form.fields.endDate.placeholder')"
            value-type="string"
            :min="
              formValue?.startDate
                ? dayjs(formValue?.startDate).add(1, 'day').toDate()
                : new Date()
            "
          />
        </v-col>
      </v-row>
    </div>
    <div class="list-group">
      <v-row>
        <v-col cols="12">
          <BaseAutoComplete
            class="list-item"
            name="participantIds"
            :label="t('classroom.form.title.student')"
            :items="store.studentOptions"
            multiple
            :is-disabled="!formValue.courseId"
            clearable
            :placeholder="$t('classroom.form.fields.students.placeholder')"
          />
        </v-col>
      </v-row>
    </div>
    <div class="list-group">
      <v-label class="item-label">{{ t('classroom.form.title.color') }}</v-label>
      <v-row>
        <v-col cols="12" class="mb-4">
          <ColorPicker name="color" :items="listColor" />
        </v-col>
      </v-row>
    </div>
  </BaseDialog>
</template>

<style lang="scss" scoped>
:deep(.selection-role .v-input__control) {
  width: 100%;

  .v-selection-control-group {
    gap: 20px;
  }

  .v-label {
    opacity: 1;
  }
}

:deep(.v-card-text) {
  &::-webkit-scrollbar {
    display: block;
    visibility: hidden;
    background-color: #fff;
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    visibility: hidden;
    background-color: $color-neutral-6;
    border-radius: 6px;
  }

  &:hover::-webkit-scrollbar-thumb {
    visibility: visible;
  }
}

.list-group {
  .item-label {
    margin: 14px 0;
    font-weight: 500;
    font-size: 14px;
    color: #343458;
  }
  .list-item {
    margin-bottom: 16px;
  }
}
</style>
