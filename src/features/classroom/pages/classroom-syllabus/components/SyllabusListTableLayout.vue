<script setup lang="ts">
import { DEFAULT_FIRST_PAGE, PageName } from '@/common/constants';
import { TableBase } from '@/components';
import { calculateTableIndex } from '@/features/classroom/helpers';
import { useClassroomSyllabusStore } from '@/features/classroom/stores';
import router from '@/plugins/vue-router';
import { onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const store = useClassroomSyllabusStore();

const { t } = useI18n();

onUnmounted(() => {
  store.classroomSyllabusListQuery.page = DEFAULT_FIRST_PAGE;
});

function calcTableIndex(index: number) {
  return calculateTableIndex(
    index,
    store.classroomSyllabusListQuery?.page,
    store.classroomSyllabusListQuery?.limit,
  );
}

function goToSyllabusDetailPage(id: string) {
  router.push({ name: PageName.SYLLABUS_DETAIL_PAGE, params: { id } });
}
</script>
<template>
  <TableBase :is-empty="!store.total && !store.isFetching" :loading="store.isFetching">
    <template #thead>
      <tr>
        <th class="text-left">
          {{ t('classroom.syllabusList.table.index') }}
        </th>
        <th class="text-left">
          {{ t('classroom.syllabusList.table.name') }}
        </th>
        <th class="text-left">
          {{ t('classroom.syllabusList.table.numberOfLectures') }}
        </th>
      </tr>
    </template>
    <template #tbody>
      <tr
        v-for="(item, index) in store.list"
        :key="index"
        @click.stop="goToSyllabusDetailPage(item.id)"
      >
        <td>{{ calcTableIndex(index) }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.numberOfLectures }}</td>
      </tr>
    </template>
  </TableBase>
</template>

<style lang="scss" scoped>
:deep(.v-table__wrapper) {
  height: calc(100vh - 211px);
}
</style>
