<script lang="ts" setup>
import { PageName } from '@/common/constants';
import { ITableSorter } from '@/common/interfaces';
import { useRole } from '@/common/stores/role.store';
import { EllipsisTableData, SortTableColumnHeader, TableBase } from '@/components';
import { useSyllabusStore } from '@/features/syllabus/stores';
import router from '@/plugins/vue-router';

const store = useSyllabusStore();
const role = useRole();

function onChangeOrder({ field, direction }: ITableSorter) {
  store.setOrder({ field, direction });
  store.getList();
}

function goToDetail(id: string) {
  router.push({
    name: PageName.SYLLABUS_DETAIL_PAGE,
    params: {
      id,
    },
  });
}
</script>
<template>
  <TableBase :is-empty="!store.total" :loading="store.isFetching">
    <template #thead>
      <tr>
        <th v-if="role.syllabus?.delete" style="width: 72px" class="text-left ws-nowrap">
          <v-checkbox
            color="primary"
            hide-details
            :model-value="store.isAllSelected || store.showDelete"
            @update:model-value="store.toggleSelectAll()"
            :indeterminate="
              store.showDelete && !store.isEmptySelected && !store.isAllSelected
            "
          />
        </th>
        <th class="text-left ws-nowrap minW-200px w-15">
          {{ $t('syllabus.list.table.name') }}
        </th>
        <th class="text-left ws-nowrap">
          {{ $t('syllabus.list.table.numberOfLectures') }}
        </th>
        <SortTableColumnHeader
          name="createdAt"
          :title="$t('syllabus.list.table.createdAt')"
          @change="onChangeOrder"
          :order-by="store.syllabusListQuery?.orderBy"
          :direction="store.syllabusListQuery?.orderDirection"
        />
        <th class="text-left ws-nowrap minW-200px w-15">
          {{ $t('syllabus.list.table.createdBy') }}
        </th>
        <th class="text-left ws-nowrap minW-200px w-15">
          {{ $t('syllabus.list.table.updatedAt') }}
        </th>
        <th class="text-left ws-nowrap minW-200px w-15">
          {{ $t('syllabus.list.table.updatedBy') }}
        </th>
      </tr>
    </template>
    <template #tbody>
      <tr
        v-for="(item, index) in store.list"
        :key="index"
        :class="store.selectedIds[item.id] ? 'selected' : ''"
        @click.stop="goToDetail(item.id)"
      >
        <td v-if="role.syllabus?.delete" @click.stop>
          <v-checkbox
            color="primary"
            hide-details
            :model-value="store.selectedIds[item.id]"
            @update:model-value="store.setSelectedIds(item.id)"
          />
        </td>
        <EllipsisTableData :text="item.name" />
        <td class="ws-nowrap">{{ item.numberOfLectures }}</td>
        <td class="ws-nowrap">{{ item.createdAt }}</td>
        <EllipsisTableData :text="item.createdBy" />
        <td class="ws-nowrap">{{ item.updatedAt }}</td>
        <EllipsisTableData :text="item.updatedBy" />
      </tr>
    </template>
  </TableBase>
</template>
<style lang="scss" scoped></style>
