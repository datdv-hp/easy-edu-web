<script setup lang="ts">
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { useRole } from '@/common/stores/role.store';
import { LoadingOverlay, TableBase, TableHeader } from '@/components';
import BaseDeleteConfirmText from '@/components/base/BaseDeleteConfirmText.vue';
import SettingCourseDialog from '@/features/setting/components/SettingCourseDialog.vue';
import { useSettingCourseDialog } from '@/features/setting/stores/setting-course-dialog.store';
import { useSettingCourseStore } from '@/features/setting/stores/settingCourse.store';
import { showDialogConfirm } from '@/plugins';
import { onBeforeUnmount, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const settingCourseDialog = useSettingCourseDialog();
const store = useSettingCourseStore();
const dialogStore = useSettingCourseDialog();
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
        title: t('settings.confirmation.deleteCourseType', {
          total: store.selectedIds.length,
        }),
        data: data,
      },
    },
  });

  if (confirm) {
    const res = await store.removeSelectedItems();
    if (res.success) {
      showSuccessNotification(t('settings.success.courseTypeDelete'));
      store.selectedIds = [];
      await store.getList();
      if (!store.list?.length) {
        if ((store.courseTypeListQuery?.page as number) > 1) {
          store.setPage((store.courseTypeListQuery.page as number) - 1);
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
  <v-card class="pa-0 ma-4 mt-0">
    <div class="wrapper">
      <TableHeader
        :show-delete="store.showDelete"
        @remove-items="removeSelectedItems"
        :total="store.totalPages"
        @change-page="updatePage"
        :page="store.courseTypeListQuery.page || 1"
        :title="$t('settings.courseTypeTotal', { total: store.total })"
      />

      <TableBase :is-empty="!store.total">
        <template #thead>
          <tr>
            <th
              v-if="role.courseFormSetting?.delete"
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
            <th v-if="role.courseFormSetting?.update" class="text-left ws-nowrap w-10">
              {{ t('settings.courseTable.action') }}
            </th>
          </tr>
        </template>
        <template #tbody>
          <tr v-for="(item, index) in store.list" :key="index">
            <td v-if="role.courseFormSetting?.delete" @click="(e) => e.stopPropagation()">
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
            <td v-if="role.courseFormSetting?.update">
              <v-btn
                class="rounded-circle"
                icon="$custom.edit"
                variant="text"
                @click="handleClickEdit(item.id)"
              >
              </v-btn>
            </td>
          </tr>
        </template>
      </TableBase>
      <LoadingOverlay :loading="store.isFetching" />
    </div>
  </v-card>
  <SettingCourseDialog v-if="settingCourseDialog.isOpen" />
</template>

<style lang="scss" scoped>
.courseType-input {
  max-width: 300px !important;
}

.button-cancel {
  :deep(.v-btn) {
    border: 1px solid #e0e0e0;
    &:hover {
      background-color: #e0e0e0 !important;
    }
  }
}

:deep(.v-field__input) {
  min-height: 36px !important;
}

:deep(.status-container) {
  display: none;
}
</style>
