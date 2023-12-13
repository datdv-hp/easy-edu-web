<script setup lang="ts">
import resend from '@/assets/icons/lms/send.svg';
import { ErrorCode, PageName, UserStatus, UserStatusColor } from '@/common/constants';
import {
  maskPhone,
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
import StatusDot from '@/components/StatusDot.vue';
import { useStudentStore } from '@/features/student/stores';
import { showDialogConfirm } from '@/plugins';
import { onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const store = useStudentStore();
const { t } = useI18n();
const router = useRouter();
const role = useRole();

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
  if (errors?.[ErrorCode.CONFLICT]) {
    handleDeleteError(errors[ErrorCode.CONFLICT]);
    return;
  }
  showErrorNotification(t('student.notification.error.delete'));
};

const handleDeleteError = (error: IResponseError) => {
  const { errorCode = undefined, key = undefined } = error;
  const i18nKey = `student.delete.${errorCode}.${key}`;
  showErrorNotification(t(i18nKey));
};

const removeSelectedItems = async () => {
  const res = await showDialogConfirm('info', {
    title: t('common.deleteConfirm'),
    text: t('student.deleteConfirmMessage', {
      total: Object.keys(store.selectedIdsList).length,
    }),
  });
  if (res) {
    const result = await store.removeSelectedItems();
    if (result.success) {
      showSuccessNotification(t('student.notification.success.delete'));
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
    name: PageName.STUDENT_DETAIL_PAGE,
    params: {
      id,
    },
  });
};

const handleClickResend = async (id: string, index: number) => {
  const res = await store.resendEmail(id);
  if (res?.success && res?.data?.success && store.list?.[index].status) {
    showSuccessNotification(t('common.success.sendEmail'));
    store.list[index].status = UserStatus.CONFIRMING;
    return;
  }
  showErrorNotification(t('common.error.sendEmail'));
};

onBeforeUnmount(() => {
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
      :page="store.studentListQuery.page || 1"
      :title="$t('student.totalStudents', { total: store.total })"
    />
    <TableBase :is-empty="!store.total">
      <template #thead>
        <tr>
          <th
            v-if="role.student?.delete"
            style="width: 52px"
            class="text-center ws-nowrap"
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
            :title="t('student.table.id')"
            @change="onChangeOrder"
            :order-by="store.studentListQuery?.orderBy"
            :direction="store.studentListQuery?.orderDirection"
          />
          <SortTableColumnHeader
            name="name"
            :title="t('student.table.name')"
            @change="onChangeOrder"
            :order-by="store.studentListQuery?.orderBy"
            :direction="store.studentListQuery?.orderDirection"
            min-width="200px"
            width="20%"
          />
          <th class="text-left ws-nowrap minW-200px w-20">
            {{ t('student.table.courses') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ t('student.table.phone') }}
          </th>
          <th class="text-left ws-nowrap minW-150px w-20">
            {{ t('student.table.email') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ t('student.table.state') }}
          </th>
        </tr>
      </template>
      <template #tbody>
        <tr
          v-for="(item, index) in store.list"
          :key="index"
          :class="store.selectedIds[item.id] ? 'selected' : ''"
          @click="gotoDetail(item.id)"
        >
          <td v-if="role.student?.delete" @click.stop>
            <v-checkbox
              color="primary"
              hide-details
              :model-value="store.selectedIds[item.id]"
              @update:model-value="store.setSelectedIds(item.id)"
            />
          </td>
          <td>{{ item.code }}</td>
          <EllipsisTableData :text="item.name" />
          <EllipsisTableData :text="item.courses?.join(', ')" />
          <td class="ws-nowrap">{{ maskPhone(item.phone) }}</td>
          <EllipsisTableData :text="item.email" />
          <td>
            <div class="d-flex align-center ws-nowrap status">
              <StatusDot :color="UserStatusColor[item.status]" />
              <div>{{ $t(`common.userStatus.${item.status}`) }}</div>
              <v-img
                @click.stop="handleClickResend(item.id, index)"
                class="status-resend"
                v-if="item.status === UserStatus.INVITE_EXPIRED"
                :src="resend"
              />
            </div>
          </td>
        </tr>
      </template>
    </TableBase>
    <LoadingOverlay :loading="store.isFetching" />
  </v-card>
</template>

<style lang="scss" scoped>
.status {
  position: relative;
  .status-resend {
    width: 20px;
    height: 20px;
    position: absolute;
    left: 64px;
    margin-right: 10px;
    :hover {
      opacity: 0.8;
    }
  }
}

.dot {
  display: inline-block;
  margin-right: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
</style>
