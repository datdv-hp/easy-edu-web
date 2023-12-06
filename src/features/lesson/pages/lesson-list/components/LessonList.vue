<script setup lang="ts">
import { ErrorCode, PageName, UserStatusColor } from '@/common/constants';
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
import { useLessonStore } from '@/features/lesson/stores';
import { showDialogConfirm } from '@/plugins';
import { onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useLessonStore();
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
  if (errors?.[ErrorCode.ITEM_INVALID]) {
    handleDeleteError(errors[ErrorCode.ITEM_INVALID]);
    return;
  }
  showErrorNotification(t('lesson.notification.error.delete'));
};

const handleDeleteError = (error: IResponseError) => {
  const { errorCode = undefined, key = undefined } = error;
  const i18nKey = `lesson.delete.${errorCode}.${key}`;
  showErrorNotification(t(i18nKey));
};

const removeSelectedItems = async () => {
  const res = await showDialogConfirm('info', {
    title: t('common.deleteConfirm'),
    text: t('lesson.deleteConfirmMessage', {
      total: Object.keys(store.selectedIdsList).length,
    }),
  });
  if (res) {
    const result = await store.removeSelectedItems();
    if (result.success) {
      showSuccessNotification(t('lesson.notification.success.delete'));
      store.selectedIds = {};
      store.getList();
      return;
    }
    if (result?.errors?.length) {
      handleDeleteErrors(result?.errors);
    } else {
      showErrorNotification(result.error || (result.message as string));
    }
  }
};

const gotoDetail = (id: string) => {
  router.push({
    name: PageName.LESSON_DETAIL_PAGE,
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
      :page="store.lessonListQuery.page || 1"
      :title="$t('lesson.total', { total: store.total })"
    />
    <TableBase :is-empty="!store.total">
      <template #thead>
        <tr>
          <th v-if="role.lesson?.delete" style="width: 72px" class="text-left ws-nowrap">
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
            :title="t('lesson.table.id')"
            @change="onChangeOrder"
            :order-by="store.lessonListQuery?.orderBy"
            :direction="store.lessonListQuery?.orderDirection"
          />
          <th class="text-left ws-nowrap minW-150px w-20">
            {{ t('lesson.table.name') }}
          </th>
          <th class="text-left ws-nowrap minW-150px w-20">
            {{ t('lesson.table.classroom') }}
          </th>
          <th class="text-left ws-nowrap minW-150px w-20">
            {{ t('lesson.table.course') }}
          </th>
          <th class="text-left ws-nowrap minW-150px w-20">
            {{ t('lesson.table.subject') }}
          </th>
          <th class="text-left ws-nowrap minW-150px w-20">
            {{ t('lesson.table.teacher') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ t('lesson.table.status') }}
          </th>
        </tr>
      </template>
      <template #tbody>
        <tr
          v-for="(item, index) in store.list"
          :key="index"
          :class="store.selectedIds[item.id] ? 'selected' : ''"
          @click="() => gotoDetail(item.id)"
        >
          <td v-if="role.lesson?.delete" @click="(e) => e.stopPropagation()">
            <v-checkbox
              color="primary"
              hide-details
              :model-value="store.selectedIds[item.id]"
              @update:model-value="store.setSelectedIds(item.id)"
            />
          </td>
          <td class="ws-nowrap">{{ item.code }}</td>
          <EllipsisTableData :text="item.name" />
          <EllipsisTableData :text="item.classroom" />
          <EllipsisTableData :text="item.course" />
          <EllipsisTableData :text="item.subject" />
          <EllipsisTableData :text="item.teacher" />
          <td class="ws-nowrap">
            <v-tooltip :text="item.dateTime">
              <template v-slot:activator="{ props }">
                <div v-bind="props" class="d-flex align-center">
                  <div
                    :style="{
                      display: 'inline-block',
                      marginRight: '6px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: UserStatusColor[item.status],
                    }"
                  ></div>
                  <span>{{ $t(`lesson.status.${item.status}`) }}</span>
                </div>
              </template>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </TableBase>
    <LoadingOverlay :loading="store.isFetching" />
  </v-card>
</template>

<style lang="scss" scoped></style>
