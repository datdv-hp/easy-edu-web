<script lang="ts" setup>
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { onBeforeMount } from 'vue';
import { useTuitionFeeStore } from '../../stores';
import SearchBar from './components/SearchBar.vue';
import TuitionFeeList from './components/TuitionFeeList.vue';

const store = useTuitionFeeStore();
onBeforeMount(async () => {
    store.getList();
});
</script>
<template>
    <HeaderBar :title="$t('tuitionFee.list')" />
    <SearchBar />
    <TuitionFeeList />
</template>
<style lang="scss" scoped></style>
