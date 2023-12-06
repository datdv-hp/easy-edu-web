<script setup lang="ts">
import { BaseButton, LoadingOverlay, TableBase, TableHeader } from '@/components';
import { StatusEvaluationCriteriaType } from '@/features/setting/constant';
import { useSettingEvaluationItemStore } from '@/features/setting/stores/settingEvaluationItem.store';
import { onBeforeUnmount, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SettingEvaluationItemSearchBar from './SettingEvaluationItemSearchBar.vue';
import editIcon from '@/assets/icons/lms/edit-icon.svg';
import SettingEvaluationItemDialog from '@/features/setting/components/SettingEvaluationItemDialog.vue';
import { useSettingEvaluationItemDialog } from '@/features/setting/stores/setting-evaluation-item-dialog.store';
import { showDialogConfirm } from '@/plugins';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import BaseDeleteConfirmText from '@/components/base/BaseDeleteConfirmText.vue';
import { useRole } from '@/common/stores/role.store';

const { t } = useI18n();
const store = useSettingEvaluationItemStore();
const dialogStore = useSettingEvaluationItemDialog();
const role = useRole();

onMounted(async () => {
  await store.getList();
});

const updateCheckbox = (state: boolean | null, id: string) => {
  if (state) {
    store.selectedIds.push(id);
  } else {
    store.selectedIds = store.selectedIds.filter((item) => item !== id);
  }
};

const updatePage = async (value: number) => {
  if (value > store.totalPages) {
    value = 1;
  }
  store.setPage(value);
  await store.getList();
};

const removeSelectedItems = async () => {
  const data = store.list.filter((item) => store.selectedIds.includes(item.id));
  const confirm = await showDialogConfirm('error', {
    title: t('common.deleteConfirm'),
    textComponent: {
      component: BaseDeleteConfirmText,
      props: {
        title: t('settings.confirmation.deleteEvaluationItem', {
          total: store.selectedIds.length,
        }),
        data: data,
      },
    },
  });

  if (confirm) {
    const res = await store.removeSelectedItems();
    if (res.success) {
      showSuccessNotification(t('settings.success.evaluationItemDelete'));
      store.selectedIds = [];
      await store.getList();
      if (!store.list?.length) {
        if ((store.evaluationItemQuery?.page as number) > 1) {
          store.setPage((store.evaluationItemQuery.page as number) - 1);
          await store.getList();
        }
      }
      return;
    } else {
      showErrorNotification(res.error || (res.message as string));
    }
  }
};

const handleClickEdit = (id: string) => {
  dialogStore.open(id);
};

onBeforeUnmount(() => {
  store.unSelectAll();
});
</script>
<template>
  <div class="d-flex justify-between align-center">
    <SettingEvaluationItemSearchBar />
    <BaseButton
      v-if="role.evaluationCriteriaSetting?.create"
      class="mr-4"
      :label="t('common.button.create')"
      :size="'medium'"
      @click="() => dialogStore.open()"
    />
  </div>
  <v-card class="pa-0 mx-4">
    <TableHeader
      :total="store.totalPages"
      :show-delete="store.showDelete"
      @remove-items="removeSelectedItems"
      @change-page="updatePage"
      :page="store.evaluationItemQuery.page || 1"
      :title="$t('settings.evaluationCriteriaTotal', { total: store.total })"
    />
    <TableBase :is-empty="!store.total">
      <template #thead>
        <tr>
          <th
            v-if="role.evaluationCriteriaSetting?.delete"
            style="width: 52px"
            class="text-center ws-nowrap w-5"
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
          <th class="text-left ws-nowrap w-20">
            {{ t('settings.evaluationItem.table.name') }}
          </th>
          <th class="text-left ws-nowrap w-20">
            {{ t('settings.evaluationItem.table.course') }}
          </th>
          <th class="text-left ws-nowrap w-35">
            {{ t('settings.evaluationItem.table.description') }}
          </th>
          <th class="text-left ws-nowrap w-15">
            {{ t('settings.evaluationItem.table.status') }}
          </th>
          <th class="text-left ws-nowrap w-5">
            {{ t('settings.evaluationItem.table.action') }}
          </th>
        </tr>
      </template>
      <template #tbody>
        <tr v-for="(item, index) in store.list" :key="index">
          <td
            v-if="role.evaluationCriteriaSetting?.delete"
            @click="(e) => e.stopPropagation()"
          >
            <v-checkbox
              color="primary"
              hide-details
              :model-value="store.selectedIds.includes(item.id)"
              @update:model-value="(e) => updateCheckbox(e, item.id)"
            />
          </td>
          <td>
            <v-tooltip :text="item.name" location="top left">
              <template v-slot:activator="{ props }">
                <span v-bind="props" class="ellipsis-one-line">{{ item.name }}</span>
              </template>
            </v-tooltip>
          </td>
          <td>
            <span v-if="item.isForAllCourse" class="ellipsis-one-line">{{
              t('settings.evaluationItem.form.isApplyAllCourse.label')
            }}</span>
            <v-tooltip v-else :text="item.courseNames?.join(', ')" location="top left">
              <template v-slot:activator="{ props }">
                <span v-bind="props" class="ellipsis-one-line">{{
                  item.courseNames?.join(', ')
                }}</span>
              </template>
            </v-tooltip>
          </td>
          <td>
            <v-tooltip :text="item.description" location="top left">
              <template v-slot:activator="{ props }">
                <span v-bind="props" class="ellipsis-one-line">{{
                  item.description
                }}</span>
              </template>
            </v-tooltip>
          </td>
          <td>
            <div class="d-flex align-center justify-between">
              <span class="d-block" :style="{ width: '120px' }">
                {{
                  item.status === StatusEvaluationCriteriaType.FOLLOWING
                    ? t('settings.evaluationItem.table.isStatus')
                    : t('settings.evaluationItem.table.isNotStatus')
                }}
              </span>
            </div>
          </td>
          <td>
            <v-btn
              v-if="role.evaluationCriteriaSetting?.update"
              class="rounded-circle"
              icon="mdi-trash-can-outline"
              variant="text"
              @click="handleClickEdit(item.id)"
            >
              <template v-slot:default>
                <v-img :src="editIcon"></v-img>
              </template>
            </v-btn>
          </td>
        </tr>
      </template>
    </TableBase>
    <LoadingOverlay :loading="store.isFetching" />
  </v-card>
  <SettingEvaluationItemDialog v-if="dialogStore.isOpen" />
</template>

<style lang="scss" scoped>
:deep(.v-table__wrapper) {
  height: calc(100vh - $offset-table-height-in-list - 40px); // 40px: height of header tab
}

:deep(.v-checkbox-btn) {
  justify-content: flex-start !important;
}
</style>
