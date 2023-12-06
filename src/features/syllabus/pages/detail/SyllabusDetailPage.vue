<script lang="ts" setup>
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import SyllabusInfo from './components/SyllabusInfo.vue';
import SyllabusCover from './components/SyllabusCover.vue';
import SyllabusLectureList from './components/SyllabusLectureList.vue';
import SyllabusUpdateHistories from './components/SyllabusUpdateHistories.vue';
import { useLectureDialog, useSyllabusDetail } from '../../stores';
import LectureDialog from './components/LectureDialog.vue';
import { BaseButton } from '@/components';
import { useRole } from '@/common/stores/role.store';
import icons from '@/assets/icons';
import { useI18n } from 'vue-i18n';
import { showDialogConfirm } from '@/plugins';
import SyllabusDeleteConfirmText from '../../components/SyllabusDeleteConfirmText.vue';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import router from '@/plugins/vue-router';
import { PageName } from '@/common/constants';
import BasicInfoDialog from './components/BasicInfoDialog.vue';
import { useSyllabusBasicInfoDialog } from '../../stores/basic-info-dialog.store';

const route = useRoute();
const { t } = useI18n();
const store = useSyllabusDetail();
const lectureDialog = useLectureDialog();
const basicInfoDialog = useSyllabusBasicInfoDialog();
const role = useRole();
const syllabusId = route.params.id as string;

onBeforeMount(() => {
  Promise.all([
    store.getBasicInfo(syllabusId),
    store.getLectureList(syllabusId),
    store.getUpdateHistoryList(syllabusId),
  ]);
});

function goToListPage() {
  router.replace({ name: PageName.SYLLABUS_LIST_PAGE });
}

async function deleteSyllabus() {
  const checkAssignedSyllabus = await store.checkAssignedSyllabus(syllabusId);
  if (!checkAssignedSyllabus.success) {
    showErrorNotification(
      checkAssignedSyllabus.error || (checkAssignedSyllabus.message as string),
    );
  }
  const confirm = await showDialogConfirm('info', {
    title: t('common.deleteConfirm'),
    textComponent: {
      component: SyllabusDeleteConfirmText,
      props: {
        isAssignedToClassroom: !!checkAssignedSyllabus?.data,
        withoutTotal: true,
      },
    },
  });
  if (confirm) {
    const res = await store.deleteSyllabus(syllabusId);
    if (res.success) {
      showSuccessNotification(t('syllabus.success.delete'));
      goToListPage();
      store.resetDetail();
      return;
    }
    if (res?.errors?.length) {
      const error = res.errors[0];
      showErrorNotification(error.message);
    } else {
      showErrorNotification(res.error || (res.message as string));
    }
  }
}

onBeforeUnmount(() => {
  store.resetDetail();
});
</script>
<template>
  <HeaderBar>
    <template #title>{{ $t('syllabus.detail.title') }}</template>
    <template #append>
      <BaseButton
        v-if="role.syllabus?.delete"
        class="mr-2"
        size="extra-small"
        variant="outline"
        @click="deleteSyllabus"
      >
        <v-img width="16" :src="icons.deleteIcon" class="mr-1" />
        <span>{{ $t('common.button.delete') }}</span>
      </BaseButton>
    </template>
  </HeaderBar>
  <v-row class="mt-2 mx-1">
    <v-col cols="5" class="pe-2 py-2">
      <SyllabusCover />
    </v-col>
    <v-col cols="7" class="ps-2 py-2">
      <SyllabusInfo />
    </v-col>
  </v-row>
  <v-row class="mx-1">
    <v-col cols="12" class="py-2">
      <SyllabusLectureList />
    </v-col>
  </v-row>
  <v-row class="mx-1 mb-1">
    <v-col cols="12" class="py-2">
      <SyllabusUpdateHistories />
    </v-col>
  </v-row>
  <LectureDialog v-if="lectureDialog.isOpen && role.syllabus?.update" />
  <BasicInfoDialog v-if="basicInfoDialog.isOpen && role.syllabus?.update" />
</template>
<style lang="scss" scoped></style>
