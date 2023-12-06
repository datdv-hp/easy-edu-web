<script lang="ts" setup>
import SearchBar from './components/SearchBar.vue';
import TimekeepingList from './components/TimekeepingList.vue';
import { ref } from 'vue';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';

const searchBar = ref<HTMLElement | null>(null);
</script>

<template>
  <HeaderBar :title="$t('timekeeping.title')"> </HeaderBar>
  <SearchBar ref="searchBar" />
  <TimekeepingList />
</template>

<style lang="scss" scoped></style>
