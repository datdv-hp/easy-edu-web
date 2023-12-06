<script setup lang="ts">
import { useCourseDetail } from '@/features/courses/store';
import { LoadingOverlay, ProfileItem } from '@/components';
import Icons from '@/assets/icons';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ProfileCardItem from '@/components/ProfileCardItem.vue';
import { useRole } from '@/common/stores/role.store';

const store = useCourseDetail();
const role = useRole();
const { t } = useI18n();

const _profile = computed(() => {
  if (!store?.detail) return [];
  const profile = [
    {
      icon: Icons.keyIcon,
      title: t('courses.detail.info.id'),
      description: store.detail?.code || '',
      isShow: true,
    },
    {
      icon: Icons.screen,
      title: t('courses.detail.info.typeCourse'),
      description: store.detail?.courseFormNames.join(', ') || '',
      isShow: true,
    },
    {
      icon: Icons.description,
      title: t('courses.detail.info.name'),
      description: store.detail?.name || '',
      isShow: true,
    },
    {
      icon: Icons.description,
      title: t('courses.detail.info.time'),
      description: store.detail?.times || '',
      isShow: true,
    },
    {
      icon: Icons.description,
      title: t('courses.detail.info.description'),
      description: store.detail?.description || '',
      isShow: true,
    },
    {
      icon: Icons.userWhite,
      title: t('courses.detail.info.numberOfStudents'),
      description: `${store.detail?.totalStudents || 0}`,
      isShow: true,
      color: 'primary',
    },
    {
      icon: Icons.classWhite,
      title: t('courses.detail.info.numberOfClassrooms'),
      description: `${store.detail?.totalClasses || 0}`,
      isShow: true,
      color: 'info',
    },
    {
      icon: Icons.classWhite,
      title: t('courses.detail.info.numberOfOngoingClassrooms'),
      description: `${store.detail?.activeClasses || 0}`,
      isShow: true,
      color: 'success',
    },
    {
      icon: Icons.classWhite,
      title: t('courses.detail.info.numberOfCompletedClassrooms'),
      description: `${store.detail?.endedClasses || 0}`,
      isShow: true,
      color: 'error',
    },
  ];
  return profile.filter((item) => item.isShow);
});
</script>

<template>
  <v-card>
    <v-card-text>
      <div class="profile-title mt-0 mb-4">
        {{ $t('courses.detail.info.title') }}
      </div>
      <v-row>
        <v-col cols="8">
          <v-row>
            <v-col cols="6" v-for="(item, index) in _profile.slice(0, 4)" :key="index">
              <ProfileItem
                :icon="item.icon"
                :title="item.title"
                :description="item.description"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4">
          <v-row>
            <v-col cols="12" v-for="(item, index) in _profile.slice(4, 5)" :key="index">
              <ProfileItem
                :icon="item.icon"
                :title="item.title"
                :description="item.description"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-if="role.course?.detailStatistics">
        <v-col cols="6" lg="3" v-for="(item, index) in _profile.slice(5)" :key="index">
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
.name {
  text-transform: uppercase;
  color: $color-text-black;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
}
</style>
