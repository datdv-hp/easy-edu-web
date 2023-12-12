<script lang="ts" setup>
import { maskPhone } from '@/common/helpers';
import { EllipsisTableData, LoadingOverlay, TableBase, TableHeader } from '@/components';
import { useRegistrationStore } from '@/features/registration/stores';

const store = useRegistrationStore();

const updatePage = async (value: number) => {
  store.setPage(value);
  store.getList();
};
</script>
<template>
  <v-card class="mx-4 pa-0">
    <TableHeader
      :total="store.totalPages"
      @change-page="updatePage"
      :page="store.listQuery.page || 1"
      :title="$t('manager.total', { total: store.total })"
    />
    <TableBase class="rounded-0" :is-empty="!store.total">
      <template #thead>
        <tr>
          <th style="width: 72px" class="text-left ws-nowrap">
            <v-checkbox
              color="primary"
              hide-details
              :model-value="!store.isEmptySelected"
              @update:model-value="store.toggleSelectAll()"
              :indeterminate="!store.isEmptySelected && !store.isAllSelected"
            />
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('registration.table.name') }}
          </th>
          <th class="text-left ws-nowrap minW-150px w-20">
            {{ $t('registration.table.email') }}
          </th>
          <th class="text-center ws-nowrap">
            {{ $t('registration.table.phone') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('registration.table.createdAt') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('registration.table.status') }}
          </th>
        </tr>
      </template>
      <template #tbody v-if="!!store.list.length">
        <tr
          v-for="(item, index) in store.list"
          :key="index"
          :class="store.selectedIds[item.id] ? 'selected' : ''"
        >
          <td>
            <v-checkbox
              color="primary"
              hide-details
              :model-value="store.selectedIds[item.id]"
              @update:model-value="store.toggleSelectedId(item.id)"
            />
          </td>
          <EllipsisTableData :text="item.name" />
          <EllipsisTableData :text="item.email" />
          <td class="ws-nowrap">{{ maskPhone(item.phone) }}</td>
          <td class="ws-nowrap">{{ item.createdAt }}</td>
          <td class="ws-nowrap">{{ $t(`registration.status.${item.status}`) }}</td>
        </tr>
      </template>
    </TableBase>
  </v-card>
  <LoadingOverlay :loading="store.isFetching" />
</template>
<style lang="scss" scoped></style>
