<script lang="ts" setup>
import {
    compareFormData,
    getDiffFormData,
    showErrorNotification,
    showSuccessNotification,
} from '@/common/helpers';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { cloneDeep } from 'lodash';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import TuitionFeePaymentDialog from '../../components/TuitionFeePaymentDialog.vue';
import { removeEmptyPromotions } from '../../helpers';
import { IPromotionInfo } from '../../interfaces';
import { useTuitionFeePaymentDialog, useTuitionFeeStore } from '../../stores';
import PaymentHistories from './components/PaymentHistories.vue';
import PaymentInfo from './components/info/PaymentInfo.vue';
import PromotionProgrammeInfo from './components/info/PromotionProgrammeInfo.vue';
import TuitionFeeBasicInfo from './components/info/TuitionFeeBasicInfo.vue';
import { PromotionType } from '../../constants';
import { nextTick } from 'vue';
import { LoadingOverlay } from '@/components';
import { useRole } from '@/common/stores/role.store';

const dialogStore = useTuitionFeePaymentDialog();
const store = useTuitionFeeStore();
const route = useRoute();
const { t } = useI18n();
const role = useRole();

const {
    values: formValue,
    setValues: setForm,
    resetForm,
    meta,
    handleSubmit,
    setFieldValue,
} = useForm();
const oldForm = ref();
const isValidSubmit = computed(() => {
    return meta.value.valid && !compareFormData(oldForm.value, formValue);
});

onMounted(async () => {
    store.setIsFetching(true);
    await store.getDetail(route.params.id as string);
    store.setIsFetching(false);
});

async function initFormDetail() {
    store.setIsFetching(true);
    await Promise.all([
        store.isAbleUpdatePromotion
            ? store.getPromotionOptions(store.detail?.courseId)
            : undefined,
        store.getDetail(route.params.id as string),
    ]);
    const detail = store.detail;
    const form = {
        payment: {
            startDate: detail?.startDate,
            endDate: detail?.endDate,
        },
        promotionValue: detail?.promotionValue,
    };
    if (store.isAbleUpdatePromotion) {
        const promotions =
            detail?.promotions?.map((item) => ({
                id: item.id,
                finalValue: item.finalValue,
                priority: item.priority,
            })) || [];
        form['promotions'] = promotions;
    }
    setForm(form);
    oldForm.value = cloneDeep(formValue);
    store.setIsFetching(false);
}

const handleClickSubmit = handleSubmit(async (values) => {
    store.setIsSubmitting(true);
    const diffData = getDiffFormData(oldForm.value, {
        ...values,
        promotions: removeEmptyPromotions(values.promotions),
    });
    const res = await store.update(route.params.id as string, diffData);
    store.setIsSubmitting(false);
    if (res.success) {
        showSuccessNotification(t('tuitionFee.success.update'));
        store.getDetail(route.params.id as string);
        handleCloseUpdating();
        return;
    }
    showErrorNotification(res.error || (res.message as string));
});
function handleClickUpdate() {
    initFormDetail();
}
function handleCloseUpdating() {
    store.setIsUpdating(false);
    resetForm();
}
function handleAddPromotion() {
    const promotions = formValue.promotions as IPromotionInfo[];
    promotions.push({} as IPromotionInfo);
    setFieldValue('promotions', promotions);
}
function handleRemovePromotion(index: number) {
    const promotions = formValue.promotions as IPromotionInfo[];
    promotions.splice(index, 1);
    updatePromotionValue();
}
async function updatePromotionValue() {
    await nextTick(() => {
        const mappedPromotion = {};
        const sortedPromotions = formValue.promotions
            .filter((item) => item.id && item.priority)
            .sort((a, b) => a.priority - b.priority);
        let remainValue = store.detail?.originalValue || 0;
        sortedPromotions.forEach((_promotion) => {
            const promotion = store.promotionsMapObject[_promotion.id];
            const finalValue =
                promotion.type === PromotionType.PERCENTAGE
                    ? remainValue * (promotion.value / 100)
                    : promotion.value;
            remainValue = Math.max(remainValue - finalValue, 0);
            mappedPromotion[_promotion.id] = {
                ..._promotion,
                finalValue,
            };
        });
        const promotionValue = (store.detail?.originalValue || 0) - remainValue;
        const promotions = formValue.promotions.map((item) => ({
            ...item,
            finalValue: 0,
            ...mappedPromotion[item.id],
        }));
        setFieldValue('promotionValue', promotionValue);
        setFieldValue('promotions', promotions);
    });
}
</script>
<template>
    <HeaderBar :title="$t('tuitionFee.detail.title')" />
    <v-card class="mx-4 mt-4 detail-card-wrap">
        <v-card-text>
            <TuitionFeeBasicInfo
                :is-valid-submit="isValidSubmit"
                @click:update="handleClickUpdate"
                @click:cancel="handleCloseUpdating"
                @click:submit="handleClickSubmit"
            />
            <PromotionProgrammeInfo
                name="promotions"
                :promotions="formValue.promotions?.length ? formValue.promotions : [{}]"
                @add:promotion-programme="handleAddPromotion"
                @remove:promotion-programme="handleRemovePromotion"
                @change:promotion-programme="updatePromotionValue"
            />
            <PaymentInfo />
        </v-card-text>
    </v-card>
    <v-card class="mx-4 mt-4 detail-card-wrap">
        <v-card-text> <PaymentHistories /> </v-card-text>
    </v-card>
    <TuitionFeePaymentDialog v-if="dialogStore.isOpen && role.tuition?.update" />
    <LoadingOverlay :loading="store.isFetching" />
</template>
<style lang="scss" scoped></style>
