<script setup lang="ts">
import { useLessonStore } from '@/features/lesson/stores';

import { LoadingOverlay, ProfileItem } from '@/components';
import Icons from '@/assets/icons';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ProfileCardItem from '@/components/ProfileCardItem.vue';

const { t } = useI18n();
const store = useLessonStore();

const _profile = computed(() => {
  const profile = [
    {
      icon: Icons.keyIcon,
      title: t('lesson.detail.info.id'),
      description: store.lessonInfo?.code,
      isShow: !!store.lessonInfo?.code,
    },
    {
      icon: Icons.description,
      title: t('lesson.detail.info.course'),
      description: store.lessonInfo?.courseName,
      isShow: !!store.lessonInfo?.courseName,
    },
    {
      icon: Icons.description,
      title: t('lesson.detail.info.lessonName'),
      description: store.lessonInfo?.name,
      isShow: !!store.lessonInfo?.name,
    },
    {
      icon: Icons.classroom,
      title: t('lesson.detail.info.classroom'),
      description: store.lessonInfo?.classroomName,
      isShow: !!store.lessonInfo?.classroomName,
    },
    {
      icon: Icons.subject,
      title: t('lesson.detail.info.subject'),
      description: store.lessonInfo?.subjectName,
      isShow: !!store.lessonInfo?.subjectName,
    },
    {
      icon: Icons.teacher,
      title: t('lesson.detail.info.teacher'),
      description: store.lessonInfo?.teacherName,
      isShow: !!store.lessonInfo?.teacherName,
    },
    {
      icon: Icons.location,
      title: t('lesson.detail.info.room'),
      description: store.lessonInfo?.isUseGoogleMeet
        ? 'Google Meet'
        : store.lessonInfo?.room,
      link: store.lessonInfo?.isUseGoogleMeet ? store.lessonInfo.meetUrl : undefined,
      isShow: !!store.lessonInfo?.room || store.lessonInfo?.meetUrl,
    },
    {
      icon: Icons.date,
      title: t('lesson.detail.info.date'),
      description: store.lessonInfo?.date,
      isShow: !!store.lessonInfo?.date,
    },
    {
      icon: Icons.clock,
      title: t('lesson.detail.info.time'),
      description: store.lessonInfo?.timeRange,
      isShow: !!store.lessonInfo?.timeRange,
    },
    {
      icon: Icons.document,
      title: t('lesson.detail.info.document'),
      description: store?.lessonInfo?.documents || [],
      isShow: !!store?.lessonInfo?.documents?.length,
      isList: true,
      isLinks: true,
    },
  ];
  return profile.filter((item) => item.isShow);
});

const students = computed(() => {
  const _students = [
    {
      icon: Icons.userWhite,
      title: t('lesson.detail.info.totalStudents'),
      description: store.lessonInfo?.totalStudents?.toString(),
      isShow: !!store.lessonInfo?.totalStudents?.toString(),
      color: 'primary',
    },
    {
      icon: Icons.userWhite,
      title: t('lesson.detail.info.totalParticipants'),
      description: store.lessonInfo?.totalParticipants?.toString(),
      isShow: !!store.lessonInfo?.totalParticipants?.toString(),
      color: 'info',
    },
  ];
  return _students.filter((item) => item.isShow);
});
</script>

<template>
  <v-card class="ma-4" min-height="300">
    <v-card-text>
      <div class="title mt-0 mb-4">
        {{ $t('lesson.detail.info.title') }}
      </div>
      <v-row>
        <v-col cols="6" v-for="(item, index) in _profile" :key="index">
          <ProfileItem
            :icon="item.icon"
            :title="item.title"
            :description="item.description"
            :isList="item?.isList"
            :link="item?.link"
            :isLinks="item.isLinks"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" v-for="(item, index) in students" :key="index">
          <ProfileCardItem
            :icon="item.icon"
            :title="item.title"
            :description="item.description"
            :color="item.color"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <LoadingOverlay :loading="store.isFetching" />
  </v-card>
</template>

<style scoped lang="scss">
.title {
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  color: $color-text-black;
}
</style>
