<script lang="ts" setup>
import { FORM_VALIDATION } from '@/common/constants';
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
  DatePicker,
  InputNumber,
  InputText,
  InputTextarea,
  SingleSelect,
} from '@/components';
import { PromotionType, PromotionValueSuffix } from '@/features/setting/constant';
import { usePromotionProgrammeDialog } from '@/features/setting/stores/promotion-programme-dialog';
import { usePromotionProgrammeStore } from '@/features/setting/stores/promotion-programme.store';
import { promotionProgrammeFormSchema } from '@/features/setting/validations';
import dayjs from '@/plugins/dayjs';
import { cloneDeep } from 'lodash';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const dialogStore = usePromotionProgrammeDialog();
const store = usePromotionProgrammeStore();
const { t } = useI18n();

const {
  handleSubmit,
  resetForm,
  setValues: setForm,
  meta,
  values: formValue,
  resetField,
} = useForm({
  validationSchema: promotionProgrammeFormSchema,
});
const oldForm = ref();
const isValidSubmit = computed(
  () => meta.value.valid && !compareFormData(oldForm.value, formValue),
);

// Hooks
onMounted(async () => {
  dialogStore.setIsFetching(true);
  const courseOptions = store.getCourseOptions();
  if (dialogStore.isUpdate) {
    await Promise.all([store.getDetail(dialogStore.currentId), courseOptions]);
    const detail = store.detail;
    setForm({
      name: detail?.name,
      info: {
        type: detail?.type || PromotionType.PERCENTAGE,
        value: detail?.value,
      },
      applyForCourseIds: detail?.applyForCourseIds,
      startDate: detail?.startDate,
      endDate: detail?.endDate,
      times: detail?.times,
      description: detail?.description,
    });
    oldForm.value = cloneDeep(formValue);
    oldForm.value.info.value = detail?.value.toString();
    oldForm.value.times = detail?.times.toString();
  } else {
    setForm({ info: { type: PromotionType.PERCENTAGE } }, false);
    await courseOptions;
  }
  dialogStore.setIsFetching(false);
});

const discountTypeOptions = computed(() => {
  return Object.values(PromotionType).map((type) => ({
    title: t(`promotionProgramme.type.${type}`),
    value: type,
  }));
});

const handleCloseDialog = () => {
  resetForm();
  dialogStore.close();
};

function handleChangeDiscountType() {
  resetField('info.value');
}

function handleCreateErrors(error: IResponseError) {
  const { errorCode } = error;
  switch (errorCode) {
    default:
      showErrorNotification(t('promotionProgramme.error.create'));
      break;
  }
}

function handleUpdateErrors(error: IResponseError) {
  const { errorCode } = error;
  switch (errorCode) {
    default:
      showErrorNotification(t('promotionProgramme.error.update'));
      break;
  }
}

const handleClickCreate = handleSubmit(async (values) => {
  dialogStore.setIsSubmitting(true);
  const res = await store.create(values);
  if (res.success) {
    showSuccessNotification(t('promotionProgramme.success.create'));
    store.getList();
    handleCloseDialog();
    return;
  }
  dialogStore.setIsSubmitting(false);
  if (res.errors?.length) {
    handleCreateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
});
const handleClickUpdate = handleSubmit(async (values) => {
  dialogStore.setIsSubmitting(true);
  const res = await store.update(
    dialogStore.currentId as string,
    getDiffFormData(oldForm.value, values, ['startDate', 'endDate']),
  );
  if (res?.success) {
    showSuccessNotification(t('promotionProgramme.success.update'));
    store.getDetail();
    handleCloseDialog();
    return;
  }
  dialogStore.setIsSubmitting(false);
  if (res?.errors?.length) {
    handleUpdateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
});

function submit() {
  if (dialogStore.isUpdate) {
    handleClickUpdate();
    return;
  }
  handleClickCreate();
}

const formTitle = computed(() =>
  dialogStore.isUpdate
    ? t('promotionProgramme.form.update.title')
    : t('promotionProgramme.form.create.title'),
);
const isFixedAmountDiscount = computed(
  () => formValue.info?.type === PromotionType.FIXED_AMOUNT,
);
</script>
<template>
  <BaseDialog
    @close="handleCloseDialog"
    :overlay="dialogStore.isFetching"
    :loading="dialogStore.isSubmitting"
    :disabled="!isValidSubmit"
    :title="formTitle"
    @submit="submit"
  >
    <v-row>
      <v-col cols="12">
        <InputText
          name="name"
          :label="$t('promotionProgramme.form.name')"
          :placeholder="$t('promotionProgramme.form.placeholder.name')"
          :is-required="true"
        />
      </v-col>
      <v-col cols="12">
        <InputTextarea
          name="description"
          :max-length="FORM_VALIDATION.textAreaMaxLength"
          :counter="FORM_VALIDATION.textAreaMaxLength"
          :label="$t('promotionProgramme.form.description')"
          :placeholder="$t('promotionProgramme.form.placeholder.description')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <SingleSelect
          name="info.type"
          :label="$t('promotionProgramme.form.type')"
          :items="discountTypeOptions"
          :clearable="false"
          :is-required="true"
          @change="handleChangeDiscountType"
        />
      </v-col>
      <v-col cols="6">
        <InputNumber
          name="info.value"
          :label="$t(`promotionProgramme.form.value.${formValue.info?.type}`)"
          :placeholder="
            $t(`promotionProgramme.form.placeholder.value.${formValue.info?.type}`)
          "
          :clearable="true"
          :suffix="PromotionValueSuffix[formValue.info?.type]"
          :is-required="true"
          :is-float-number="isFixedAmountDiscount"
          :max="!isFixedAmountDiscount ? 100 : undefined"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <BaseAutoComplete
          name="applyForCourseIds"
          :label="$t('promotionProgramme.form.applyForCourses')"
          :placeholder="$t('promotionProgramme.form.placeholder.applyForCourses')"
          :items="store.courseOptions"
          :multiple="true"
        />
      </v-col>
      <v-col cols="6">
        <InputNumber
          name="times"
          :label="$t('promotionProgramme.form.times')"
          :placeholder="$t('promotionProgramme.form.placeholder.times')"
          :is-required="true"
          :clearable="true"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <DatePicker
          name="startDate"
          :label="$t('promotionProgramme.form.startDate')"
          :placeholder="$t('promotionProgramme.form.placeholder.startDate')"
          :is-required="true"
          :min="dayjs().toDate()"
          :max="
            formValue?.endDate
              ? dayjs(formValue?.endDate).subtract(1, 'day').toDate()
              : undefined
          "
        />
      </v-col>
      <v-col cols="6">
        <DatePicker
          name="endDate"
          :label="$t('promotionProgramme.form.endDate')"
          :placeholder="$t('promotionProgramme.form.placeholder.endDate')"
          :is-required="true"
          :min="
            formValue?.startDate
              ? dayjs(formValue?.startDate).add(1, 'day').toDate()
              : dayjs().toDate()
          "
        />
      </v-col>
    </v-row>
  </BaseDialog>
</template>
<style lang="scss" scoped></style>
