<script lang="ts" setup>
import { ErrorCode, PageName, Role } from '@/common/constants';
import {
  compareFormData,
  convertToOptions,
  maskPhone,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { IOption, IResponseError } from '@/common/interfaces';
import { identityMask } from '@/common/mask';
import {
  AvatarForm,
  BaseAutoComplete,
  BaseDialog,
  DatePicker,
  GenderRadioGroup,
  InputTel,
  InputText,
  InputTextarea,
} from '@/components';
import { convertToTeacher } from '@/features/teacher/helpers';
import { teacherFormSchema } from '@/features/teacher/schema';
import { teacherApiService } from '@/features/teacher/services/teacher.api';
import { useTeacherDialog, useTeacherStore } from '@/features/teacher/stores';
import router from '@/plugins/vue-router';
import { cloneDeep, isEmpty } from 'lodash';
import { useField, useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const dialogStore = useTeacherDialog();
const { t } = useI18n();
const store = useTeacherStore();
const {
  handleSubmit,
  resetForm,
  setValues,
  meta,
  setFieldError,
  values: formValue,
} = useForm({
  validationSchema: teacherFormSchema,
  validateOnMount: false,
});
const { value: avatar, setValue: updateAvatar } = useField('avatar');
const oldForm = ref();
const initialRoleOptions = ref<IOption[]>([]);
const roleOptions = computed(() =>
  isEmpty(store.roleOptions) ? initialRoleOptions.value : store.roleOptions,
);
const isManager = ref<boolean>(false);
const managerRoleId = ref();

const isValidSubmit = computed(
  () => meta.value.valid && !compareFormData(oldForm.value, formValue),
);
const isUpdate = computed(() => !!dialogStore.currentId);

const formTitle = computed(() =>
  isUpdate.value ? t(`teacher.form.title.edit`) : t(`teacher.form.title.create`),
);

const onCloseDialog = () => {
  dialogStore.close();
};

onMounted(async () => {
  store.getSubjectOptions();
  store.getRoleOptions();
  if (isUpdate.value) {
    dialogStore.isFetching = true;
    const response = await teacherApiService.detail(dialogStore.currentId);
    if (response.success) {
      const teacher = convertToTeacher(response.data);
      initialRoleOptions.value = convertToOptions([teacher.role]);
      isManager.value = teacher.userRole === Role.MANAGER;
      setValues({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        gender: teacher.gender,
        avatar: teacher?.avatar,
        teacherId: teacher.code,
        dob: teacher.dob,
        roleId: isManager.value ? teacher.role?.name : teacher.role?.id,
        teacherDetail: {
          degree: teacher.teacherDetail?.degree,
          subjectIds: teacher.teacherDetail?.subjectIds,
          nationality: teacher.teacherDetail?.nationality,
          note: teacher.teacherDetail?.note,
          identity: teacher.teacherDetail?.identity,
          signedContractDate: teacher.teacherDetail?.signedContractDate,
        },
      });

      if (isManager.value) {
        managerRoleId.value = teacher.role?.id;
      }
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
    if (errorCode === ErrorCode.ITEM_NOT_FOUND && key === 'teacher') {
      const i18nKey = `teacher.get.${errorCode}.${key}`;
      showErrorNotification(t(i18nKey));
      handleCloseDialog();
    }
    goToListPage();
  }
});

const goToListPage = () => {
  router.replace({
    name: PageName.TEACHER_LIST_PAGE,
  });
};

// handle errors
function handleCreateErrors(error: IResponseError) {
  const errorCode = error.errorCode;
  const i18nKey = `teacher.create.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
    case ErrorCode.ITEM_ALREADY_EXIST:
      setFieldError(error.key, t(i18nKey));
      break;
    default:
      showErrorNotification(t('teacher.notification.error.create'));
      break;
  }
}
function handleUpdateErrors(error: IResponseError) {
  const errorCode = error.errorCode;
  const i18nKey = `teacher.update.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      if (error.key === 'teacher') {
        showErrorNotification(t(i18nKey));
        handleCloseDialog();
        goToListPage();
        break;
      }
      setFieldError(error.key, t(i18nKey));
      break;
    case ErrorCode.ITEM_ALREADY_EXIST:
      setFieldError(error.key, t(i18nKey));
      break;
    default:
      showErrorNotification(t('teacher.notification.error.update'));
      break;
  }
}
//

const handleClickCreate = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const res = await teacherApiService.create(values);
  if (res.success) {
    showSuccessNotification(t('teacher.notification.success.create'));
    handleCloseDialog();
    store.getList();
    return;
  }
  if (res.errors?.length) {
    handleCreateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
  dialogStore.isSubmitting = false;
});

const handleClickUpdate = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const data = {
    ...values,
    roleId: isManager.value ? managerRoleId.value : values.roleId,
  };
  const res = await teacherApiService.update(dialogStore.currentId as string, data);
  if (res.success) {
    showSuccessNotification(t('teacher.notification.success.edit'));
    store.getProfile(dialogStore.currentId as string);
    handleCloseDialog();
    return;
  }
  if (res?.errors?.length) {
    handleUpdateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
  dialogStore.isSubmitting = false;
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
    @close="onCloseDialog"
    :overlay="dialogStore.isFetching"
    :loading="dialogStore.isSubmitting"
    :disabled="!isValidSubmit"
    :title="formTitle"
    @submit="submit"
    content-class="pt-6"
  >
    <v-row>
      <v-col cols="6" class="py-2">
        <AvatarForm :value="avatar as string" @avatar-change="updateAvatar" />
      </v-col>
      <v-col cols="6" class="d-flex flex-column gap--4 py-2">
        <InputText
          name="name"
          :label="t('common.form.name.label')"
          :placeholder="t('common.form.name.placeholder')"
          is-required
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
        <InputTel
          name="phone"
          :label="t('common.form.phone.label')"
          :placeholder="t('common.form.phone.placeholder')"
          is-required
        />
      </v-col>
      <v-col cols="6" class="py-2">
        <DatePicker
          name="dob"
          :max="new Date()"
          :label="t('common.form.dob.label')"
          :placeholder="t('common.form.dob.placeholder')"
          is-required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="py-2">
        <GenderRadioGroup :is-required="true" />
      </v-col>
      <v-col cols="6" class="py-2">
        <DatePicker
          name="teacherDetail.signedContractDate"
          :label="t('common.form.signingDate.label')"
          :max="new Date()"
          :placeholder="t('common.form.signingDate.placeholder')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="py-2">
        <InputText
          name="teacherDetail.identity"
          :label="t('teacher.form.identity.label')"
          :placeholder="t('teacher.form.identity.placeholder')"
          :clearable="true"
          :mask="identityMask"
          :max-length="255"
        />
      </v-col>
      <v-col cols="6" class="py-2">
        <InputText
          name="teacherDetail.nationality"
          :label="t('teacher.form.nationality.label')"
          :placeholder="t('teacher.form.nationality.placeholder')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="py-2">
        <BaseAutoComplete
          name="teacherDetail.subjectIds"
          :label="t('teacher.form.teachingSubjects.label')"
          :placeholder="t('teacher.form.teachingSubjects.placeholder')"
          :items="store.subjectOptions"
          multiple
        />
      </v-col>
      <v-col cols="6" class="py-2">
        <BaseAutoComplete
          name="roleId"
          :is-required="true"
          :label="t('common.form.role.label')"
          :placeholder="t('common.form.role.placeholder')"
          :items="roleOptions"
          :is-disabled="isManager"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="py-2">
        <InputTextarea
          name="teacherDetail.degree"
          :label="t('teacher.form.degree.label')"
          :placeholder="t('teacher.form.degree.placeholder')"
          :rows="5"
        />
      </v-col>
      <v-col cols="12" class="py-2">
        <InputTextarea
          name="teacherDetail.note"
          :label="t('teacher.form.note.label')"
          :placeholder="t('teacher.form.note.placeholder')"
          :rows="5"
        />
      </v-col>
    </v-row>
  </BaseDialog>
</template>
<style lang="scss" scoped></style>
