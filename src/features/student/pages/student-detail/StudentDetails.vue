<script lang="ts" setup>
import icons from '@/assets/icons';
import { ErrorCode, PageName } from '@/common/constants';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { useRole } from '@/common/stores/role.store';
import { BaseButton } from '@/components';
import DialogStudent from '@/features/student/components/DialogStudent.vue';
import { StudentTab } from '@/features/student/contants';
import { useStudentDialog, useStudentStore } from '@/features/student/stores';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { showDialogConfirm } from '@/plugins';
import router from '@/plugins/vue-router';
import { computed, onBeforeMount, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import CoursesInfo from './components/courses/CoursesInfo.vue';
import StudentProfile from './components/profile/StudentProfile.vue';
import { IResponseError } from '@/common/interfaces';

const route = useRoute();
const role = useRole();
const dialogStore = useStudentDialog();
const store = useStudentStore();
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
    name: PageName.STUDENT_LIST_PAGE,
  });
};

const getProfile = async () => {
  const res = await store.getProfile(route.params.id as string);
  if (res.success) return;
  if (res?.errors?.length) {
    const error = res?.errors[0];
    const i18nKey = `student.get.${error.errorCode}.${error.key}`;
    showErrorNotification(t(i18nKey));
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
  goToListPage();
};

const handleDeleteErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const i18nKey = `student.delete.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      showErrorNotification(t(i18nKey));
      goToListPage();
      break;
    case ErrorCode.CONFLICT:
      showErrorNotification(t(i18nKey));
      break;
    default:
      showErrorNotification(t('student.notification.error.delete'));
      break;
  }
};
const deleteStudent = async () => {
  const confirm = await showDialogConfirm('error', {
    title: t('common.deleteConfirm'),
    text: t('student.detail.deleteConfirmMessage'),
  });

  if (confirm) {
    const res = await store.deleteStudent(route.params.id as string);
    if (res.success) {
      showSuccessNotification(t('student.notification.success.delete'));
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
const profileName = computed(() => {
  const name = store.profile?.name;
  const code = store.profile?.code;
  return name ? name + (code ? ` (${code})` : '') : '';
});
</script>

<template>
  <HeaderBar :has-extension="true">
    <template #title>{{ profileName }}</template>
    <template #append>
      <BaseButton
        v-if="role.student?.delete"
        class="mr-2"
        size="extra-small"
        variant="outline"
        @click="deleteStudent"
      >
        <v-img width="16" :src="icons.deleteIcon" class="mr-1" />
        <span>{{ $t('common.button.delete') }}</span>
      </BaseButton>
      <BaseButton
        v-if="role.student?.update"
        size="extra-small"
        variant="solid"
        @click="openEditDialog"
      >
        <v-img width="16" :src="icons.editWhite" class="mr-1" />
        <span>{{ $t('common.button.edit') }}</span>
      </BaseButton>
    </template>
    <template #extension>
      <v-tabs class="custom-tabs" v-model="store.tab" color="#6D79E8" align-tabs="start">
        <v-tab :value="StudentTab.basic_info">{{
          $t('student.detail.info.basic.title')
        }}</v-tab>
        <v-tab
          v-if="role.student?.viewClassroomByStudent"
          :value="StudentTab.courses_info"
          >{{ $t('student.detail.info.courses.title') }}</v-tab
        >
      </v-tabs>
    </template>
  </HeaderBar>

  <v-window v-model="store.tab">
    <v-window-item :value="StudentTab.basic_info">
      <StudentProfile @resent-email="getProfile" />
    </v-window-item>
    <v-window-item
      v-if="role.student?.viewClassroomByStudent"
      :value="StudentTab.courses_info"
    >
      <CoursesInfo />
    </v-window-item>
  </v-window>
  <DialogStudent v-if="dialogStore.isOpen" />
</template>

<style lang="scss" scoped></style>
