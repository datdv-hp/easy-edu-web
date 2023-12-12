<script lang="ts" setup>
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { onMounted } from 'vue';
import { useRegistrationStore } from '../../stores';
import RegistrationList from './component/RegistrationList.vue';
import SearchBar from './component/SearchBar.vue';

const store = useRegistrationStore();

onMounted(() => {
  store.getList();
});
</script>
<template>
  <HeaderBar :title="$t('registration.list')"> </HeaderBar>
  <SearchBar />
  <RegistrationList />
</template>
<style lang="scss" scoped></style>
