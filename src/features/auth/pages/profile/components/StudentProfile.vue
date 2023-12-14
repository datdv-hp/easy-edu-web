<script setup lang="ts">
import Icons from '@/assets/icons';
import { Gender } from '@/common/constants';
import { ProfileAvatar, ProfileItemCard, ProfileItemInfo } from '@/components';
import { useUserStore } from '@/features/auth/stores';
import { IStudent } from '@/features/student/interfaces';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const store = useUserStore();
const { t } = useI18n();

const user = computed(() => {
  return (store.profile || {}) as IStudent;
});

const profile = computed(() => {
  const _profile = [
    {
      icon: Icons.keyIcon,
      description: user.value.code,
      isShow: user.value.code ? true : false,
    },
    {
      icon: Icons.email,
      description: user.value.email,
      isShow: true,
    },
    {
      icon: Icons.dob,
      description: user.value.dob,
      isShow: user.value.dob ? true : false,
    },
    {
      icon: Icons.phone,
      description: user.value.phone,
      isShow: user.value.phone ? true : false,
    },
    {
      icon:
        user.value?.gender === Gender.FEMALE
          ? Icons.woman
          : user.value?.gender === Gender.MALE
            ? Icons.man
            : Icons.other,
      description: user.value.gender
        ? t('app.gender.' + user.value.gender?.toLowerCase())
        : '',
      isShow: user.value.gender ? true : false,
    },
    {
      icon: Icons.level,
      description: t(`common.degree.${user.value.studentDetail?.degree?.toLowerCase()}`),
      isShow: user.value.studentDetail?.degree ? true : false,
    },
  ].filter((item) => item.isShow);
  return _profile;
});

const course = computed(() => {
  const _course = [
    {
      icon: Icons.subjects,
      title: t('common.profile.course'),
      description: user.value?.courses?.join(', '),
      isShow: user.value?.courses?.length ? true : false,
    },
  ].filter((item) => item.isShow);
  return _course;
});
</script>

<template>
  <v-window-item :value="1">
    <v-card class="ma-4 pa-0">
      <v-card-text class="pa-8 d-flex align-center">
        <ProfileAvatar class="profile-avatar" :avatar="user.avatar" :name="user.name" />
        <div class="profile-content">
          <span class="profile-name">{{ user.name }} </span>
          <v-row>
            <v-col
              cols="6"
              class="py-0 mb-3"
              v-for="(item, index) in profile"
              :key="index"
            >
              <ProfileItemInfo :icon="item.icon" :title="item.description || ''" />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-card-text class="pa-8 pt-0 d-flex align-center" v-if="course?.length">
        <ProfileItemCard :items="course" />
      </v-card-text>
    </v-card>
  </v-window-item>
</template>

<style scoped lang="scss">
.profile-avatar {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile-name {
  display: block;
  text-transform: uppercase;
  color: $color-text-black;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  margin-bottom: 20px;
  min-width: 500px;
}
</style>
