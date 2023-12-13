<script lang="ts" setup>
import { SearchForm } from '@/components';
import { usePromotionProgrammeStore } from '@/features/setting/stores/promotion-programme.store';
import { useForm } from 'vee-validate';
import { onBeforeUnmount, onMounted } from 'vue';

const store = usePromotionProgrammeStore();

const { handleSubmit, setFieldValue } = useForm();

onMounted(async () => {
    setFieldValue('keyword', store.listQuery?.keyword);
});

onBeforeUnmount(() => {
    store.setKeyword(undefined);
});

const submit = handleSubmit(async (values) => {
    store.listQuery.keyword = values.keyword?.trim();
    setFieldValue('keyword', store.listQuery.keyword);
    await store.getList();
});
</script>

<template>
    <SearchForm @submit="submit()"> </SearchForm>
</template>

<style lang="scss" scoped></style>
