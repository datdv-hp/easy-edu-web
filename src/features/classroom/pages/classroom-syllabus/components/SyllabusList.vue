<script setup lang="ts">
import { DEFAULT_FIRST_PAGE } from '@/common/constants';
import { LoadingOverlay, TableHeader } from '@/components';
import { useClassroomSyllabusStore } from '@/features/classroom/stores';
import { computed, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import SyllabusListGridLayout from './SyllabusListGridLayout.vue';
import SyllabusListTableLayout from './SyllabusListTableLayout.vue';

const store = useClassroomSyllabusStore();
const route = useRoute();

const updatePage = async (value: number) => {
  store.setPage(value);
  store.getSyllabusList(route.params.id as string);
};

onUnmounted(() => {
  store.classroomSyllabusListQuery.page = DEFAULT_FIRST_PAGE;
});
const bgColor = computed(() => (store.layout === 'table' ? '#FFF' : 'transparent'));
</script>
<template>
  <v-card class="mx-4 pa-0" :color="bgColor" v-show="store.layout === 'table'">
    <TableHeader
      :total="store.totalPages"
      @change-page="updatePage"
      :show-delete="false"
      :class="!store.isTableLayout ? 'grid-header' : ''"
      :page="store.classroomSyllabusListQuery.page || DEFAULT_FIRST_PAGE"
      :title="$t('classroom.syllabusList.total', { total: store.total })"
    />
    <SyllabusListTableLayout />
  </v-card>
  <div class="ma-4" v-show="store.layout === 'grid'">
    <TableHeader
      :total="store.totalPages"
      @change-page="updatePage"
      :show-delete="false"
      :class="!store.isTableLayout ? 'grid-header' : ''"
      :page="store.classroomSyllabusListQuery.page || DEFAULT_FIRST_PAGE"
      :title="$t('classroom.syllabusList.total', { total: store.total })"
    />
    <SyllabusListGridLayout />
  </div>
  <LoadingOverlay :loading="store.isFetching && !store.isTableLayout" />
</template>

<style lang="scss" scoped>
.grid-header {
  border: none;
  padding: 0 0 12px 0;
}
</style>
