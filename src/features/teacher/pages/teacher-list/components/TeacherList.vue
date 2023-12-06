<script setup lang="ts">
import resend from '@/assets/icons/lms/send.svg';
import {
  ErrorCode,
  PageName,
  Role,
  UserStatus,
  UserStatusColor,
} from '@/common/constants';
import {
  maskPhone,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { IResponseError, ITableSorter } from '@/common/interfaces';
import { useRole } from '@/common/stores/role.store';
import {
  EllipsisTableData,
  SortTableColumnHeader,
  TableBase,
  TableHeader,
} from '@/components';
import { useTeacherStore } from '@/features/teacher/stores';
import { showDialogConfirm } from '@/plugins';
import { onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const store = useTeacherStore();
const role = useRole();
const { t } = useI18n();
const router = useRouter();

const updatePage = async (value: number) => {
  store.setPage(value);
  store.getList();
};

const onChangeOrder = async ({ field, direction }: ITableSorter) => {
  store.setOrder(field, direction);
  store.getList();
};

const goToTeacherProfile = (item: any) => {
  router.push({
    name: PageName.TEACHER_DETAIL_PAGE,
    params: {
      id: item.id,
    },
  });
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
  showErrorNotification(t('teacher.notification.error.delete'));
};

const handleDeleteError = (error: IResponseError) => {
  const { errorCode = undefined, key = undefined } = error;
  const i18nKey = `teacher.delete.${errorCode}.${key}`;
  showErrorNotification(t(i18nKey));
};

const removeSelectedItems = async () => {
  const res = await showDialogConfirm('info', {
    title: t('common.deleteConfirm'),
    text: t('teacher.deleteConfirmMessage', {
      total: store.selectedIds.size,
    }),
  });
  if (res) {
    const result = await store.removeSelectedItems();
    if (result.success) {
      showSuccessNotification(t('teacher.notification.success.delete'));
      store.unSelectAll();
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
      :show-delete="!store.isEmptySelected"
      @remove-items="removeSelectedItems"
      @change-page="updatePage"
      :page="store.listQuery.page || 1"
      :title="$t('teacher.total', { total: store.total })"
    />
    <TableBase :is-empty="!store.total && !store.isFetching" :loading="store.isFetching">
      <template #thead>
        <tr>
          <th v-if="role.teacher?.delete" style="width: 72px" class="text-left ws-nowrap">
            <v-checkbox
              color="primary"
              hide-details
              :model-value="!store.isEmptySelected"
              @update:model-value="store.toggleSelectAll()"
              :indeterminate="!store.isEmptySelected && !store.isAllSelected"
            />
          </th>
          <SortTableColumnHeader
            name="code"
            :title="t('teacher.table.id')"
            :order-by="store.listQuery.orderBy"
            :direction="store.listQuery.orderDirection"
            @change="onChangeOrder"
          />
          <SortTableColumnHeader
            name="name"
            :title="t('teacher.table.name')"
            :order-by="store.listQuery.orderBy"
            :direction="store.listQuery.orderDirection"
            @change="onChangeOrder"
            min-width="200px"
            width="15%"
          />
          <th class="text-left ws-nowrap minW-200px w-20">
            {{ t('teacher.table.terms') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ t('teacher.table.phone') }}
          </th>
          <th class="text-left ws-nowrap minW-200px w-10">
            {{ t('teacher.table.email') }}
          </th>
          <th class="text-center ws-nowrap">
            {{ t('teacher.table.isManager') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ t('teacher.table.state') }}
          </th>
        </tr>
      </template>
      <template #tbody>
        <tr
          v-for="(item, index) in store.list"
          :key="index"
          :class="store.selectedIds[item.id] ? 'selected' : ''"
          class="clickable"
          @click="() => goToTeacherProfile(item)"
        >
          <td v-if="role.teacher?.delete" @click.stop>
            <v-checkbox
              color="primary"
              hide-details
              :model-value="store.isSelectedId(item.id)"
              @update:model-value="store.toggleSelectedId(item.id)"
            />
          </td>
          <td>
            {{ item.code }}
          </td>
          <EllipsisTableData :text="item.name" />
          <EllipsisTableData :text="item.subjectNames?.join(', ')" />
          <td class="ws-nowrap">{{ maskPhone(item.phone) }}</td>
          <EllipsisTableData :text="item.email" />
          <td>
            <div class="d-flex justify-center">
              <v-icon
                v-if="item.userRole === Role.MANAGER"
                color="#439F6E"
                icon="mdi-check"
              />
              <v-icon v-else color="#ADAEBA" icon="mdi-minus" />
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
