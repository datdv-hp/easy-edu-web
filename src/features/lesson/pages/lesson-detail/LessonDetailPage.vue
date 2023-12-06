<script lang="ts" setup>
import icons from '@/assets/icons';
import { ErrorCode, PageName } from '@/common/constants';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { useRole } from '@/common/stores/role.store';
import { BaseButton } from '@/components';
import LessonFormDialog from '@/features/lesson/components/LessonFormDialog.vue';
import { useLessonDialog, useLessonStore } from '@/features/lesson/stores';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { showDialogConfirm } from '@/plugins';
import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import LessonProfile from './components/LessonProfile.vue';
import AttendanceTable from './components/AttendanceTable.vue';
import { IResponseError } from '@/common/interfaces';
import { LessonDetailTab } from '../../constants';
import SyllabusLectureList from './components/SyllabusLectureList.vue';

const router = useRouter();
const { t } = useI18n();
const route = useRoute();
const role = useRole();
const dialogStore = useLessonDialog();
const store = useLessonStore();

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
    name: PageName.LESSON_LIST_PAGE,
  });
};

const getProfile = async () => {
  const res = await store.getDetailInfo(route.params.id as string);
  if (res.success) return;
  if (res?.errors?.length) {
    const error = res?.errors[0];
    const i18nKey = `lesson.get.${error.errorCode}.${error.key}`;
    showErrorNotification(t(i18nKey));
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
  goToListPage();
};

const handleDeleteError = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const i18nKey = `lesson.delete.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      showErrorNotification(t(i18nKey));
      goToListPage();
      break;
    case ErrorCode.ITEM_INVALID:
      showErrorNotification(t(i18nKey));
      break;
    default:
      showErrorNotification(t('lesson.notification.error.delete'));
      break;
  }
};

const deleteLesson = async () => {
  const confirm = await showDialogConfirm('error', {
    title: t('common.deleteConfirm'),
    text: t('lesson.detail.messages.deleteConfirm'),
  });

  if (confirm) {
    const res = await store.deleteLesson(route.params.id as string);
    if (res.success) {
      showSuccessNotification(t('lesson.notification.success.delete'));
      store.selectedIds = {};
      goToListPage();
      return;
    }
    if (res?.errors?.length) {
      handleDeleteError(res.errors[0]);
    } else {
      showErrorNotification(res.error || (res.message as string));
    }
  }
};

const lessonName = computed(() => {
  const name = store?.lessonInfo?.name;
  const status = store?.lessonInfo?.status?.toLowerCase();
  return name ? name + (status ? t(`lesson.detail.status.${status}`) : '') : '';
});

const tab = ref<LessonDetailTab>(LessonDetailTab.ATTENDANCE);
</script>

<template>
  <HeaderBar>
    <template #title>
      <span>{{ lessonName }}</span>
    </template>
    <template #append>
      <BaseButton
        v-if="role.lesson?.delete"
        class="mr-2"
        size="extra-small"
        variant="outline"
        @click="deleteLesson"
      >
        <v-img width="16" :src="icons.deleteIcon" class="mr-1" />
        <span>{{ $t('common.button.delete') }}</span>
      </BaseButton>
      <BaseButton
        v-if="role.lesson?.update || role.lesson?.updateDocument"
        size="extra-small"
        @click="openEditDialog"
      >
        <v-img width="16" :src="icons.editWhite" class="mr-1" />
        <span>{{ $t('common.button.edit') }}</span>
      </BaseButton>
    </template>
  </HeaderBar>
  <LessonProfile />
  <v-card class="pt-4 ma-4">
    <v-card-title class="px-1">
      <v-tabs class="custom-tabs" v-model="tab" color="#6D79E8" align-tabs="start">
        <v-tab class="px-4" :value="LessonDetailTab.ATTENDANCE">{{
          $t('lesson.detail.attendance.title')
        }}</v-tab>
        <v-tab class="px-4" :value="LessonDetailTab.SYLLABUS">{{
          $t('syllabus.detail.lectureList.title')
        }}</v-tab>
      </v-tabs>
    </v-card-title>
    <v-card-text class="pa-0">
      <v-window class="custom-windows pt-4" v-model="tab">
        <v-window-item :value="LessonDetailTab.ATTENDANCE">
          <AttendanceTable />
        </v-window-item>
        <v-window-item :value="LessonDetailTab.SYLLABUS">
          <SyllabusLectureList
            :lecture-list="store.lessonInfo?.lectures || []"
            :syllabus="store.lessonInfo?.syllabus"
          />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
  <LessonFormDialog v-if="dialogStore.isOpen" @update-not-existed="goToListPage" />
</template>

<style lang="scss" scoped>
:deep(.v-slide-group) {
  margin: 0;
  --v-tabs-height: 40px !important;
  border-bottom: 1px solid #00000014;
}
</style>
