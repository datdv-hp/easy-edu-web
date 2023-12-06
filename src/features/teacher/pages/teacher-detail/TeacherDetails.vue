<script lang="ts" setup>
import icons from '@/assets/icons';
import { ErrorCode, PageName } from '@/common/constants';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { useRole } from '@/common/stores/role.store';
import { BaseButton } from '@/components';
import TeacherFormDialog from '@/features/teacher/components/TeacherFormDialog.vue';
import { TeacherTab } from '@/features/teacher/constants';
import { useTeacherDialog, useTeacherStore } from '@/features/teacher/stores';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { showDialogConfirm } from '@/plugins';
import router from '@/plugins/vue-router';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import ClassList from './components/class-list/ClassList.vue';
import TeacherProfile from './components/profile/TeacherProfile.vue';

const route = useRoute();
const role = useRole();
const dialogStore = useTeacherDialog();
const store = useTeacherStore();
const { t } = useI18n();

onBeforeMount(async () => {
  await getProfile();
});

onBeforeUnmount(() => {
  store.setProfile(undefined);
});

const openEditDialog = () => {
  dialogStore.open(route.params.id as string);
};

const goToListPage = () => {
  router.replace({
    name: PageName.TEACHER_LIST_PAGE,
  });
};

const getProfile = async () => {
  const res = await store.getProfile(route.params.id as string);
  if (res.success) return;
  if (res?.errors?.length) {
    const error = res?.errors[0];
    const i18nKey = `teacher.get.${error.errorCode}.${error.key}`;
    showErrorNotification(t(i18nKey));
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
  goToListPage();
};

const handleDeleteErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const i18nKey = `teacher.delete.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      showErrorNotification(t(i18nKey));
      goToListPage();
      break;
    case ErrorCode.CONFLICT:
      showErrorNotification(t(i18nKey));
      break;
    default:
      showErrorNotification(t('teacher.notification.error.delete'));
      break;
  }
};

const deleteTeacher = async () => {
  const confirm = await showDialogConfirm('error', {
    title: t('common.deleteConfirm'),
    text: t('teacher.detail.deleteConfirmMessage'),
  });

  if (confirm) {
    const res = await store.deleteTeacherById(route.params.id as string);
    if (res.success) {
      showSuccessNotification(t('teacher.notification.success.delete'));
      store.unSelectAll();
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
  <HeaderBar :has-extension="true">
    <template #title>{{
      store.profile ? `${store.profile?.name} (${store.profile?.code})` : ''
    }}</template>
    <template #append>
      <BaseButton
        v-if="role.teacher?.delete"
        class="mr-2"
        size="extra-small"
        variant="outline"
        @click="deleteTeacher"
      >
        <v-img width="16" :src="icons.deleteIcon" class="mr-1" />
        <span>{{ $t('common.button.delete') }}</span>
      </BaseButton>

      <BaseButton
        v-if="role.teacher?.update"
        size="extra-small"
        variant="solid"
        @click="openEditDialog"
      >
        <v-img width="16" :src="icons.editWhite" class="mr-1" />
        <span>{{ $t('common.button.edit') }}</span>
      </BaseButton>
    </template>
    <template #extension>
      <v-tabs
        class="custom-tabs"
        :model-value="store.tab"
        color="#6D79E8"
        align-tabs="start"
        @update:model-value="store.setTab"
      >
        <v-tab :value="TeacherTab.basic_info">{{
          $t('teacher.detail.info.basic.title')
        }}</v-tab>
        <v-tab
          v-if="role.teacher?.viewClassroomByTeacher"
          :value="TeacherTab.courses_info"
          >{{ $t('teacher.detail.info.courses.title') }}</v-tab
        >
      </v-tabs>
    </template>
  </HeaderBar>

  <v-window v-model="store.tab">
    <v-window-item :value="TeacherTab.basic_info">
      <TeacherProfile @resent-email="getProfile" />
    </v-window-item>
    <v-window-item
      v-if="role.teacher?.viewClassroomByTeacher"
      :value="TeacherTab.courses_info"
    >
      <ClassList />
    </v-window-item>
  </v-window>
  <TeacherFormDialog v-if="dialogStore.isOpen" />
</template>

<style lang="scss" scoped></style>
