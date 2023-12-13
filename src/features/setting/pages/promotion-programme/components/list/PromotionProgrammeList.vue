<script lang="ts" setup>
import { PageName } from '@/common/constants';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { useRole } from '@/common/stores/role.store';
import { EllipsisTableData, TableBase, TableHeader } from '@/components';
import BaseDeleteConfirmText from '@/components/base/BaseDeleteConfirmText.vue';
import { usePromotionProgrammeStore } from '@/features/setting/stores/promotion-programme.store';
import { showDialogConfirm } from '@/plugins';
import { onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const store = usePromotionProgrammeStore();
const router = useRouter();
const role = useRole();

async function updatePage(value: number) {
    store.setPage(value);
    store.getList();
}

function gotoDetail(id: string) {
    router.push({
        name: PageName.PROMOTION_PROGRAMME_DETAIL_PAGE,
        params: {
            id,
        },
    });
}

function handleDeleteError(error: IResponseError) {
    const { errorCode } = error;
    switch (errorCode) {
        default:
            showErrorNotification(t('promotionProgramme.error.delete'));
            break;
    }
}

async function handleRemoveSelectedItems() {
    const nameList = store.list.reduce((list, currentItem) => {
        if (store.isSelectedId(currentItem.id)) {
            list.push({ name: currentItem.name });
        }
        return list;
    }, [] as { name: string }[]);
    const res = await showDialogConfirm('info', {
        title: t('common.deleteConfirm'),
        textComponent: {
            component: BaseDeleteConfirmText,
            props: {
                title: t('promotionProgramme.deleteConfirmMessageTotal', {
                    total: store.selectedIds.size,
                }),
                data: nameList,
            },
        },
    });
    if (res) {
        const result = await store.removeSelectedItems();
        if (result.success) {
            showSuccessNotification(t('promotionProgramme.success.delete'));
            store.unSelectAll();
            store.getList();
            return;
        }
        if (result.errors?.length) {
            handleDeleteError(result.errors[0]);
        } else {
            showErrorNotification(result.error || (result.message as string));
        }
    }
}

onUnmounted(() => {
    store.unSelectAll();
});
</script>
<template>
    <v-card class="mx-4 mb-4 pa-0">
        <TableHeader
            :total="store.totalPages"
            :show-delete="!store.isEmptySelected && role.promotionSetting?.delete"
            @remove-items="handleRemoveSelectedItems"
            @change-page="updatePage"
            :page="store.listQuery.page || 1"
            :title="$t('promotionProgramme.total', { total: store.total })"
        />
        <TableBase
            :is-empty="!store.total && !store.isFetching"
            :loading="store.isFetching"
        >
            <template #thead>
                <tr>
                    <th>
                        <v-checkbox
                            color="primary"
                            hide-details
                            :model-value="!store.isEmptySelected"
                            @update:model-value="store.toggleSelectAll()"
                            :indeterminate="
                                !store.isEmptySelected && !store.isAllSelected
                            "
                            @click.stop
                        />
                    </th>
                    <th class="text-left ws-nowrap minW-300px w-20">
                        {{ t('promotionProgramme.table.name') }}
                    </th>
                    <th class="text-left ws-nowrap minW-150px w-20">
                        {{ t('promotionProgramme.table.course') }}
                    </th>
                    <th class="text-left ws-nowrap minW-150px">
                        {{ t('promotionProgramme.table.value') }}
                    </th>
                    <th class="text-left ws-nowrap">
                        {{ t('promotionProgramme.table.usedCount') }}
                    </th>
                    <th class="text-left ws-nowrap">
                        {{ t('promotionProgramme.table.startDate') }}
                    </th>
                    <th class="text-left ws-nowrap">
                        {{ t('promotionProgramme.table.endDate') }}
                    </th>
                    <th class="text-left ws-nowrap">
                        {{ t('promotionProgramme.table.status') }}
                    </th>
                </tr>
            </template>
            <template #tbody>
                <tr
                    v-for="item in store.list"
                    :key="item.id"
                    :class="store.selectedIds.has(item.id) ? 'selected' : ''"
                    @click.stop="() => gotoDetail(item.id)"
                >
                    <td style="width: 72px" class="text-left ws-nowrap">
                        <v-checkbox
                            color="primary"
                            hide-details
                            :model-value="store.selectedIds.has(item.id)"
                            @update:model-value="store.toggleSelectedId(item.id)"
                            @click.stop
                        />
                    </td>
                    <EllipsisTableData :text="item.name" />
                    <EllipsisTableData :text="item.applyForCourses" />
                    <td class="ws-nowrap">{{ item.value }}</td>
                    <td class="ws-nowrap">{{ item.usedCount }}</td>
                    <td class="ws-nowrap">{{ item.startDate }}</td>
                    <td class="ws-nowrap">{{ item.endDate }}</td>
                    <td class="ws-nowrap">
                        {{ $t(`promotionProgramme.status.${item.status}`) }}
                    </td>
                </tr>
            </template>
        </TableBase>
    </v-card>
</template>
<style lang="scss" scoped></style>
