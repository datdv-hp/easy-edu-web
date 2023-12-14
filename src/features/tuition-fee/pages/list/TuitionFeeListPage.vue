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
  <div class="wrapper d-flex flex-column">
    <SearchBar />
    <TuitionFeeList class="flex-1" />
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  height: 100%;
  max-height: calc(100vh - $height-header-bar); //60px: the height of header bar
}
</style>
