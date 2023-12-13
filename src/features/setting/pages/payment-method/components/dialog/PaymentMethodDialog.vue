<script lang="ts" setup>
import { ErrorCode, FORM_VALIDATION } from '@/common/constants';
import {
    compareFormData,
    showErrorNotification,
    showSuccessNotification,
} from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { BaseDialog, InputText } from '@/components';
import { usePaymentMethodDialog } from '@/features/setting/stores/payment-method-dialog';
import { usePaymentMethodStore } from '@/features/setting/stores/payment-method.store';
import { paymentMethodFormSchema } from '@/features/setting/validations/payment-method.validation';
import { cloneDeep } from 'lodash';
import { useForm } from 'vee-validate';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const dialogStore = usePaymentMethodDialog();
const store = usePaymentMethodStore();
const { t } = useI18n();
const {
    handleSubmit,
    resetForm,
    setValues: setForm,
    meta,
    values: formValue,
    setFieldError,
} = useForm({
    validationSchema: paymentMethodFormSchema,
});
const oldForm = ref();
const isValidSubmit = computed(
    () => meta.value.valid && !compareFormData(oldForm.value, formValue),
);

const formTitle = computed(() =>
    dialogStore.isUpdate
        ? t('paymentMethod.form.update.title')
        : t('paymentMethod.form.create.title'),
);

onMounted(async () => {
    if (dialogStore.isUpdate) {
        dialogStore.setIsFetching(true);
        await store.getDetail(dialogStore.currentId);
        const detail = store.detail;
        setForm({
            name: detail?.name,
        });
        oldForm.value = cloneDeep(formValue);
        dialogStore.setIsFetching(false);
    }
});

const handleCloseDialog = () => {
    resetForm();
    dialogStore.close();
};

function handleUpdateError(error: IResponseError) {
    const errorCode = error.errorCode;
    const errorKey = error.key;
    const i18nKey = `paymentMethod.updateError.${errorCode}.${errorKey}`;
    switch (errorCode) {
        case ErrorCode.ITEM_ALREADY_EXIST:
            setFieldError(errorKey, t(i18nKey));
            break;

        default:
            showErrorNotification(t('paymentMethod.error.update'));
            break;
    }
}
function handleCreateError(error: IResponseError) {
    const errorCode = error.errorCode;
    const errorKey = error.key;
    const i18nKey = `paymentMethod.createError.${errorCode}.${errorKey}`;
    switch (errorCode) {
        case ErrorCode.ITEM_ALREADY_EXIST:
            setFieldError(errorKey, t(i18nKey));
            break;

        default:
            showErrorNotification(t('paymentMethod.error.create'));
            break;
    }
}

const handleClickUpdate = handleSubmit(async (values) => {
    const res = await store.update(dialogStore.currentId, values);
    if (res.success) {
        handleCloseDialog();
        showSuccessNotification(t('paymentMethod.success.update'));
        store.getList();
        return;
    }
    if (res.errors?.length) {
        handleUpdateError(res.errors[0]);
    } else {
        showErrorNotification(res.error || (res.message as string));
    }
});

const handleClickCreate = handleSubmit(async (values) => {
    const res = await store.create(values);
    if (res.success) {
        handleCloseDialog();
        showSuccessNotification(t('paymentMethod.success.create'));
        store.getList();
        return;
    }
    if (res.errors?.length) {
        handleCreateError(res.errors[0]);
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
                    :label="$t('paymentMethod.form.name')"
                    :placeholder="$t('paymentMethod.form.placeholder.name')"
                    :is-required="true"
                    :max-length="FORM_VALIDATION.textMaxLength"
                />
            </v-col>
        </v-row>
    </BaseDialog>
</template>
<style lang="scss" scoped></style>
