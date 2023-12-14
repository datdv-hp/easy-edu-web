<script lang="ts" setup>
import { useRole } from '@/common/stores/role.store';
import { BaseButton, ProfileItem } from '@/components';
import { formatCurrencyVND } from '@/features/tuition-fee/helpers';
import {
    useTuitionFeePaymentDialog,
    useTuitionFeeStore,
} from '@/features/tuition-fee/stores';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const store = useTuitionFeeStore();
const paymentDialog = useTuitionFeePaymentDialog();
const role = useRole();
const { t } = useI18n();

const paymentInfo = computed(() => {
    const _paymentInfo = [
        {
            icon: '$custom.dollar-circle',
            title: t('tuitionFee.detail.payment.value'),
            description: formatCurrencyVND(store.detail?.payValue || 0),
            isShow: true,
        },
        {
            icon: '$custom.money-receive',
            title: t('tuitionFee.detail.payment.paidValue'),
            description: formatCurrencyVND(store.detail?.paidValue || 0),
            isShow: true,
        },
        {
            icon: '$custom.money-send',
            title: t('tuitionFee.detail.payment.shortageValue'),
            description: formatCurrencyVND(store.detail?.shortageValue || 0),
            isShow: true,
        },
    ];
    return _paymentInfo;
});

const isAbleToPay = computed(() => {
    return store.detail?.shortageValue;
});

function handleClickPay() {
    paymentDialog.open();
}
</script>
<template>
    <div class="d-flex align-center mt-8 mb-4 gap--3">
        <div class="profile-title">
            {{ $t('tuitionFee.detail.payment.title') }}
        </div>
        <BaseButton
            v-if="!store.isUpdating && isAbleToPay && role.tuition?.update"
            size="extra-small"
            class="ms-4 px-0"
            :label="$t('common.button.pay')"
            @click.stop="handleClickPay"
        />
    </div>
    <v-row>
        <v-col
            cols="4"
            v-for="(item, index) in paymentInfo"
            :key="`${item.description}${index}`"
        >
            <ProfileItem
                :icon-string="item.icon"
                :title="item.title"
                :description="(item.description as string)"
            />
        </v-col>
    </v-row>
</template>
<style lang="scss" scoped></style>
