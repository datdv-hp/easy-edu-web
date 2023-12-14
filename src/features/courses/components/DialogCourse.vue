<script setup lang="ts">
import { ErrorCode, PageName } from '@/common/constants';
import {
  getDiffFormData,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import {
  BaseAutoComplete,
  BaseDialog,
  InputNumber,
  InputText,
  InputTextarea,
} from '@/components';
import { commonApiService } from '@/features/common/services/common.api';
import {
  convertCourseTypeOptions,
  convertSubjectOptions,
  convertToCourseDetail,
} from '@/features/courses/helpers';
import { coursesFormSchema } from '@/features/courses/schema';
import { courseApiService } from '@/features/courses/services/courses.api';
import {
  useCourseDetail,
  useCourseDialog,
  useCoursesStore,
} from '@/features/courses/store';
import { CurrencySuffix } from '@/features/setting/constant';
import router from '@/plugins/vue-router';
import { isEqual } from 'lodash';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();

const route = useRoute();
const store = useCoursesStore();
const dialogStore = useCourseDialog();
const detailStore = useCourseDetail();

const subjectsDropdown = ref<{ title: string; value: string }[]>([]);
const courseTypesDropdown = ref<{ title: string; value: string }[]>([]);

const isUpdate = computed(() => !!dialogStore.currentId);

const { handleSubmit, resetForm, setValues, meta, setFieldError, values } = useForm({
  validationSchema: coursesFormSchema,
});
const oldForm = ref();
const isValidSubmit = computed(() => {
  return meta.value.valid && !isEqual(oldForm.value, values);
});
onMounted(async () => {
  const [resSubjectDropdown, resCourseDropdown] = await Promise.all([
    commonApiService._getSubjectDropdown(),
    commonApiService._getCourseTypeDropdown(),
  ]);
  if (resSubjectDropdown?.success) {
    subjectsDropdown.value = convertSubjectOptions(resSubjectDropdown.data);
  }
  if (resCourseDropdown?.success) {
    courseTypesDropdown.value = convertCourseTypeOptions(resCourseDropdown.data);
  }
  if (isUpdate.value) {
    const response = await courseApiService.detail(dialogStore.currentId);
    if (response.success) {
      const course = convertToCourseDetail(response.data);
      setValues({
        name: course.name,
        description: course.description,
        times: course.times,
        tuition: course.tuition,
        subjectIds: course.subjectIds,
        
        courseType: course.courseFormIds,

      });
      oldForm.value = {
        name: course.name,
        description: course.description,
        times: course.times?.toString(),
        tuition: course.tuition?.toString(),
        subjectIds: course.subjectIds,
        courseType: course.courseFormIds,

      };
    }
  }
});

const goToListPage = () => {
  router.replace({ name: PageName.COURSE_LIST_PAGE });
};

const handleCreateErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const errorKey = error.key;
  const i18nKey = `courses.createError.${errorCode}.${errorKey}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      setFieldError(errorKey, t(i18nKey));
      break;
    default:
      showErrorNotification(t('courses.notification.error.errorCreate'));
      break;
  }
};
const handleUpdateErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const errorKey = error.key;
  const i18nKey = `courses.updateError.${errorCode}.${errorKey}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      showErrorNotification(t(i18nKey));
      if (errorKey === 'id') {
        onCloseDialog();
        goToListPage();
      }
      break;
    case ErrorCode.ITEM_ALREADY_EXIST:
      showErrorNotification(t(i18nKey));
      break;
    default:
      showErrorNotification(t('courses.notification.error.update'));
      break;
  }
};

const handleClickCreateCourse = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const res = await courseApiService.create(values);
  if (res.success) {
    showSuccessNotification(t('courses.notification.success.create'));
    onCloseDialog();
    store.getList();
    return;
  }
  dialogStore.isSubmitting = false;
  if (res?.errors?.length) {
    handleCreateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
});

const handleClickUpdateCourse = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const response = await courseApiService.update(
    dialogStore.currentId as string,
    getDiffFormData(oldForm.value, values),
  );
  if (response.success) {
    showSuccessNotification(t('courses.notification.success.update'));
    onCloseDialog();
    Promise.all([
      detailStore.getDetail(route.params?.id as string),
      detailStore.getDetailTeachers(route.params?.id as string),
    ]);
    return;
  }
  dialogStore.isSubmitting = false;
  if (response?.errors?.length) {
    handleUpdateErrors(response.errors[0]);
  } else {
    showErrorNotification(response.error || (response.message as string));
  }
});

function submit() {
  if (isUpdate.value) {
    handleClickUpdateCourse();
    return;
  }
  handleClickCreateCourse();
}

const formTitle = computed(() =>
  isUpdate.value ? t('courses.update.title') : t('courses.create.title'),
);

const onCloseDialog = () => {
  resetForm();
  dialogStore.close();
};
</script>
<template>
  <BaseDialog
    @close="onCloseDialog"
    :overlay="dialogStore.isFetching"
    :loading="dialogStore.isSubmitting"
    :disabled="!isValidSubmit"
    :title="formTitle"
    @submit="submit"
  >
    <div>
      <v-row>
        <v-col cols="12" md="6">
          <InputText
            name="name"
            :label="$t('courses.create.name.label')"
            :placeholder="$t('courses.create.name.placeholder')"
            isRequired
          />
        </v-col>

        <v-col cols="12" md="6">
          <BaseAutoComplete
            name="courseType"
            :label="$t('courses.create.state.label')"
            :placeholder="$t('courses.create.state.placeholder')"
            :items="courseTypesDropdown"
            multiple
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <InputNumber
            name="times"
            :label="$t('courses.create.time.label')"
            :placeholder="$t('courses.create.time.placeholder')"
            isRequired
            clearable
          />
        </v-col>
        <v-col cols="6">
          <InputNumber
            name="tuition"
            :label="$t('courses.create.tuition.label')"
            :placeholder="$t('courses.create.tuition.placeholder')"
            isRequired
            :suffix="CurrencySuffix.VND"
            clearable
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <InputTextarea
            name="description"
            :label="$t('courses.create.description.label')"
            :placeholder="$t('courses.create.description.placeholder')"
            rows="5"
            clearable
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pt-0">
          <BaseAutoComplete
            name="subjectIds"
            :label="$t('courses.create.subjects.label')"
            :placeholder="$t('courses.create.subjects.placeholder')"
            :items="subjectsDropdown"
            multiple
          />
        </v-col>
      </v-row>
    </div>
  </BaseDialog>
</template>

<style lang="scss" scoped>
:deep(.v-card) {
  &::-webkit-scrollbar {
    display: block;
    visibility: hidden;
    background-color: #fff;
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
:deep(.v-card) {
  padding: 20px 0 0;
  &::-webkit-scrollbar {
    width: 8px;
    height: 100px;
  }
}

:deep(.v-container) {
  background-color: #f5f5f9;
  border-radius: 6px;
}

:deep(.v-card-actions) {
  padding: 20px 46px;
  justify-content: end;
}

.table-title {
  color: #343458;
  font-family: 'Be Vietnam Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
}
</style>
