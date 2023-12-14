<script setup lang="ts">
import { ErrorCode, PageName } from '@/common/constants';
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
import { useCoursesStore } from '@/features/courses/store';
import { formatCurrencyVND } from '@/features/tuition-fee/helpers';
import { showDialogConfirm } from '@/plugins';
import { onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useCoursesStore();
const role = useRole();
const { t } = useI18n();

const updatePage = async (value: number) => {
  store.setPage(value);
  store.getList();
};

const onChangeOrder = async ({ field, direction }: ITableSorter) => {
  store.setOrder({ [field]: direction });
  store.getList();
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
  if (errors?.[ErrorCode.ITEM_ALREADY_EXIST]) {
    handleDeleteError(errors?.[ErrorCode.ITEM_ALREADY_EXIST]);
    return;
  }
  showErrorNotification(t('courses.notification.error.delete'));
};

const handleDeleteError = (error: IResponseError) => {
  const { errorCode = undefined, key = undefined } = error;
  const i18nKey = `courses.deleteError.${errorCode}.${key}`;
  showErrorNotification(t(i18nKey));
};

const removeSelectedItems = async () => {
  const res = await showDialogConfirm('info', {
    title: t('common.deleteConfirm'),
    text: t('courses.deleteConfirmMessage', {
      total: Object.keys(store.selectedIdsList).length,
    }),
  });
  if (res) {
    const result = await store.removeSelectedItems();
    if (result.success) {
      showSuccessNotification(t('courses.notification.success.delete'));
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
const gotoDetail = (id: string) => {
  router.push({
    name: PageName.COURSE_DETAIL_PAGE,
    params: {
      id,
    },
  });
};
onUnmounted(() => {
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
      :page="store.courseListQuery.page || 1"
      :title="$t('courses.list.totalCourses', { totalCourses: store.total })"
    />
    <TableBase :is-empty="!store.total">
      <template #thead>
        <tr>
          <th v-if="role.course?.delete" style="width: 72px" class="text-left ws-nowrap">
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
          <SortTableColumnHeader
            name="code"
            :title="t('courses.list.table.id')"
            @change="onChangeOrder"
            :order-by="store.courseListQuery?.orderBy"
            :direction="store.courseListQuery?.orderDirection"
          />
          <th class="text-left ws-nowrap minW-200px w-35">
            {{ t('courses.list.table.name') }}
          </th>
          <SortTableColumnHeader
            name="times"
            :title="t('courses.list.table.times')"
            @change="onChangeOrder"
            :order-by="store.courseListQuery?.orderBy"
            :direction="store.courseListQuery?.orderDirection"
          />

          <th class="text-left ws-nowrap">
            {{ t('courses.list.table.tuition') }}
          </th>
          <th class="text-left ws-nowrap w-20">
            {{ t('courses.list.table.state') }}
          </th>
        </tr>
      </template>
      <template #tbody>
        <tr
          v-for="(item, index) in store.list"
          :key="index"
          :class="{
            'cursor-default': !role.course?.detailBasic,
            selected: !!store.selectedIds[item.id],
          }"
          @click="() => role.course?.detailBasic && gotoDetail(item.id)"
        >
          <td v-if="role.course?.delete" @click="(e) => e.stopPropagation()">
            <v-checkbox
              color="primary"
              hide-details
              :model-value="store.selectedIds[item.id]"
              @update:model-value="store.setSelectedIds(item.id)"
            />
          </td>
          <td>
            {{ item.code }}
          </td>
          <EllipsisTableData :text="item.name" />
          <td>{{ item.times }}</td>
          <td>{{ formatCurrencyVND(item.tuition) }}</td>
          <EllipsisTableData :text="item.courseFormNames.join(', ')" />
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
