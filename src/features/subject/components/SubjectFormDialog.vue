<script setup lang="ts">
import { ErrorCode, FORM_VALIDATION } from '@/common/constants';
import {
  compareFormData,
  getDiffFormData,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { BaseDialog, InputText, InputTextarea } from '@/components';
import { subjectApiService } from '@/features/subject/services/subject.api';
import { useSubjectDialog, useSubjectStore } from '@/features/subject/store';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { convertToSubject } from '../helpers';
import { CreateSubjectFormSchema } from '../schema';
import SubjectDocument from './SubjectDocument.vue';
import { cloneDeep } from 'lodash';
import { IResponseError } from '@/common/interfaces';

const { t } = useI18n();
const store = useSubjectStore();
const dialogStore = useSubjectDialog();

const {
  handleSubmit,
  resetForm,
  setValues,
  meta,
  setFieldError,
  values: formValue,
} = useForm({
  validationSchema: CreateSubjectFormSchema,
});

const oldForm = ref();
const isValidSubmit = computed(
  () => meta.value.valid && !compareFormData(oldForm.value, formValue),
);

onMounted(async () => {
  if (isUpdate.value) {
    const response = await store.getDetail(dialogStore.currentId);
    if (response.success) {
      const item = convertToSubject(response.data as any);
      const documents = item.documents?.length ? item.documents : [{}];
      setValues({
        name: item.name,
        description: item.description,
        subjectCode: item.subjectCode,
        documents: documents,
      });
      oldForm.value = cloneDeep(formValue);
      return;
    }
    if (!response?.errors?.length) {
      showErrorNotification(response.error || (response.message as string));
      return;
    }
    const { errorCode = undefined, key = undefined } = response.errors[0];
    if (errorCode === ErrorCode.ITEM_NOT_FOUND && key === 'manager') {
      const i18nKey = `subjects.get.${errorCode}.${key}`;
      showErrorNotification(t(i18nKey));
      onCloseDialog();
      store.getList();
    }
  }
});

const handleCreateErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const i18nKey = `subjects.create.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_ALREADY_EXIST:
      setFieldError(error.key, t(i18nKey));
      break;
    default:
      showErrorNotification(t('subjects.notification.error.create'));
      break;
  }
};
const handleUpdateErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const i18nKey = `subjects.update.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      showErrorNotification(t(i18nKey));
      onCloseDialog();
      store.getList();
      break;
    case ErrorCode.ITEM_ALREADY_EXIST:
      showErrorNotification(t(i18nKey));
      break;
    default:
      showErrorNotification(t('subjects.notification.error.update'));
      break;
  }
};

const handleClickCreate = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const res = await subjectApiService.create(values);
  dialogStore.isSubmitting = false;
  if (res?.success) {
    showSuccessNotification(t('subjects.notification.success.create'));
    onCloseDialog();
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
  const res = await subjectApiService.update(
    dialogStore.currentId as string,
    getDiffFormData(oldForm.value, values),
  );
  dialogStore.isSubmitting = false;
  if (res.success) {
    showSuccessNotification(t('subjects.notification.success.update'));
    onCloseDialog();
    store.getList();
    return;
  }
  if (res?.errors?.length) {
    handleUpdateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
});

function submit() {
  if (isUpdate.value) {
    handleClickUpdate();
    return;
  }
  handleClickCreate();
}

const isUpdate = computed(() => !!dialogStore.currentId);

const formTitle = computed(() =>
  isUpdate.value ? t('subjects.update.title') : t('subjects.create.title'),
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
    :width="800"
    @submit="submit"
  >
    <v-row>
      <v-col cols="12" class="pt-1">
        <span class="fz-4_5 fw-600 text--black">{{
          $t('subjects.create.infoTitle')
        }}</span>
      </v-col>
      <v-col cols="6">
        <InputText
          name="name"
          :label="$t('subjects.create.name.label')"
          :placeholder="$t('subjects.create.name.placeholder')"
          isRequired
        />
      </v-col>
      <v-col cols="6">
        <InputText
          name="subjectCode"
          :label="$t('subjects.create.code.label')"
          :max-length="FORM_VALIDATION.codeMaxLength"
          :placeholder="$t('subjects.create.code.placeholder')"
          :trim="true"
          isRequired
        />
      </v-col>
      <v-col cols="12">
        <InputTextarea
          name="description"
          :label="$t('subjects.create.description.label')"
          :placeholder="$t('subjects.create.description.placeholder')"
          rows="4"
        />
      </v-col>
    </v-row>
    <SubjectDocument />
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

:deep(.v-table__wrapper thead th) {
  border: 1px solid #e1e3e9;
}

:deep(.v-table .v-table__wrapper > table > tbody > tr > td) {
  border: 1px solid #e1e3e9;
  padding: 0;
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
