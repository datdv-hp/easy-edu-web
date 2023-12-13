<script lang="ts" setup>
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { BaseAutoComplete, BaseDialog, DatePicker, InputNumber } from '@/components';
import { CurrencySuffix } from '@/features/setting/constant';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { convertToPaymentInfo, formatCurrencyVND } from '../helpers';
import { IPaymentInfo } from '../interfaces';
import { createPaymentFormSchema } from '../schema';
import {
    useTuitionFeeDetail,
    useTuitionFeePaymentDialog,
    useTuitionFeeStore,
} from '../stores';
import dayjs from '@/plugins/dayjs';

const dialogStore = useTuitionFeePaymentDialog();
const detail = useTuitionFeeDetail();
const store = useTuitionFeeStore();

const { t } = useI18n();
const route = useRoute();
const paymentInfo = ref<IPaymentInfo>();
const { handleSubmit, resetForm, meta } = useForm({
    validationSchema: createPaymentFormSchema,
});
const handleCloseDialog = () => {
    resetForm();
    dialogStore.close();
};
const info = computed(() => {
    return [
        {
            title: t('tuitionFee.form.payment.value'),
            value: formatCurrencyVND(paymentInfo.value?.payValue || 0),
            colorClass: 'blue',
        },
        {
            title: t('tuitionFee.form.payment.paidValue'),
            value: formatCurrencyVND(paymentInfo.value?.paidValue || 0),
            colorClass: 'green',
        },
        {
            title: t('tuitionFee.form.payment.shortageValue'),
            value: formatCurrencyVND(paymentInfo.value?.shortageValue || 0),
            colorClass: 'yellow',
        },
    ];
});

onMounted(async () => {
    dialogStore.setIsFetching(true);
    const [res, _] = await Promise.all([
        detail.getPaymentInfo(route.params.id as string),
        detail.getPaymentMethodOptions(),
    ]);
    if (res.success) {
        paymentInfo.value = convertToPaymentInfo(res.data);
    }
    dialogStore.setIsFetching(false);
});

function handleCreateErrors(error: IResponseError) {
    const { errorCode } = error;
    // const i18nKey = `tuitionFee.paymentError.${errorCode}.${key}`;
    switch (errorCode) {
        default:
            showErrorNotification(t('tuitionFee.error.payment'));
            break;
    }
}
const handleClickCreatePayment = handleSubmit(async (values) => {
    dialogStore.setIsSubmitting(true);
    const res = await store.createPayment(route.params.id as string, values);
    if (res.success) {
        showSuccessNotification(t('tuitionFee.success.create'));
        detail.getPaymentHistories(route.params.id as string);
        store.getDetail(route.params.id as string);
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
</script>
<template>
    <BaseDialog
        @close="handleCloseDialog"
        :overlay="dialogStore.isFetching"
        :loading="dialogStore.isSubmitting"
        :disabled="!meta.valid"
        :title="$t('tuitionFee.dialog.paymentTitle')"
        @submit="handleClickCreatePayment"
    >
        <v-row>
            <v-col v-for="(item, index) in info" cols="4" :key="index">
                <div class="payment-info">
                    <div class="payment-info__title text-form-label">
                        {{ item.title }}
                    </div>
                    <div class="payment-info__value" :class="item.colorClass">
                        {{ item.value }}
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <DatePicker
                    name="paymentDate"
                    :label="$t('tuitionFee.form.payment.paymentDate')"
                    :placeholder="$t('tuitionFee.form.payment.placeholder.paymentDate')"
                    :max="dayjs().toDate()"
                    :is-required="true"
                />
            </v-col>
            <v-col cols="12">
                <BaseAutoComplete
                    name="paymentMethodId"
                    :items="detail.paymentMethodOptions"
                    :label="$t('tuitionFee.form.payment.paymentMethod')"
                    :placeholder="$t('tuitionFee.form.payment.placeholder.paymentMethod')"
                />
            </v-col>
            <v-col cols="12">
                <InputNumber
                    name="value"
                    :label="$t('tuitionFee.form.payment.payValue')"
                    :placeholder="$t('tuitionFee.form.payment.placeholder.payValue')"
                    :max="paymentInfo?.shortageValue"
                    :suffix="CurrencySuffix.VND"
                />
            </v-col>
        </v-row>
    </BaseDialog>
</template>
<style lang="scss" scoped>
.payment-info__value {
    border-radius: 8px;
    padding: 12px;
    color: $color-white;
    font-weight: 600;
    font-size: 16px;
    &.blue {
        background-color: $color-state-info;
    }
    &.green {
        background-color: $color-state-success;
    }
    &.yellow {
        background-color: $color-state-warning;
    }
}
</style>
