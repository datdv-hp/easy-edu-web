<script lang="ts" setup>
import { BaseSettingDialog, InputText } from '@/components';
import { useI18n } from 'vue-i18n';
import { useSettingCourseDialog } from '../stores/setting-course-dialog.store';
import { useForm } from 'vee-validate';
import { settingCourseFormSchema } from '../schema';
import { settingCourseApiService } from '../services/settingCourse.api';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { useSettingCourseStore } from '../stores/settingCourse.store';
import { IResponseError } from '@/common/interfaces';
import { ErrorCode } from '@/common/constants';
import { onMounted } from 'vue';
import { ref } from 'vue';

const { t } = useI18n();
const dialogStore = useSettingCourseDialog();
const store = useSettingCourseStore();
const courseTypeClone = ref();

const { meta, values, handleSubmit, setFieldError, setFieldValue } = useForm({
  validationSchema: settingCourseFormSchema,
});

onMounted(async () => {
  if (dialogStore.isUpdate) {
    const res = await settingCourseApiService.getCourseTypeDetail(
      dialogStore.currentId as string,
    );
    if (res?.success) {
      setFieldValue('name', res.data.name);
      courseTypeClone.value = res.data.name;
    }
  }
});

const handleApiErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const errorKey = error.key;
  const i18nKey = `settings.error.createCourseType.${errorCode}.${errorKey}`;
  switch (errorCode) {
    case ErrorCode.ITEM_ALREADY_EXIST:
      setFieldError(errorKey, t(i18nKey));
      break;
    default:
      showErrorNotification(t('settings.success.courseTypeCreate'));
      break;
  }
};

const handleCreate = handleSubmit(async () => {
  const res = await settingCourseApiService.createCourseType(values);
  if (res?.success) {
    await store.getList();
    dialogStore.close();
    showSuccessNotification(t('settings.success.courseTypeCreate'));
  } else if (res.errors?.length) {
    handleApiErrors(res.errors[0]);
  } else {
    showErrorNotification(
      t(
        `settings.success.${
          dialogStore.isUpdate ? `courseTypeUpdate` : `courseTypeCreate`
        }`,
      ),
    );
  }
});

const handleUpdate = handleSubmit(async () => {
  const res = await settingCourseApiService.updateCourseType(
    dialogStore.currentId,
    values,
  );
  if (res?.success) {
    await store.getList();
    dialogStore.close();
    showSuccessNotification(t('settings.success.courseTypeUpdate'));
  } else if (res.errors?.length) {
    handleApiErrors(res.errors[0]);
  } else {
    showErrorNotification(t('settings.success.courseTypeUpdate'));
  }
});
</script>
<template>
  <BaseSettingDialog
    @close="dialogStore.close"
    :loading="dialogStore.isSubmitting"
    :disabled="!meta.valid || courseTypeClone === values.name"
    :title="
      dialogStore.isUpdate ? t('settings.course.update') : t('settings.course.create')
    "
    @submit="dialogStore.isUpdate ? handleUpdate() : handleCreate()"
  >
    <v-row>
      <v-col cols="12">
        <InputText
          name="name"
          :label="$t('settings.course.courseType.label')"
          :placeholder="$t('settings.course.courseType.placeholder')"
          is-required
        />
      </v-col>
    </v-row>
  </BaseSettingDialog>
</template>

<style lang="scss" scoped></style>
