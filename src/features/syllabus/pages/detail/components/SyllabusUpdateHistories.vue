<script lang="ts" setup>
import { EllipsisTableData, TableBase, TableHeader } from '@/components';
import ExpandList from './ExpandList.vue';
import { calculateTableIndex } from '@/features/classroom/helpers';
import { useSyllabusDetail } from '@/features/syllabus/stores';
import { useRoute } from 'vue-router';

const store = useSyllabusDetail();
const route = useRoute();

async function updatePage(page: number) {
  store.setHistoryPage(page);
  store.getUpdateHistoryList(route.params.id as string);
}

function getRowIndex(index: number) {
  return calculateTableIndex(
    index,
    store.historyListQuery.page,
    store.historyListQuery.limit,
  );
}
</script>
<template>
  <ExpandList :title="$t('syllabus.detail.updateHistories.title')">
    <TableHeader
      class="history-list-header"
      :total="store.totalHistoryPages"
      @change-page="updatePage"
      :show-delete="false"
      :page="store.historyListQuery.page || 1"
      :title="
        $t('syllabus.detail.updateHistories.total', {
          total: store.totalHistoryRecords,
        })
      "
    >
    </TableHeader>
    <TableBase
      :is-empty="!store.historyList?.length"
      :loading="store.isFetching.updateHistories"
      :isBorderAll="true"
    >
      <template #thead>
        <tr>
          <th class="text-left ws-nowrap minW-50px w-10">
            {{ $t('syllabus.detail.updateHistories.table.index') }}
          </th>
          <th class="text-left ws-nowrap minW-200px w-20">
            {{ $t('syllabus.detail.updateHistories.table.updatedAt') }}
          </th>
          <th class="text-left ws-nowrap minW-200px w-20">
            {{ $t('syllabus.detail.updateHistories.table.updatedBy') }}
          </th>
          <th class="text-left ws-nowrap minW-200px w-50">
            {{ $t('syllabus.detail.updateHistories.table.note') }}
          </th>
        </tr>
      </template>
      <template #tbody>
        <tr
          v-for="(item, index) in store.historyList"
          :key="index"
          :class="store.selectedLectureIdList[item.id] ? 'selected' : ''"
        >
          <td class="ws-nowrap">
            {{ getRowIndex(index) }}
          </td>
          <td class="ws-nowrap">
            {{ item.updatedAt }}
          </td>
          <EllipsisTableData :text="item.updatedBy" />
          <td>
            {{ item.note }}
          </td>
        </tr>
      </template>
    </TableBase>
  </ExpandList>
</template>
<style lang="scss" scoped>
.history-list-header {
  border: unset;
  border-top: 1px solid $color-neutral-6;
  border-radius: 0;
  padding-right: 0;
  padding-left: 12px;
  padding: 13px 0 9px 12px;
}

:deep(.v-table__wrapper) {
  border-radius: 8px;
  height: unset;
  max-height: 500px;
  border: 1px solid $color-neutral-6;
}
</style>
