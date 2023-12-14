<script setup lang="ts">
import { ProfileAvatar, ProfileItemCard, ProfileItemInfo } from '@/components';
import Icons from '@/assets/icons';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/features/auth/stores';
import { ITeacher } from '@/features/teacher/interfaces';
import { Gender } from '@/common/constants';

const store = useUserStore();
const { t } = useI18n();

const user = computed(() => {
  return (store.profile || {}) as ITeacher;
});

const _profile = computed(() => {
  const profile = [
    {
      icon: Icons.keyIcon,
      description: user.value?.code,
      isShow: user.value?.code ? true : false,
    },
    {
      icon: Icons.email,
      description: user.value?.email,
      isShow: user.value?.email ? true : false,
    },
    {
      icon: Icons.dob,
      description: user.value?.dob,
      isShow: user.value?.dob ? true : false,
    },
    {
      icon: Icons.phone,
      description: user.value?.phone,
      isShow: user.value?.phone ? true : false,
    },
    {
      icon: Icons.date,
      description: `${t('common.profile.signingDate')}: ${user.value.teacherDetail
        ?.signedContractDate}`,
      isShow: user.value.teacherDetail?.signedContractDate ? true : false,
    },
    {
      icon: Icons.identity,
      description: user.value?.teacherDetail?.identity,

      isShow: user.value?.teacherDetail?.identity ? true : false,
    },
    {
      icon: Icons.nationality,
      description: user.value?.teacherDetail?.nationality,
      isShow: user.value?.teacherDetail?.nationality ? true : false,
    },
    {
      icon:
        user.value?.gender === Gender.FEMALE
          ? Icons.woman
          : user.value?.gender === Gender.MALE
            ? Icons.man
            : Icons.other,
      description: user.value?.gender
        ? t('app.gender.' + user.value.gender?.toLocaleLowerCase())
        : '',
      isShow: user.value?.gender ? true : false,
    },
  ].filter((item) => item.isShow);
  return profile;
});

const profileDetail = computed(() => {
  return [
    {
      icon: Icons.degreeSpecial,
      title: t('teacher.detail.info.basic.academicLevel'),
      description: user.value?.teacherDetail?.degree,
      isShow: user.value?.teacherDetail?.degree ? true : false,
    },
    {
      icon: Icons.subjectSpecial,
      title: t('teacher.detail.info.basic.teachingSubjects'),
      description: user.value?.teacherDetail?.subjects
        ?.map((subject) => subject.name)
        .join(', '),
      isShow: user.value?.teacherDetail?.subjects?.length ? true : false,
    },
    {
      icon: Icons.descriptionSpecial,
      title: t('teacher.detail.info.basic.note'),
      description: user.value?.teacherDetail?.note,
      isShow: user.value?.teacherDetail?.note ? true : false,
    },
  ].filter((item) => item.isShow);
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
              v-for="(item, index) in _profile"
              :key="index"
            >
              <ProfileItemInfo :icon="item.icon" :title="item.description as string" />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-card-text class="pa-8 pt-0 d-flex align-center" v-if="profileDetail?.length">
        <ProfileItemCard :items="profileDetail" />
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
