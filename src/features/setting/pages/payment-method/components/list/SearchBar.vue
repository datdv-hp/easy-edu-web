<script lang="ts" setup>
import { SearchForm } from '@/components';
import { usePaymentMethodStore } from '@/features/setting/stores/payment-method.store';
import { useForm } from 'vee-validate';

const store = usePaymentMethodStore();
const { handleSubmit, setFieldValue } = useForm();

const submit = handleSubmit(async (values) => {
    store.listQuery.keyword = values.keyword?.trim();
    setFieldValue('keyword', store.listQuery.keyword);
    store.getList();
});
</script>
<template>
    <SearchForm @submit="submit()"></SearchForm>
</template>
<style lang="scss" scoped></style>
