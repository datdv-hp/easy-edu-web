<script setup lang="ts">
import { ErrorCode } from '@/common/constants';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { IResponseError, ITableSorter } from '@/common/interfaces';
import { useRole } from '@/common/stores/role.store';
import {
  EllipsisTableData,
  LoadingOverlay,
  SortTableColumnHeader,
  TableBase,
  TableHeader,
} from '@/components';
import { useSubjectDialog, useSubjectStore } from '@/features/subject/store';
import { showDialogConfirm } from '@/plugins';
import { onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const store = useSubjectStore();
const dialogStore = useSubjectDialog();
const role = useRole();
const { t } = useI18n();

const updatePage = async (value: number) => {
  store.setPage(value);
  store.getList();
};

const onChangeOrder = async ({ field, direction }: ITableSorter) => {
  store.setOrder({ [field]: direction });
  await store.getList();
};

const handleDeleteErrors = (_errors: IResponseError[]) => {
  const errors = {};
  _errors.forEach((error) => {
    const code = error.errorCode;
    if (!error[code]) {
      errors[error.errorCode] = error;
    }
  });
  if (errors?.[ErrorCode.ITEM_NOT_FOUND]) {
    handleDeleteError(errors[ErrorCode.ITEM_NOT_FOUND]);
    store.getList();
    return;
  }
  if (errors?.[ErrorCode.CONFLICT]) {
    handleDeleteError(errors[ErrorCode.CONFLICT]);
    return;
  }
  showErrorNotification(t('subjects.notification.error.delete'));
};

const handleDeleteError = (error: IResponseError) => {
  const { errorCode = undefined, key = undefined } = error;
  const i18nKey = `subjects.delete.${errorCode}.${key}`;
  showErrorNotification(t(i18nKey));
};

const removeSelectedItems = async () => {
  const res = await showDialogConfirm('info', {
    title: t('common.deleteConfirm'),
    text: t('subjects.deleteConfirmMessage', {
      total: Object.keys(store.selectedIdsList).length,
    }),
  });
  if (res) {
    const result = await store.removeSelectedItems();
    if (result?.success) {
      showSuccessNotification(t('subjects.notification.success.delete'));
      store.selectedIds = {};
      store.getList();
      return;
    }
    if (result?.errors?.length) {
      handleDeleteErrors(result.errors);
    } else {
      showErrorNotification(result.error || (result.message as string));
    }
  }
};

onUnmounted(() => {
  store.subjectListQuery.page = 1;
  store.unSelectAll();
});
</script>
<template>
  <v-card class="mx-4 pa-0" ref="tableContainer">
    <TableHeader
      :total="store.totalPages"
      :show-delete="store.showDelete"
      @remove-items="removeSelectedItems"
      @change-page="updatePage"
      :page="store.subjectListQuery.page || 1"
      :title="$t('subjects.list.totalCourses', { totalCourses: store.total })"
    />
    <TableBase :is-empty="!store.total">
      <template #thead>
        <tr>
          <th v-if="role.subject?.delete" style="width: 72px" class="text-left ws-nowrap">
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
          <th class="text-left ws-nowrap minW-200px w-25">
            {{ t('subjects.list.table.name') }}
          </th>
          <SortTableColumnHeader
            name="subjectCode"
            :title="t('subjects.list.table.code')"
            @change="onChangeOrder"
            :order-by="store.subjectListQuery?.orderBy"
            :direction="store.subjectListQuery?.orderDirection"
          />
        </tr>
      </template>
      <template #tbody>
        <tr
          v-for="(item, index) in store.list"
          :key="index"
          :class="{
            'cursor-default': !role.subject?.update,
            selected: store.selectedIds[item.id],
          }"
          @click="() => role.subject?.update && dialogStore.open(item.id)"
        >
          <td v-if="role.subject?.delete" @click.stop>
            <v-checkbox
              color="primary"
              hide-details
              :model-value="store.selectedIds[item.id]"
              @update:model-value="store.setSelectedIds(item.id)"
            />
          </td>
          <EllipsisTableData :text="item.name" />
          <td>
            {{ item.subjectCode }}
          </td>
        </tr>
      </template>
    </TableBase>
    <LoadingOverlay :loading="store.isFetching" />
  </v-card>
</template>

<style lang="scss" scoped>
:deep(.v-chip) {
  background: #f3f7fe;
  height: 22px;
  margin-right: 4px;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  border: 1px solid;
}
</style>
