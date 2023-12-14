<script lang="ts" setup>
import { TableBase, TableHeader } from '@/components';
import { calculateTableIndex } from '@/features/classroom/helpers';
import { useTuitionFeeDetail } from '@/features/tuition-fee/stores';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const detail = useTuitionFeeDetail();
function updatePage(value: number) {
  detail.setPage(value);
  detail.getPaymentHistories(route.params.id as string);
}

onMounted(async () => {
  detail.getPaymentHistories(route.params.id as string);
});
</script>
<template>
  <div class="profile-title mt-0 mb-2">
    {{ $t('tuitionFee.detail.paymentHistory.title') }}
  </div>
  <TableHeader
    :total="detail.totalPages"
    @change-page="updatePage"
    :page="detail.listQuery.page || 1"
    :title="$t('tuitionFee.detail.paymentHistory.total', { total: detail.total })"
  />
  <TableBase :is-empty="!detail.total && !detail.isFetching" :loading="detail.isFetching">
    <template #thead>
      <tr>
        <th class="text-left ws-nowrap">
          {{ $t('tuitionFee.detail.paymentHistory.index') }}
        </th>
        <th class="text-left ws-nowrap">
          {{ $t('tuitionFee.detail.paymentHistory.paidValue') }}
        </th>
        <th class="text-left ws-nowrap">
          {{ $t('tuitionFee.detail.paymentHistory.method') }}
        </th>
        <th class="text-left ws-nowrap">
          {{ $t('tuitionFee.detail.paymentHistory.date') }}
        </th>
        <th class="text-left ws-nowrap">
          {{ $t('tuitionFee.detail.paymentHistory.editDate') }}
        </th>
      </tr>
    </template>
    <template #tbody>
      <tr v-for="(item, index) in detail.list" :key="index">
        <td class="ws-nowrap">
          {{
            calculateTableIndex(index, detail.listQuery?.page, detail.listQuery?.limit)
          }}
        </td>
        <td class="text-left ws-nowrap">{{ item.value }}</td>
        <td class="text-left ws-nowrap">{{ item.method }}</td>
        <td class="text-left ws-nowrap">{{ item.paymentDate }}</td>
        <td class="text-left ws-nowrap">{{ item.editDate }}</td>
      </tr></template
    >
  </TableBase>
</template>
<style lang="scss" scoped>
:deep(.v-table__wrapper) {
  height: unset;
  max-height: calc(100vh - $offset-table-height-without-tab);
  min-height: 300px;
  border: 1px solid $color-neutral-6;
  border-radius: 4px;
}
</style>
