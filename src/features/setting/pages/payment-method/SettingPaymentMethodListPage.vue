<script lang="ts" setup>
import { BaseButton } from '@/components';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { usePaymentMethodDialog } from '../../stores/payment-method-dialog';
import PaymentMethodDialog from './components/dialog/PaymentMethodDialog.vue';
import PaymentMethodList from './components/list/PaymentMethodList.vue';
import SearchBar from './components/list/SearchBar.vue';
import { useRole } from '@/common/stores/role.store';

const dialogStore = usePaymentMethodDialog();
const role = useRole();
</script>
<template>
    <HeaderBar :title="$t('paymentMethod.list.title')">
        <template #append>
            <BaseButton
                v-if="role.paymentMethodSetting?.create"
                left-icon="mdi-plus"
                size="extra-small"
                :label="$t('common.button.create')"
                @click="dialogStore.open()"
            />
        </template>
    </HeaderBar>
    <SearchBar />
    <PaymentMethodList />
    <PaymentMethodDialog
        v-if="
            dialogStore.isOpen &&
            (role?.paymentMethodSetting?.create || role.paymentMethodSetting?.update)
        "
    />
</template>
<style lang="scss" scoped></style>
