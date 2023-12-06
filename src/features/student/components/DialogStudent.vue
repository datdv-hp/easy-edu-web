<script setup lang="ts">
import { ErrorCode, PageName, StudentDegree } from '@/common/constants';
import {
  compareFormData,
  convertToOptions,
  getDiffFormData,
  maskPhone,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { IOption, IResponseError } from '@/common/interfaces';
import {
  AvatarForm,
  BaseAutoComplete,
  BaseDialog,
  DatePicker,
  DegreeSelect,
  GenderRadioGroup,
  InputTel,
  InputText,
} from '@/components';
import { convertToStudent } from '@/features/student/helpers';
import { studentFormSchema } from '@/features/student/schema';
import { studentApiService } from '@/features/student/services/student.api';
import { useStudentDialog, useStudentStore } from '@/features/student/stores';
import { cloneDeep, isEmpty } from 'lodash';
import { useField, useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import CourseDetail from './CourseDetail.vue';

const { t } = useI18n();
const router = useRouter();
const dialogStore = useStudentDialog();
const store = useStudentStore();
const oldForm = ref<Record<string, unknown>>({});
const isUpdate = computed(() => !!dialogStore.currentId);
const initialRoleOptions = ref<IOption[]>([]);

const roleOptions = computed(() =>
  isEmpty(store.roleOptions) ? initialRoleOptions.value : store.roleOptions,
);
const {
  values: formValue,
  handleSubmit,
  resetForm,
  setValues,
  meta,
  setFieldError,
} = useForm({
  validationSchema: studentFormSchema,
});
const { value: avatar, setValue: updateAvatar } = useField('avatar');

const formTitle = computed(() =>
  isUpdate.value ? t('student.form.title.edit') : t('student.form.title.create'),
);
const isValidSubmit = computed(() => {
  return meta.value.valid && !compareFormData(oldForm.value, formValue);
});

onMounted(async () => {
  // lấy danh sách dropdown của khóa học.
  await Promise.all([
    store.getCourseOptions(),
    store.getSubjectOptions(),
    store.getRoleDropdown(),
  ]);
  // lấy ra thông tin học viên chỉnh sửa
  if (isUpdate.value) {
    dialogStore.isFetching = true;
    const response = await studentApiService.detail(dialogStore.currentId as string);
    if (response.success) {
      const student = convertToStudent(response.data as any);
      initialRoleOptions.value = convertToOptions([student.role]);
      if (student.studentDetail?.courses?.length) {
        const _subjectOptions: any = [];
        for (let i = 0; i < student.studentDetail?.courses.length; i++) {
          const item = student.studentDetail?.courses[i];
          _subjectOptions[i] = store.subjectsByCourse(item.courseId);
        }
        store.subjectOptions = _subjectOptions;
      }
      setValues({
        picName: student.name,
        studentDetail: {
          degree: student?.studentDetail?.degree,
          courses: student.studentDetail?.courses || [],
        },
        roleId: student.role?.id,
        code: student.code,
        email: student.email,
        phone: student.phone,
        gender: student.gender,
        avatar: student?.avatar,
        dob: student.dob,
      });
      oldForm.value = cloneDeep(formValue);
      oldForm.value.phone = maskPhone(formValue.phone);
      dialogStore.isFetching = false;
      return;
    }
    dialogStore.isFetching = false;
    if (!response?.errors?.length) {
      showErrorNotification(response.error || (response.message as string));
      goToListPage();
      return;
    }
    const { errorCode = undefined, key = undefined } = response.errors[0];
    if (errorCode === ErrorCode.ITEM_NOT_FOUND && key === 'student') {
      const i18nKey = `student.get.${errorCode}.${key}`;
      showErrorNotification(t(i18nKey));
      handleCloseDialog();
    }
    goToListPage();
  }
});

const goToListPage = () => {
  router.replace({ name: PageName.STUDENT_LIST_PAGE });
};

function handleCreateErrors(error: IResponseError) {
  const errorCode = error.errorCode;
  const i18nKey = `student.create.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_ALREADY_EXIST:
      setFieldError(error.key, t(i18nKey));
      break;
    case ErrorCode.ITEM_INVALID:
      showErrorNotification(t(i18nKey));
      break;

    default:
      showErrorNotification(t('student.notification.error.create'));
      break;
  }
}

function handleUpdateErrors(error: IResponseError) {
  const errorCode = error.errorCode;
  const i18nKey = `student.update.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      showErrorNotification(t(i18nKey));
      handleCloseDialog();
      goToListPage();
      break;
    case ErrorCode.ITEM_ALREADY_EXIST:
      setFieldError(error.key, t(i18nKey));
      break;
    case ErrorCode.UNPROCESSABLE_ENTITY:
    case ErrorCode.CONFLICT:
      showErrorNotification(t(i18nKey));
      break;
    default:
      showErrorNotification(t('student.notification.error.edit'));
      break;
  }
}

const handleClickCreate = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const res = await studentApiService.create({
    ...values,
    name: values.picName,
  });
  if (res.success) {
    showSuccessNotification(t('student.notification.success.createStudent'));
    handleCloseDialog();
    store.getList();
    return;
  }
  if (res?.errors?.length) {
    handleCreateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
  dialogStore.isSubmitting = false;
});

const handleClickUpdate = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const res = await studentApiService.update(
    dialogStore.currentId as string,
    getDiffFormData(oldForm.value, values),
  );
  dialogStore.isSubmitting = false;
  if (res.success) {
    showSuccessNotification(t('student.notification.success.editStudent'));
    store.getProfile(dialogStore.currentId as string);
    handleCloseDialog();
    return;
  }
  if (res?.errors?.length) {
    handleUpdateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
});

const handleCloseDialog = () => {
  resetForm();
  dialogStore.close();
};

function submit() {
  if (isUpdate.value) {
    handleClickUpdate();
    return;
  }
  handleClickCreate();
}
</script>

<template>
  <BaseDialog
    @close="handleCloseDialog"
    :overlay="dialogStore.isFetching"
    :loading="dialogStore.isSubmitting"
    :disabled="!isValidSubmit"
    :title="formTitle"
    content-class="pt-6"
    @submit="submit"
  >
    <v-row>
      <v-col cols="6" class="py-2">
        <AvatarForm :value="avatar as string" @avatar-change="updateAvatar" />
      </v-col>
      <v-col cols="6" class="d-flex flex-column gap--4 py-2">
        <InputText
          name="picName"
          :label="$t('common.form.name.label')"
          :placeholder="$t('common.form.name.placeholder')"
          isRequired
        />
        <InputText
          name="email"
          :class="{ 'readonly-email': isUpdate }"
          :label="t('common.form.email.label')"
          :placeholder="t('common.form.email.placeholder')"
          is-required
          :readonly="isUpdate"
          :clearable="!isUpdate"
          :variant="isUpdate ? 'plain' : 'outlined'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="py-2">
        <DatePicker
          name="dob"
          :max="new Date()"
          :label="t('common.form.dob.label')"
          :placeholder="t('common.form.dob.placeholder')"
          is-required
        />
      </v-col>
      <v-col cols="6" class="py-2">
        <InputTel
          name="phone"
          :label="$t('common.form.phone.label')"
          :placeholder="$t('common.form.phone.placeholder')"
          isRequired
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="py-2">
        <GenderRadioGroup name="gender" :is-required="true" />
      </v-col>
      <v-col cols="6" class="py-2">
        <DegreeSelect
          name="studentDetail.degree"
          :label="$t('student.form.level.label')"
          :placeholder="$t('student.form.level.placeholder')"
          :degree="StudentDegree"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="py-2">
        <BaseAutoComplete
          name="roleId"
          :is-required="true"
          :label="t('common.form.role.label')"
          :placeholder="t('common.form.role.placeholder')"
          :items="roleOptions"
        />
      </v-col>
    </v-row>
    <CourseDetail />
  </BaseDialog>
</template>

<style lang="scss" scoped></style>
