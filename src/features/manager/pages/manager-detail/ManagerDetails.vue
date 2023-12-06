<script lang="ts" setup>
import icons from '@/assets/icons';
import { ErrorCode, PageName } from '@/common/constants';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { useRole } from '@/common/stores/role.store';
import { BaseButton } from '@/components';
import ManagerFormDialog from '@/features/manager/components/ManagerFormDialog.vue';
import { useManagerDialog, useManagerStore } from '@/features/manager/stores';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { showDialogConfirm } from '@/plugins';
import router from '@/plugins/vue-router';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import ManagerProfile from './components/ManagerProfile.vue';
import { useUserStore } from '@/features/auth/stores';
import { computed } from 'vue';

const route = useRoute();
const dialogStore = useManagerDialog();
const role = useRole();
const store = useManagerStore();
const userStore = useUserStore();
const { t } = useI18n();

onBeforeMount(async () => {
  getProfile();
});

onBeforeUnmount(() => {
  store.resetDetailPage();
});

const openEditDialog = () => {
  dialogStore.open(route.params.id as string);
};
const goToListPage = () => {
  router.replace({
    name: PageName.MANAGER_LIST_PAGE,
  });
};

const getProfile = async () => {
  const res = await store.getProfile(route.params.id as string);
  if (res.success) return;
  if (res?.errors?.length) {
    const error = res?.errors[0];
    const i18nKey = `manager.get.${error.errorCode}.${error.key}`;
    showErrorNotification(t(i18nKey));
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
  goToListPage();
};

const handleDeleteErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const i18nKey = `manager.delete.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      showErrorNotification(t(i18nKey));
      goToListPage();
      break;
    case ErrorCode.CONFLICT:
      showErrorNotification(t(i18nKey));
      break;
    default:
      showErrorNotification(t('manager.notification.error.delete'));
      break;
  }
};
const deleteManager = async () => {
  const confirm = await showDialogConfirm('error', {
    title: t('common.deleteConfirm'),
    text: t('manager.detail.deleteConfirmMessage'),
  });

  if (confirm) {
    const res = await store.deleteManager(route.params.id as string);
    if (res.success) {
      showSuccessNotification(t('manager.notification.success.delete'));
      store.selectedIds = {};
      goToListPage();
      return;
    }
    if (res?.errors?.length) {
      handleDeleteErrors(res.errors[0]);
    } else {
      showErrorNotification(res.error || (res.message as string));
    }
  }
};
const isShowActions = computed(() => {
  return store.profile?.id && userStore.currentUserId !== store.profile.id;
});
</script>

<template>
  <HeaderBar>
    <template #title>{{ store.profile ? `${store.profile?.name}` : '' }}</template>
    <template #append v-if="isShowActions">
      <BaseButton
        v-if="role.manager?.delete && isShowActions"
        class="mr-2"
        size="extra-small"
        variant="outline"
        @click="deleteManager"
      >
        <v-img width="16" :src="icons.deleteIcon" class="mr-1" />
        <span>{{ $t('common.button.delete') }}</span>
      </BaseButton>
      <BaseButton
        v-if="role.manager?.update && isShowActions"
        size="extra-small"
        variant="solid"
        @click="openEditDialog"
      >
        <v-img width="16" :src="icons.editWhite" class="mr-1" />
        <span>{{ $t('common.button.edit') }}</span>
      </BaseButton>
    </template>
  </HeaderBar>
  <ManagerProfile @resent-email="getProfile" />
  <ManagerFormDialog v-if="dialogStore.isOpen" />
</template>

<style lang="scss" scoped></style>
