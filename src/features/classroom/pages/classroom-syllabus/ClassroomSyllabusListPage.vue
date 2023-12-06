<script setup lang="ts">
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useClassroomStore, useClassroomSyllabusStore } from '../../stores';
import SyllabusList from './components/SyllabusList.vue';
import SearchBar from './components/SearchBar.vue';
import { computed } from 'vue';

const store = useClassroomSyllabusStore();
const classroomStore = useClassroomStore();
const route = useRoute();

onMounted(async () => {
  store.getSyllabusList(route.params.id as string);
  classroomStore.getDetail(route.params.id as string);
});

const classroomName = computed(() => classroomStore.detail?.name || '');
</script>

<template>
  <HeaderBar :title="$t('classroom.syllabusList.title', { name: classroomName })" />
  <SearchBar />
  <SyllabusList />
</template>

<style scoped lang="scss"></style>
