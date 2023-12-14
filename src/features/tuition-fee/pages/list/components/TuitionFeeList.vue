<script lang="ts" setup>
import { useScrolling } from '@/common/composable/use-scroll';
import { PageName } from '@/common/constants';
import { EllipsisTableData, TableBase, TableHeader } from '@/components';
import StatusDot from '@/components/StatusDot.vue';
import { useTuitionFeeStore } from '@/features/tuition-fee/stores';
import { useElementBounding } from '@vueuse/core';
import { computed, ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { VTable } from 'vuetify/lib/components/index.mjs';
import { TuitionStatusColor } from '@/features/tuition-fee/constants';

const router = useRouter();
const store = useTuitionFeeStore();
const tableRef = ref<VTable | null>(null);
const scroll = useScrolling(tableRef, 'v-table__wrapper');

async function updatePage(value: number) {
  store.setPage(value);
  store.getList();
}
const firstColumnRef = shallowRef<HTMLTableCellElement | null>(null);
const secondColumnRef = shallowRef<HTMLTableCellElement | null>(null);

const firstColumn = useElementBounding(firstColumnRef);
const secondColumn = useElementBounding(secondColumnRef);

const firstColumnWidth = computed(() => `${firstColumn.width.value}px`);
const firstGroupWidth = computed(() => {
  return `${firstColumn.width.value + secondColumn.width.value}px`;
});

function goDetailPage(id: string) {
  router.push({ name: PageName.TUITION_FEE_DETAIL_PAGE, params: { id } });
}
</script>
<template>
  <v-card class="card-wrapper">
    <TableHeader
      class="table-header"
      :total="store.totalPages"
      :show-delete="!store.isEmptySelected"
      @change-page="updatePage"
      :page="store.listQuery.page || 1"
      :title="$t('tuitionFee.total', { total: store.total })"
    />
    <TableBase
      :is-empty="!store.total && !store.isFetching"
      :loading="store.isFetching"
      ref="tableRef"
      :class="{
        'show-left-shadow': !scroll.arrivedState.left,
        'show-right-shadow': !scroll.arrivedState.right,
      }"
    >
      <template #thead>
        <tr>
          <th
            ref="firstColumnRef"
            class="text-left ws-nowrap"
            :class="{ 'first-column': store.total }"
          >
            {{ $t('tuitionFee.table.id') }}
          </th>
          <th
            ref="secondColumnRef"
            class="text-left ws-nowrap minW-200px w-15"
            :class="{ 'second-column': store.total }"
          >
            {{ $t('tuitionFee.table.studentName') }}
          </th>
          <th class="text-left ws-nowrap minW-150px w-15">
            {{ $t('tuitionFee.table.className') }}
          </th>
          <th class="text-left ws-nowrap minW-150px w-15">
            {{ $t('tuitionFee.table.courseName') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('tuitionFee.table.startDate') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('tuitionFee.table.endDate') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('tuitionFee.table.originalValue') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('tuitionFee.table.discountValue') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('tuitionFee.table.value') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('tuitionFee.table.paidValue') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('tuitionFee.table.shortageValue') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('tuitionFee.table.status') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('tuitionFee.table.counselor') }}
          </th>
        </tr>
      </template>
      <template #tbody>
        <tr
          v-for="(item, index) in store.list"
          :key="index"
          @click.stop="() => goDetailPage(item.id)"
        >
          <td class="first-column-item sticky">{{ item.code }}</td>
          <EllipsisTableData class="second-column-item sticky" :text="item.studentName" />
          <EllipsisTableData :text="item.className" />
          <EllipsisTableData :text="item.courseName" />
          <td>{{ item.startDate }}</td>
          <td>{{ item.endDate }}</td>
          <td>{{ item.originalValue }}</td>
          <td>{{ item.promotionValue }}</td>
          <td>{{ item.payValue }}</td>
          <td>{{ item.paidValue }}</td>
          <td>{{ item.shortageValue }}</td>
          <td>
            <StatusDot :color="TuitionStatusColor[item.status]" />
            {{ $t(`tuitionFee.status.${item.status}`) }}
          </td>
          <EllipsisTableData :text="item.presenterName" />
        </tr>
      </template>
    </TableBase>
  </v-card>
</template>
<style lang="scss" scoped>
.card-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0 16px 16px 16px;
  border: 1px solid $color-neutral-6;
}
:deep(.v-table) {
  height: calc(100% - $height-table-header);
}
:deep(.v-table__wrapper) {
  height: 100%;
  border: none !important;
}
.table-header {
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
}
.sticky {
  position: sticky;
}

.first-column,
.second-column {
  z-index: 2 !important;
  position: sticky;
  background: $color-white;
}

.first-column-item,
.second-column-item {
  background: $color-white;
}

.first-column {
  left: 0;
}
.second-column {
  left: v-bind(firstColumnWidth);
}

.first-column-item {
  left: 0;
}
.second-column-item {
  left: v-bind(firstColumnWidth);
}

:deep(.v-table) {
  position: relative;

  .v-table__wrapper {
    tr:hover {
      .first-column-item,
      .second-column-item {
        background-color: $color-primary-5;
      }
    }
  }

  tbody {
    tr:not(:last-of-type) .sticky {
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        height: 1px;
        width: 100%;
        background-color: $color-neutral-6;
      }
    }
  }
  &.show-left-shadow {
    .v-table__wrapper {
      &::before {
        content: '';
        position: absolute;
        background-color: transparent;
        top: 0;
        height: 100%;
        left: 0;
        width: v-bind(firstGroupWidth);
        box-shadow: 0px 4px 8px 0px #8e8dd029;
        -webkit-box-shadow: 0px 4px 8px 0px #8e8dd029;
        -moz-box-shadow: 0px 4px 8px 0px #8e8dd029;
        z-index: 0;
      }
    }
  }
}
</style>
