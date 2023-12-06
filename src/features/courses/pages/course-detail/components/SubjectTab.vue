<script lang="ts" setup>
import { EllipsisTableData, TableBase } from '@/components';
import { useCourseDetail } from '@/features/courses/store';

const store = useCourseDetail();
</script>
<template>
  <TableBase :is-empty="!store.detail?.subjects?.length">
    <template #thead>
      <tr>
        <th class="text-left ws-nowrap minW-50px w-10">
          {{ $t('courses.detail.subject.index') }}
        </th>

        <th class="text-left ws-nowrap">
          {{ $t('courses.detail.subject.name') }}
        </th>
        <th class="text-left ws-nowrap minW-200px w-30">
          {{ $t('courses.detail.subject.code') }}
        </th>
      </tr>
    </template>
    <template #tbody>
      <tr v-for="(item, index) in store.detail?.subjects" :key="index">
        <td>
          {{ index + 1 }}
        </td>
        <EllipsisTableData :text="item.name" />
        <td class="ws-nowrap">
          {{ item.subjectCode }}
        </td>
      </tr>
    </template>
  </TableBase>
</template>
<style lang="scss" scoped>
:deep(.v-table__wrapper) {
  height: calc(100vh - 60px - 32px - 388px - 16px - 16px - 56px - 16px + 120px);
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
}
</style>
