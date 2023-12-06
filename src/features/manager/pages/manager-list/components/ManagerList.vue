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
import { useUserStore } from '@/features/auth/stores';
import { useManagerStore } from '@/features/manager/stores';
import { showDialogConfirm } from '@/plugins';
import { onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useManagerStore();
const role = useRole();
const userStore = useUserStore();

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
  if (errors?.[ErrorCode.CONFLICT]) {
    handleDeleteError(errors[ErrorCode.CONFLICT]);
    return;
  }
  showErrorNotification(t('manager.notification.error.delete'));
};

const handleDeleteError = (error: IResponseError) => {
  const { errorCode = undefined, key = undefined } = error;
  const i18nKey = `manager.delete.${errorCode}.${key}`;
  showErrorNotification(t(i18nKey));
};

const removeSelectedItems = async () => {
  const res = await showDialogConfirm('info', {
    title: t('common.deleteConfirm'),
    text: t('manager.deleteConfirmMessage', {
      total: Object.keys(store.selectedIdsList).length,
    }),
  });
  if (res) {
    const result = await store.removeSelectedItems();
    if (result.success) {
      showSuccessNotification(t('manager.notification.success.delete'));
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
    name: PageName.MANAGER_DETAIL_PAGE,
    params: {
      id,
    },
  });
};

const handleClickResend = async (id: string) => {
  const res = await store.resendEmail(id);
  if (res?.success) {
    showSuccessNotification(t('common.success.sendEmail'));
    store.getList();
  } else {
    showErrorNotification(t('common.error.sendEmail'));
  }
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
      :page="store.managerListQuery.page || 1"
      :title="$t('manager.total', { total: store.total })"
    />
    <TableBase class="rounded-0" :is-empty="!store.total">
      <template #thead>
        <tr>
          <th v-if="role.manager?.delete" style="width: 72px" class="text-left ws-nowrap">
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
            name="name"
            :title="t('manager.table.name')"
            @change="onChangeOrder"
            :order-by="store.managerListQuery?.orderBy"
            :direction="store.managerListQuery?.orderDirection"
            minWidth="200px"
            width="25%"
          />
          <th class="text-left ws-nowrap">
            {{ t('manager.table.phone') }}
          </th>
          <th class="text-left ws-nowrap minW-150px w-20">
            {{ t('manager.table.email') }}
          </th>
          <th class="text-center ws-nowrap">
            {{ t('manager.table.isTeacher') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ t('manager.table.state') }}
          </th>
        </tr>
      </template>
      <template #tbody v-if="!!store.list.length">
        <tr
          v-for="(item, index) in store.list"
          :key="index"
          :class="store.selectedIds[item.id] ? 'selected' : ''"
          @click="() => gotoDetail(item.id)"
        >
          <td v-if="role.manager?.delete" @click.stop>
            <v-checkbox
              color="primary"
              hide-details
              :model-value="store.selectedIds[item.id]"
              :disabled="userStore.currentUserId === item.id"
              @update:model-value="store.setSelectedIds(item.id)"
            />
          </td>
          <EllipsisTableData :text="item.name" />
          <td class="ws-nowrap">{{ maskPhone(item.phone) }}</td>
          <EllipsisTableData :text="item.email" />
          <td>
            <div class="d-flex justify-center">
              <v-icon v-if="item?.isTeacher" icon="mdi-check" color="#439F6E" />

              <v-icon v-else icon="mdi-minus" color="#ADAEBA" />
            </div>
          </td>
          <td>
            <div class="d-flex align-center ws-nowrap status">
              <div
                class="dot"
                :style="{
                  backgroundColor: UserStatusColor[item.status],
                }"
              ></div>
              <div>{{ $t(`common.userStatus.${item.status}`) }}</div>
              <v-img
                @click.stop="handleClickResend(item.id)"
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
