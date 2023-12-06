<script lang="ts" setup>
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { BaseSettingDialog, InputText } from '@/components';
import { useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { settingEvaluationFormSchema } from '../schema';
import { settingEvaluationClassifiedApiService } from '../services/settingEvaluationClassified.api';
import { useSettingEvaluationDialog } from '../stores/setting-evaluation-dialog.store';
import { useSettingEvaluationStore } from '../stores/settingEvaluation.store';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { IResponseError } from '@/common/interfaces';
import { ErrorCode } from '@/common/constants';

const { t } = useI18n();
const dialogStore = useSettingEvaluationDialog();
const store = useSettingEvaluationStore();
const evaluationClassifiedClone = ref();

const { meta, values, handleSubmit, setFieldValue, setFieldError } = useForm({
  validationSchema: settingEvaluationFormSchema,
});

onMounted(async () => {
  if (dialogStore.isUpdate) {
    const res = await settingEvaluationClassifiedApiService.getEvaluationClassifiedDetail(
      dialogStore.currentId as string,
    );
    if (res?.success) {
      setFieldValue('name', res.data.name);
      evaluationClassifiedClone.value = res.data.name;
    }
  }
});

const handleApiErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const errorKey = error.key;
  const i18nKey = `settings.error.createEvaluation.${errorCode}.${errorKey}`;
  switch (errorCode) {
    case ErrorCode.ITEM_ALREADY_EXIST:
      setFieldError(errorKey, t(i18nKey));
      break;
    default:
      showErrorNotification(
        t(
          `settings.success.${
            dialogStore.isUpdate ? `evaluationUpdate` : `evaluationCreate`
          }`,
        ),
      );
      break;
  }
};

const handleCreate = handleSubmit(async () => {
  const res =
    await settingEvaluationClassifiedApiService.createEvaluationClassified(values);
  if (res?.success) {
    await store.getList();
    dialogStore.close();
    showSuccessNotification(t('settings.success.evaluationCreate'));
  } else if (res.errors?.length) {
    handleApiErrors(res.errors[0]);
  } else {
    showErrorNotification(t('settings.error.evaluationCreate'));
  }
});

const handleUpdate = handleSubmit(async () => {
  const res = await settingEvaluationClassifiedApiService.updateEvaluationClassified(
    dialogStore.currentId,
    values,
  );
  if (res?.success) {
    await store.getList();
    dialogStore.close();
    showSuccessNotification(t('settings.success.evaluationUpdate'));
  } else if (res.errors?.length) {
    handleApiErrors(res.errors[0]);
  } else {
    showErrorNotification(t('settings.error.evaluationUpdate'));
  }
});
</script>
<template>
  <BaseSettingDialog
    @close="dialogStore.close"
    :loading="dialogStore.isSubmitting"
    :disabled="!meta.valid || evaluationClassifiedClone === values.name"
    :title="
      dialogStore.isUpdate
        ? t('settings.evaluationList.update')
        : t('settings.evaluationList.create')
    "
    @submit="dialogStore.isUpdate ? handleUpdate() : handleCreate()"
  >
    <v-row>
      <v-col cols="12">
        <InputText
          name="name"
          :label="$t('settings.evaluationList.evaluationType.label')"
          :placeholder="$t('settings.evaluationList.evaluationType.placeholder')"
          is-required
        />
      </v-col>
    </v-row>
  </BaseSettingDialog>
</template>

<style lang="scss" scoped></style>
