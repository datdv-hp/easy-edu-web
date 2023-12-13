<script lang="ts" setup>
import {
  maskPhone,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { useRole } from '@/common/stores';
import {
  ActionIcon,
  EllipsisTableData,
  LoadingOverlay,
  TableBase,
  TableHeader,
} from '@/components';
import StatusDot from '@/components/StatusDot.vue';
import {
  RegistrationStatus,
  RegistrationStatusColor,
} from '@/features/registration/constants';
import { IRegistrationListItem } from '@/features/registration/interfaces';
import { RegistrationApi } from '@/features/registration/services';
import { useRegistrationStore } from '@/features/registration/stores';
import { useStudentDialog } from '@/features/student/stores';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useRegistrationStore();
const studentDialog = useStudentDialog();
const role = useRole();

const open = ref();
const activator = ref();
const selectedStatus = ref();
const activeItem = ref();

const updatePage = async (value: number) => {
  store.setPage(value);
  store.getList();
};
const StatusOptions = computed(() =>
  Object.values(RegistrationStatus).map((status) => ({
    title: t(`registration.status.${status}`),
    value: status,
  })),
);
function handleOpenMenu(e: PointerEvent, item: IRegistrationListItem) {
  open.value = true;
  activator.value = e.target;
  activeItem.value = item;
  selectedStatus.value = item.status;
}

async function handleClickSwitchStatus(value) {
  if (value.id !== activeItem.value.status) {
    const res = await RegistrationApi.switchStatus(activeItem.value.id, value.id);
    if (res.success) {
      showSuccessNotification(t('registration.success.switchStatus'));
      store.getList();
    } else {
      showErrorNotification(t('registration.error.switchStatus'));
    }
  }
  reset();
}

async function reset() {
  open.value = undefined;
  activator.value = undefined;
  selectedStatus.value = undefined;
  activeItem.value = undefined;
}
</script>
<template>
  <v-card class="mx-4 pa-0">
    <TableHeader
      :total="store.totalPages"
      @change-page="updatePage"
      :page="store.listQuery.page || 1"
      :title="$t('manager.total', { total: store.total })"
    />
    <TableBase class="rounded-0" :is-empty="!store.total">
      <template #thead>
        <tr>
          <th
            style="width: 72px"
            class="text-left ws-nowrap"
            v-if="role.registration?.delete"
          >
            <v-checkbox
              color="primary"
              hide-details
              :model-value="!store.isEmptySelected"
              @update:model-value="store.toggleSelectAll()"
              :indeterminate="!store.isEmptySelected && !store.isAllSelected"
            />
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('registration.table.name') }}
          </th>
          <th class="text-left ws-nowrap minW-150px w-20">
            {{ $t('registration.table.email') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('registration.table.phone') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('registration.table.createdAt') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ $t('registration.table.status') }}
          </th>
          <th class="text-center ws-nowrap" v-if="role.registration?.createStudent">
            {{ $t('registration.table.action') }}
          </th>
        </tr>
      </template>
      <template #tbody v-if="!!store.list.length">
        <tr
          v-for="(item, index) in store.list"
          :key="index"
          :class="store.selectedIds.has(item.id) ? 'selected' : ''"
        >
          <td v-if="role.registration?.delete">
            <v-checkbox
              color="primary"
              hide-details
              :model-value="store.selectedIds.has(item.id)"
              @update:model-value="store.toggleSelectedId(item.id)"
            />
          </td>
          <EllipsisTableData :text="item.name" />
          <EllipsisTableData :text="item.email" />
          <td class="ws-nowrap">{{ maskPhone(item.phone) }}</td>
          <td class="ws-nowrap">{{ item.createdAt }}</td>
          <td class="ws-nowrap">
            <StatusDot :color="RegistrationStatusColor[item.status]" />{{
              $t(`registration.status.${item.status}`)
            }}
          </td>
          <td v-if="role.registration?.createStudent">
            <div class="d-flex align-center justify-center gap-2">
              <ActionIcon
                icon="$user.user-circle-add"
                :tooltip-text="$t('registration.action.addStudent')"
                @click="studentDialog.open(undefined, item)"
              />
              <ActionIcon
                icon="$custom.refresh"
                :id="item.id"
                :tooltip-text="$t('registration.action.switchStatus')"
                @click="handleOpenMenu($event, item)"
              />
            </div>
          </td>
        </tr>
      </template>
    </TableBase>
  </v-card>
  <v-menu v-if="activator" :activator="activator" v-model="open" offset="10">
    <v-list
      width="150"
      :items="StatusOptions"
      :selected="[selectedStatus]"
      @click:select="handleClickSwitchStatus"
      density="compact"
      color="primary"
    ></v-list>
  </v-menu>
  <LoadingOverlay :loading="store.isFetching" />
</template>
<style lang="scss" scoped></style>
