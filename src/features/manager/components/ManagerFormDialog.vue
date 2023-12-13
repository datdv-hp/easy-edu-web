<script lang="ts" setup>
import { ErrorCode, PageName } from '@/common/constants';
import {
  compareFormData,
  maskPhone,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import {
  AvatarForm,
  BaseAutoComplete,
  BaseDialog,
  CheckboxInput,
  DatePicker,
  GenderRadioGroup,
  InputNumber,
  InputTel,
  InputText,
  InputTextarea,
} from '@/components';
import { convertToManagerDetail } from '@/features/manager/helpers';
import { managerApiService } from '@/features/manager/manager.api';
import { managerFormSchema } from '@/features/manager/schema';
import { useManagerDialog, useManagerStore } from '@/features/manager/stores';
import { cloneDeep } from 'lodash';
import { useField, useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const dialogStore = useManagerDialog();
const { t } = useI18n();
const store = useManagerStore();
const {
  values: formValue,
  handleSubmit,
  resetForm,
  setValues,
  meta,
  setFieldError,
} = useForm({
  validationSchema: managerFormSchema,
});
const oldForm = ref<Record<string, unknown>>({});

const { value: isTeacher } = useField('isTeacher');
const { setValue: updateSubjects } = useField('teacherDetail.subjectIds');
const { setValue: updateDegree } = useField('teacherDetail.degree');
const { setValue: updateSignedContractDate } = useField(
  'managerDetail.signedContractDate',
);
const { setValue: updateNote } = useField('teacherDetail.note');
const { setValue: updateIdentity } = useField('teacherDetail.identity');
const { setValue: updateNationality } = useField('teacherDetail.nationality');

const { value: avatar, setValue: updateAvatar } = useField('avatar');

const isUpdate = computed(() => !!dialogStore.currentId);

const formTitle = computed(() =>
  isUpdate.value ? t(`manager.form.title.edit`) : t(`manager.form.title.create`),
);

const isValidSubmit = computed(() => {
  return meta.value.valid && !compareFormData(oldForm.value, formValue);
});
const onCloseDialog = () => {
  dialogStore.close();
};

onMounted(async () => {
  store.getSubjectOptions();
  store.getRoleDropdown();
  if (isUpdate.value) {
    dialogStore.isFetching = true;
    const response = await managerApiService.detail(dialogStore.currentId);
    if (response.success) {
      const item = convertToManagerDetail(response.data);
      setValues({
        name: item.name,
        email: item.email,
        phone: item.phone,
        gender: item.gender,
        avatar: item?.avatar,
        code: item?.code,
        dob: item.dob,
        roleId: item.roleId,
        managerDetail: {
          signedContractDate: item.managerDetail?.signedContractDate,
        },
        isTeacher: item.isTeacher,
      });
      if (isTeacher.value) {
        if (item.teacherDetail?.subjectIds) {
          updateSubjects(item.teacherDetail?.subjectIds);
        }
        if (item.teacherDetail?.degree) {
          updateDegree(item.teacherDetail?.degree);
        }
        if (item.teacherDetail?.nationality) {
          updateNationality(item.teacherDetail?.nationality);
        }
        if (item.teacherDetail?.note) {
          updateNote(item.teacherDetail?.note);
        }
        if (item.teacherDetail?.identity) {
          updateIdentity(item.teacherDetail?.identity);
        }
        if (item.teacherDetail?.signedContractDate) {
          updateSignedContractDate(item.teacherDetail?.signedContractDate);
        }
      }
      oldForm.value = cloneDeep(formValue);
      oldForm.value.phone = maskPhone(formValue.phone);
      dialogStore.isFetching = false;
      return;
    }
    dialogStore.isFetching = false;
    if (!response?.errors?.length) {
      showErrorNotification(response.error || (response.message as string));
      return;
    }
    const { errorCode = undefined, key = undefined } = response.errors[0];
    if (errorCode === ErrorCode.ITEM_NOT_FOUND && key === 'manager') {
      const i18nKey = `manager.get.${errorCode}.${key}`;
      showErrorNotification(t(i18nKey));
      handleCloseDialog();
    }
    goToListPage();
  }
});

const goToListPage = () => {
  router.replace({ name: PageName.MANAGER_LIST_PAGE });
};

function handleCreateErrors(error: IResponseError) {
  const errorCode = error.errorCode;
  const i18nKey = `teacher.create.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_ALREADY_EXIST:
      setFieldError(error.key, t(i18nKey));
      break;
    default:
      showErrorNotification(t('manager.notification.error.create'));
      break;
  }
}

function handleUpdateErrors(error: IResponseError) {
  const errorCode = error.errorCode;
  const i18nKey = `manager.update.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_ALREADY_EXIST:
      setFieldError(error.key, t(i18nKey));
      break;
    case ErrorCode.ITEM_NOT_FOUND:
      showErrorNotification(t(i18nKey));
      goToListPage();
      break;
    case ErrorCode.CONFLICT:
    case ErrorCode.UNPROCESSABLE_ENTITY:
      showErrorNotification(t(i18nKey));
      break;
    default:
      showErrorNotification(t('manager.notification.error.update'));
      break;
  }
}

const handleClickCreate = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const res = await managerApiService.create(values);
  dialogStore.isSubmitting = false;
  if (res.success) {
    showSuccessNotification(t('manager.notification.success.create'));
    handleCloseDialog();
    store.getList();
    return;
  }
  if (res?.errors?.length) {
    handleCreateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
});

const handleClickUpdate = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const res = await managerApiService.update(dialogStore.currentId as string, values);
  dialogStore.isSubmitting = false;
  if (res.success) {
    showSuccessNotification(t('manager.notification.success.edit'));
    store.getProfile(dialogStore.currentId);
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
      <v-col cols="6" class="d-flex flex-column gap-4 py-2">
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
          name="managerDetail.signedContractDate"
          :label="t('common.form.signingDate.label')"
          :placeholder="t('common.form.signingDate.placeholder')"
          :max="new Date()"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="isTeacher py-2">
        <CheckboxInput name="isTeacher" :label="t('manager.form.isTeacher')" />
      </v-col>
      <v-col cols="6" class="py-2">
        <BaseAutoComplete
          name="roleId"
          :is-required="true"
          :label="t('common.form.role.label')"
          :placeholder="t('common.form.role.placeholder')"
          :items="store.roleOptions"
        />
      </v-col>
    </v-row>
    <v-row :class="{ 'd-none': !isTeacher }">
      <v-col cols="6" class="py-2">
        <InputNumber
          name="teacherDetail.identity"
          :label="t('teacher.form.identity.label')"
          :placeholder="t('teacher.form.identity.placeholder')"
          :clearable="true"
        />
      </v-col>
      <v-col cols="6" class="py-2">
        <InputText
          name="teacherDetail.nationality"
          :label="t('teacher.form.nationality.label')"
          :placeholder="t('teacher.form.nationality.placeholder')"
        />
      </v-col>
      <v-col cols="12" class="py-2">
        <BaseAutoComplete
          name="teacherDetail.subjectIds"
          :label="t('teacher.form.teachingSubjects.label')"
          :placeholder="t('teacher.form.teachingSubjects.placeholder')"
          :items="store.subjects"
          multiple
        />
      </v-col>
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

<style lang="scss" scoped>
.isTeacher {
  :deep(.v-selection-control) {
    margin-inline-start: -4px;
    gap: 8px;
  }
}
</style>
