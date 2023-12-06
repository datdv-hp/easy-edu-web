<script lang="ts" setup>
import icons from '@/assets/icons';
import { ErrorCode, PageName } from '@/common/constants';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { useRole } from '@/common/stores/role.store';
import { BaseButton, LoadingOverlay } from '@/components';
import ClassroomFormDialog from '@/features/classroom/components/ClassroomFormDialog.vue';
import { useClassroomDialog, useClassroomStore } from '@/features/classroom/stores';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { showDialogConfirm } from '@/plugins';
import router from '@/plugins/vue-router';
import { onBeforeMount, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import ClassroomDetailAction from './components/ClassroomDetailAction.vue';
import ClassroomDetailCard from './components/ClassroomDetailCard.vue';

const route = useRoute();
const role = useRole();
const dialogStore = useClassroomDialog();
const store = useClassroomStore();
const { t } = useI18n();

onBeforeMount(async () => {
  getProfile();
});

onUnmounted(() => {
  store.detail = undefined;
});

const openEditDialog = () => {
  dialogStore.open(route.params.id as string);
};

const goToListPage = () => {
  router.replace({
    name: PageName.CLASSROOM_LIST_PAGE,
  });
};

const getProfile = async () => {
  const res = await store.getDetail(route.params.id as string);
  if (res.success) return;
  if (res?.errors?.length) {
    const error = res?.errors[0];
    const i18nKey = `classroom.get.${error.errorCode}.${error.key}`;
    showErrorNotification(t(i18nKey));
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
  goToListPage();
};

const handleDeleteErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const i18nKey = `classroom.delete.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      showErrorNotification(t(i18nKey));
      goToListPage();
      break;
    case ErrorCode.ITEM_ALREADY_EXIST:
      showErrorNotification(t(i18nKey));
      break;
    default:
      showErrorNotification(t('classroom.notification.error.delete'));
      break;
  }
};

const deleteClassroom = async () => {
  const confirm = await showDialogConfirm('error', {
    title: t('common.deleteConfirm'),
    text: t('classroom.deleteConfirmMessageModal'),
  });

  if (confirm) {
    const res = await store.deleteClassroom(route.params.id as string);
    if (res.success) {
      showSuccessNotification(t('classroom.notification.success.delete'));
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
</script>

<template>
  <HeaderBar>
    <template #title>
      {{ store.detail ? `${store.detail?.name} (${store.detail?.code})` : '' }}
    </template>
    <template #append>
      <BaseButton
        v-if="role.classroom?.delete"
        class="mr-2"
        size="extra-small"
        variant="outline"
        @click="deleteClassroom"
      >
        <v-img width="16" :src="icons.deleteIcon" class="mr-1" />
        <span>{{ $t('common.button.delete') }}</span>
      </BaseButton>
      <BaseButton
        v-if="role.classroom?.update"
        size="extra-small"
        variant="solid"
        @click="openEditDialog"
      >
        <v-img width="16" :src="icons.editWhite" class="mr-1" />
        <span>{{ $t('common.button.edit') }}</span>
      </BaseButton>
    </template>
  </HeaderBar>
  <ClassroomDetailCard />
  <ClassroomDetailAction
    v-if="
      role.classroom?.viewGeneralClassroom ||
      role.classroom?.viewStudentClassroom ||
      role.classroom?.viewAttendance ||
      role.classroom?.viewTimeKeeping ||
      role.classroom?.viewSyllabus
    "
  />
  <ClassroomFormDialog v-if="dialogStore.isOpen && role.classroom?.update" />
  <LoadingOverlay :loading="store.isFetching" />
</template>

<style lang="scss" scoped></style>
