<script setup lang="ts">
import Icons from '@/assets/icons';
import { DATE_TIME_FORMAT } from '@/common/constants';
import { useRole } from '@/common/stores/role.store';
import { ProfileItem } from '@/components';
import ProfileCardItem from '@/components/ProfileCardItem.vue';
import { useClassroomStore } from '@/features/classroom/stores';
import dayjs from 'dayjs';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const store = useClassroomStore();
const role = useRole();
const { t } = useI18n();

const profile = computed(() => {
  if (!store.detail) return [];
  const _profile = [
    {
      icon: Icons.keyIcon,
      title: t('classroom.detail.info.id'),
      description: store.detail?.code || '',
      isShow: true,
    },
    {
      icon: Icons.description,
      title: t('classroom.detail.info.name'),
      description: store.detail?.name || '',
      isShow: true,
    },
    {
      icon: Icons.description,
      title: t('classroom.detail.info.course'),
      description: store.detail?.course?.name || '',
      isShow: true,
    },
    {
      icon: Icons.date,
      title: t('classroom.detail.info.startDate'),
      description: store.detail?.startDate
        ? dayjs(store.detail?.startDate).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN)
        : '',
      isShow: true,
    },
    {
      icon: Icons.date,
      title: t('classroom.detail.info.endDate'),
      description: store.detail?.endDate
        ? dayjs(store.detail?.endDate).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN)
        : '',
      isShow: true,
    },
  ];
  return _profile.filter((item) => item.isShow);
});

const cardInfo = computed(() => {
  if (!store.detail) return [];
  return [
    {
      icon: Icons.userWhite,
      title: t('classroom.detail.info.totalSutdents'),
      description: `${store.detail?.participants?.length || 0}`,
      isShow: true,
      color: 'primary',
    },
    {
      icon: Icons.calenderWhite,
      title: t('classroom.detail.info.totalLessons'),
      description: store.detail?.totalLesson || 0,
      isShow: true,
      color: 'info',
    },
    {
      icon: Icons.calenderWhite,
      title: t('classroom.detail.info.numberOfRemainLessons'),
      description:
        ((store.detail?.totalLesson || 0) as number) -
        ((store.detail?.countFinishedLesson || 0) as number) -
        ((store.detail?.countInProgressLesson || 0) as number),
      isShow: true,
      color: 'warning',
    },

    {
      icon: Icons.calenderWhite,
      title: t('classroom.detail.info.numberOfFinishedLessons'),
      description: store.detail?.countFinishedLesson || 0,
      isShow: true,
      color: 'error',
    },
  ];
});
</script>

<template>
  <v-card class="mx-4 mt-4 detail-card-wrap">
    <v-card-text>
      <div class="profile-title mt-0 mb-4">
        {{ $t('classroom.detail.cardTitle') }}
      </div>
      <v-row>
        <v-col cols="4" v-for="(item, index) in profile" :key="index">
          <ProfileItem
            :icon="item.icon"
            :title="item.title"
            :description="item.description"
          />
        </v-col>
      </v-row>
      <v-row v-if="role.classroom?.detailStatistics">
        <v-col cols="6" lg="3" v-for="(item, index) in cardInfo" :key="index">
          <ProfileCardItem
            :icon="item.icon"
            :title="item.title"
            :description="item.description"
            :color="item.color"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.detail-card-wrap {
  min-height: 376px;
}

.name {
  text-transform: uppercase;
  color: $color-text-black;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
}
</style>
