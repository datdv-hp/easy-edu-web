<script setup lang="ts">
import editIcon from '@/assets/icons/lms/edit-icon.svg';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { BaseButton, LoadingOverlay, TableBase, TableHeader } from '@/components';
import { useSettingEvaluationDialog } from '@/features/setting/stores/setting-evaluation-dialog.store';
import { useSettingEvaluationStore } from '@/features/setting/stores/settingEvaluation.store';
import { showDialogConfirm } from '@/plugins';
import { onBeforeUnmount, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SettingEvaluationDialog from '../../../components/SettingEvaluationDialog.vue';
import BaseDeleteConfirmText from '@/components/base/BaseDeleteConfirmText.vue';
import { useRole } from '@/common/stores/role.store';
import SettingEvaluationListSearchBar from './SettingEvaluationListSearchBar.vue';

const { t } = useI18n();
const settingEvaluationDialog = useSettingEvaluationDialog();
const store = useSettingEvaluationStore();
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

const removeSelectedItems = async () => {
  const data = store.list.filter((item) => store.selectedIds.includes(item.id));
  const confirm = await showDialogConfirm('error', {
    title: t('common.deleteConfirm'),
    textComponent: {
      component: BaseDeleteConfirmText,
      props: {
        title: t('settings.confirmation.deleteEvaluationType', {
          total: store.selectedIds.length,
        }),
        data: data,
      },
    },
  });

  if (confirm) {
    const res = await store.removeSelectedItems();
    if (res.success) {
      showSuccessNotification(t('settings.success.evaluationDelete'));
      store.selectedIds = [];
      await store.getList();
      if (!store.list?.length) {
        if ((store.evaluationTypeListQuery?.page as number) > 1) {
          store.setPage((store.evaluationTypeListQuery.page as number) - 1);
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
  settingEvaluationDialog.open(id);
};
//

const updatePage = async (value: number) => {
  if (value > store.totalPages) {
    value = 1;
  }
  store.setPage(value);
  await store.getList();
};

onBeforeUnmount(() => {
  store.unSelectAll();
});
</script>
<template>
  <div class="header-top d-flex align-center">
    <SettingEvaluationListSearchBar />
    <BaseButton
      v-if="role.evaluationClassifiedSetting?.create"
      class="mr-4"
      :label="t('common.button.create')"
      size="medium"
      @click="settingEvaluationDialog.open()"
    />
  </div>
  <v-card class="pa-0 ma-4 mt-0">
    <div class="wrapper">
      <TableHeader
        :show-delete="store.showDelete"
        @remove-items="removeSelectedItems"
        :total="store.totalPages"
        @change-page="updatePage"
        :page="store.evaluationTypeListQuery.page || 1"
        :title="$t('settings.evaluationClassifiedTotal', { total: store.total })"
      />

      <TableBase :is-empty="!store.total">
        <template #thead>
          <tr>
            <th
              v-if="role.evaluationClassifiedSetting?.delete"
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
            <th class="text-left ws-nowrap w-80">
              {{ t('settings.courseTable.option') }}
            </th>
            <th
              v-if="role.evaluationClassifiedSetting?.update"
              class="text-left ws-nowrap w-10"
            >
              {{ t('settings.courseTable.action') }}
            </th>
          </tr>
        </template>
        <template #tbody>
          <tr v-for="(item, index) in store.list" :key="index">
            <td
              v-if="role.evaluationClassifiedSetting?.delete"
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
            <td v-if="role.evaluationClassifiedSetting?.update">
              <v-btn
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
    </div>
  </v-card>
  <SettingEvaluationDialog v-if="settingEvaluationDialog.isOpen" />
</template>

<style lang="scss" scoped>
:deep(.v-table__wrapper) {
  height: calc(100vh - $offset-table-height-in-list - 40px); // 40px: height of header tab
}

.evaluationClassified-input {
  max-width: 300px !important;
}
</style>
