<script lang="ts" setup>
import { ErrorCode } from '@/common/constants';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { useRole } from '@/common/stores/role.store';
import { ActionIcon, EllipsisTableData, TableBase, TableHeader } from '@/components';
import { usePaymentMethodDialog } from '@/features/setting/stores/payment-method-dialog';
import { usePaymentMethodStore } from '@/features/setting/stores/payment-method.store';
import { showDialogConfirm } from '@/plugins';
import { onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';

const store = usePaymentMethodStore();
const dialogStore = usePaymentMethodDialog();
const role = useRole();
const { t } = useI18n();

async function updatePage(value: number) {
    store.setPage(value);
    store.getList();
}

function handleDeleteError(error: IResponseError) {
    const errorCode = error.errorCode;
    const errorKey = error.key;
    const i18nKey = `paymentMethod.deleteError.${errorCode}.${errorKey}`;
    switch (errorCode) {
        case ErrorCode.ITEM_NOT_FOUND:
            showErrorNotification(t(i18nKey));
            store.unSelectAll();
            store.getList();
            break;

        default:
            showErrorNotification(t('paymentMethod.error.delete'));
            break;
    }
}
async function handleRemoveSelectedItems() {
    const confirm = await showDialogConfirm('info', {
        title: t('common.deleteConfirm'),
        text: t('paymentMethod.deleteConfirmMessageTotal', {
            total: store.selectedIds.size,
        }),
    });
    if (confirm) {
        const result = await store.removeSelectedItems();
        if (result.success) {
            showSuccessNotification(t('paymentMethod.success.delete'));
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

onBeforeMount(() => {
    store.getList();
});
</script>
<template>
    <v-card class="mx-4 mb-4 pa-0">
        <TableHeader
            :total="store.totalPages"
            :show-delete="!store.isEmptySelected && role.paymentMethodSetting?.delete"
            @remove-items="handleRemoveSelectedItems"
            @change-page="updatePage"
            :page="store.listQuery.page || 1"
            :title="$t('paymentMethod.list.total', { total: store.total })"
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
                        />
                    </th>
                    <th class="text-left ws-nowrap minW-300px w-70">
                        {{ t('paymentMethod.list.table.name') }}
                    </th>
                    <th
                        v-if="role.paymentMethodSetting?.update"
                        class="text-left ws-nowrap"
                    >
                        {{ t('paymentMethod.list.table.action') }}
                    </th>
                </tr>
            </template>
            <template #tbody>
                <tr
                    v-for="item in store.list"
                    :key="item.id"
                    :class="store.selectedIds.has(item.id) ? 'selected' : ''"
                    class="cursor-default"
                >
                    <td style="width: 72px" class="text-left ws-nowrap">
                        <v-checkbox
                            color="primary"
                            hide-details
                            :model-value="store.selectedIds.has(item.id)"
                            @update:model-value="store.toggleSelectedId(item.id)"
                        />
                    </td>
                    <EllipsisTableData :text="item.name" />
                    <td v-if="role.paymentMethodSetting?.update">
                        <ActionIcon
                            icon="$custom.edit"
                            :text="$t('paymentMethod.action.edit')"
                            @click="dialogStore.open(item.id)"
                        />
                    </td>
                </tr>
            </template>
        </TableBase>
    </v-card>
</template>
<style lang="scss" scoped></style>
