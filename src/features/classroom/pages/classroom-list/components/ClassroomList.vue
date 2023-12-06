<script setup lang="ts">
import { ErrorCode, PageName } from '@/common/constants';
import {
  formatDateString,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { IResponseError, ITableSorter } from '@/common/interfaces';
import { useRole } from '@/common/stores/role.store';
import {
  EllipsisTableData,
  LoadingOverlay,
  SortTableColumnHeader,
  TableBase,
  TableHeader,
} from '@/components';
import { useClassroomStore } from '@/features/classroom/stores';
import { showDialogConfirm } from '@/plugins';
import router from '@/plugins/vue-router';
import { onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ClassroomStatusColors } from '@/features/classroom/contants';

const store = useClassroomStore();
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

const handleDeleteErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const i18nKey = `classroom.delete.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      showErrorNotification(t(i18nKey));
      store.getList();
      break;
    case ErrorCode.ITEM_ALREADY_EXIST:
      showErrorNotification(t(i18nKey));
      break;
    default:
      showErrorNotification(t('classroom.notification.error.delete'));
      break;
  }
};

const removeSelectedItems = async () => {
  const confirm = await showDialogConfirm('info', {
    title: t('common.deleteConfirm'),
    text: t('classroom.deleteConfirmMessage', {
      total: Object.keys(store.selectedIdsList).length,
    }),
  });
  if (confirm) {
    const res = await store.removeSelectedItems();
    if (res.success) {
      showSuccessNotification(t('classroom.notification.success.delete'));
      store.selectedIds = {};
      store.getList();
      return;
    }
    if (res?.errors?.length) {
      handleDeleteErrors(res.errors[0]);
    } else {
      showErrorNotification(res.error || (res.message as string));
    }
  }
};

const gotoDetail = (id: string) => {
  router.push({
    name: PageName.CLASSROOM_DETAIL_PAGE,
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
      :page="store.classroomListQuery.page || 1"
      :title="$t('classroom.total', { total: store.total })"
    />
    <TableBase :is-empty="!store.total">
      <template #thead>
        <tr>
          <th
            v-if="role.classroom?.delete"
            style="width: 72px"
            class="text-left ws-nowrap"
          >
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
            :title="t('classroom.table.id')"
            @change="onChangeOrder"
            :order-by="store.classroomListQuery?.orderBy"
            :direction="store.classroomListQuery?.orderDirection"
          />
          <th class="text-left ws-nowrap minW-200px w-20">
            {{ t('classroom.table.name') }}
          </th>
          <th class="text-left ws-nowrap minW-200px w-20">
            {{ t('classroom.table.course') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ t('classroom.table.startDate') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ t('classroom.table.endDate') }}
          </th>
          <SortTableColumnHeader
            name="totalStudent"
            class="text-center"
            :title="t('classroom.table.totalStudents')"
            @change="onChangeOrder"
            :order-by="store.classroomListQuery?.orderBy"
            :direction="store.classroomListQuery?.orderDirection"
          />
          <th class="text-left ws-nowrap">
            {{ t('classroom.table.status') }}
          </th>
        </tr>
      </template>
      <template #tbody>
        <tr
          v-for="(item, index) in store.list"
          :key="index"
          :class="store.selectedIds[item.id] ? 'selected' : ''"
          @click="() => role.classroom?.detailBasic && gotoDetail(item.id)"
        >
          <td v-if="role.classroom?.delete" @click="(e) => e.stopPropagation()">
            <v-checkbox
              color="primary"
              hide-details
              :model-value="store.selectedIds[item.id]"
              @update:model-value="store.setSelectedIds(item.id)"
            />
          </td>
          <td>{{ item.code }}</td>
          <EllipsisTableData :text="item.name" />
          <EllipsisTableData :text="item.course?.name" />
          <td>{{ formatDateString(item.startDate, 'YYYY-MM-DD') }}</td>
          <td>{{ formatDateString(item.endDate, 'YYYY-MM-DD') }}</td>
          <td>{{ item.totalStudents }}</td>
          <td class="ws-nowrap">
            <div class="d-flex align-center">
              <div
                :style="{
                  display: 'inline-block',
                  marginRight: '6px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: ClassroomStatusColors[item.status],
                }"
              ></div>
              <div>
                {{ $t(`classroom.status.${item?.status?.toLowerCase()}`) }}
              </div>
            </div>
          </td>
        </tr>
      </template>
    </TableBase>
    <LoadingOverlay :loading="store.isFetching" />
  </v-card>
</template>

<style lang="scss" scoped></style>
