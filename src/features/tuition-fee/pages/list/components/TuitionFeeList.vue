<script lang="ts" setup>
import { useScrolling } from '@/common/composable/use-scroll';
import { PageName } from '@/common/constants';
import { EllipsisTableData, TableBase, TableHeader } from '@/components';
import { useTuitionFeeStore } from '@/features/tuition-fee/stores';
import { useElementBounding } from '@vueuse/core';
import { computed, ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { VTable } from 'vuetify/lib/components/index.mjs';

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
const lastColumnRef = shallowRef<HTMLTableCellElement | null>(null);

const firstColumn = useElementBounding(firstColumnRef);
const secondColumn = useElementBounding(secondColumnRef);
const lastColumn = useElementBounding(lastColumnRef);

const firstColumnWidth = computed(() => `${firstColumn.width.value}px`);
const firstGroupWidth = computed(() => {
    return `${firstColumn.width.value + secondColumn.width.value}px`;
});
const lastGroupWidth = computed(() => `${lastColumn.width.value}px`);

function goDetailPage(id: string) {
    router.push({ name: PageName.TUITION_FEE_DETAIL_PAGE, params: { id } });
}
</script>
<template>
    <v-card class="mx-4 mb-4 pa-0">
        <TableHeader
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
                    <th ref="firstColumnRef" class="text-left ws-nowrap first-column">
                        {{ $t('tuitionFee.table.id') }}
                    </th>
                    <th
                        ref="secondColumnRef"
                        class="text-left ws-nowrap second-column minW-150px w-15"
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
                    <th ref="lastColumnRef" class="text-left ws-nowrap last-column">
                        {{ $t('tuitionFee.table.action') }}
                    </th>
                </tr>
            </template>
            <template #tbody>
                <tr v-for="(item, index) in store.list" :key="index">
                    <td class="first-column sticky">{{ item.code }}</td>
                    <EllipsisTableData
                        class="second-column sticky"
                        :text="item.studentName"
                    />
                    <EllipsisTableData :text="item.className" />
                    <EllipsisTableData :text="item.courseName" />
                    <td>{{ item.startDate }}</td>
                    <td>{{ item.endDate }}</td>
                    <td>{{ item.originalValue }}</td>
                    <td>{{ item.promotionValue }}</td>
                    <td>{{ item.payValue }}</td>
                    <td>{{ item.paidValue }}</td>
                    <td>{{ item.shortageValue }}</td>
                    <td>{{ $t(`tuitionFee.status.${item.status}`) }}</td>
                    <EllipsisTableData :text="item.presenterName" />
                    <td class="last-column sticky">
                        <v-icon
                            class="edit-icon"
                            icon="$custom.edit"
                            @click.stop="() => goDetailPage(item.id)"
                        />
                    </td>
                </tr>
            </template>
        </TableBase>
    </v-card>
</template>
<style lang="scss" scoped>
.sticky {
    position: sticky;
}

.first-column,
.second-column,
.last-column {
    z-index: 2 !important;
    background: $color-white;
}
.last-column {
    right: 0;
}
.first-column {
    left: 0;
}
.second-column {
    left: v-bind(firstColumnWidth);
}

:deep(.v-table) {
    position: relative;

    .v-table__wrapper {
        tr:hover {
            .last-column,
            .first-column,
            .second-column {
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
                background-color: $color-border;
            }
        }
    }
    &.show-right-shadow {
        .v-table__wrapper {
            &::after {
                content: '';
                position: absolute;
                background-color: transparent;
                top: 0;
                height: 100%;
                box-shadow: 0px 4px 8px 0px #8e8dd029;
                -webkit-box-shadow: 0px 4px 8px 0px #8e8dd029;
                -moz-box-shadow: 0px 4px 8px 0px #8e8dd029;
                right: 0;
                width: v-bind(lastGroupWidth);
                z-index: 1;
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
                // left: v-bind(firstGroupWidth);
                box-shadow: 0px 4px 8px 0px #8e8dd029;
                -webkit-box-shadow: 0px 4px 8px 0px #8e8dd029;
                -moz-box-shadow: 0px 4px 8px 0px #8e8dd029;
                z-index: 2;
            }
        }
    }
}
.edit-icon {
    transition: transform 0.15s linear;
    &:hover {
        transform: scale(1.2);
        color: $color-primary-1;
    }
}
</style>
