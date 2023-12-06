<script lang="ts" setup>
import icons from '@/assets/icons';
import { ErrorCode, PageName } from '@/common/constants';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { useRole } from '@/common/stores/role.store';
import { BaseButton } from '@/components';
import { useCourseDetail, useCourseDialog } from '@/features/courses/store';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { showDialogConfirm } from '@/plugins';
import router from '@/plugins/vue-router';
import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import DialogCourse from '../../components/DialogCourse.vue';
import { CourseDetailTab } from '../../contants';
import ClassroomTab from './components/ClassroomTab.vue';
import CourseProfile from './components/CourseProfile.vue';
import SubjectTab from './components/SubjectTab.vue';
import TeacherTab from './components/TeacherTab.vue';

const route = useRoute();
const role = useRole();
const dialogStore = useCourseDialog();
const store = useCourseDetail();
const { t } = useI18n();
const tab = ref<CourseDetailTab>();

onBeforeMount(async () => {
  getProfile();
});

onBeforeUnmount(() => {
  store.resetDetailPage();
});

const getProfile = async () => {
  store.setCurrentCourseId(route.params.id as string);
  const res = await store.getDetail(route.params.id as string);
  if (res.success) {
    return;
  }
  if (res?.errors?.length) {
    const error = res?.errors[0];
    const i18nKey = `courses.get.${error.errorCode}.${error.key}`;
    showErrorNotification(t(i18nKey));
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
  goToListPage();
};

const openEditDialog = () => {
  dialogStore.open(route.params.id as string);
};

const goToListPage = () => {
  router.replace({
    name: PageName.COURSE_LIST_PAGE,
  });
};

const handleDeleteErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const i18nKey = `courses.deleteError.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      showErrorNotification(t(i18nKey));
      goToListPage();
      break;
    case ErrorCode.ITEM_ALREADY_EXIST:
      showErrorNotification(t(i18nKey));
      break;
    default:
      showErrorNotification(t('courses.notification.error.delete'));
      break;
  }
};

const deleteCourse = async () => {
  const confirm = await showDialogConfirm('error', {
    title: t('common.deleteConfirm'),
    text: t('courses.detail.deleteConfirmMessage'),
  });

  if (confirm) {
    const res = await store.deleteCourse(route.params.id as string);
    if (res.success) {
      showSuccessNotification(t('courses.notification.success.delete'));
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
const courseName = computed(() => {
  const name = store?.detail?.name;
  const code = store.detail?.code;
  return name ? name + (code ? ` (${code})` : '') : '';
});
const isShowTabs = computed(
  () =>
    role.course?.viewClassroomByCourse ||
    role.course?.viewPersonalClassroomByCourse ||
    role.course?.viewSubjectByCourse ||
    role.course?.viewTeacherByCourse,
);
</script>

<template>
  <HeaderBar>
    <template #title>
      {{ courseName }}
    </template>
    <template v-if="role.course?.delete || role.course?.update" #append>
      <BaseButton
        v-if="role.course?.delete"
        class="mr-2"
        size="extra-small"
        variant="outline"
        @click="deleteCourse"
      >
        <v-img width="16" :src="icons.deleteIcon" class="mr-1" />
        <span>{{ $t('common.button.delete') }}</span>
      </BaseButton>
      <BaseButton
        v-if="role.course?.update"
        size="extra-small"
        variant="solid"
        @click="openEditDialog"
      >
        <v-img width="16" :src="icons.editWhite" class="mr-1" />
        <span>{{ $t('common.button.edit') }}</span>
      </BaseButton>
    </template>
  </HeaderBar>
  <div class="pa-4">
    <CourseProfile />
    <v-card v-if="isShowTabs" class="mt-4 pt-4" :height="600">
      <v-card-title class="px-1">
        <v-tabs class="custom-tabs" v-model="tab" color="#6D79E8" align-tabs="start">
          <v-tab
            v-if="
              role.course?.viewClassroomByCourse ||
              role.course?.viewPersonalClassroomByCourse
            "
            class="px-4"
            :value="CourseDetailTab.CLASSROOM"
            >{{ $t('courses.detail.classroom.tabTitle') }}</v-tab
          >
          <v-tab
            v-if="role.course?.viewSubjectByCourse"
            class="px-4"
            :value="CourseDetailTab.SUBJECT"
            >{{ $t('courses.detail.subject.tabTitle') }}</v-tab
          >
          <v-tab
            v-if="role.course?.viewTeacherByCourse"
            class="px-4"
            :value="CourseDetailTab.TEACHER"
            >{{ $t('courses.detail.teacher.tabTitle') }}</v-tab
          >
        </v-tabs>
      </v-card-title>
      <v-card-text v-if="isShowTabs" class="pa-0">
        <v-window class="custom-windows pt-4" v-model="tab">
          <v-window-item
            v-if="
              role.course?.viewClassroomByCourse ||
              role.course?.viewPersonalClassroomByCourse
            "
            :value="CourseDetailTab.CLASSROOM"
          >
            <ClassroomTab />
          </v-window-item>
          <v-window-item
            v-if="role.course?.viewSubjectByCourse"
            :value="CourseDetailTab.SUBJECT"
          >
            <SubjectTab />
          </v-window-item>
          <v-window-item
            v-if="role.course?.viewTeacherByCourse"
            :value="CourseDetailTab.TEACHER"
          >
            <TeacherTab />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
  <DialogCourse v-if="dialogStore.isOpen && role.course?.update" />
</template>

<style lang="scss" scoped>
:deep(.v-slide-group) {
  margin: 0;
  --v-tabs-height: 40px !important;
  border-bottom: 1px solid #00000014;
}
</style>
