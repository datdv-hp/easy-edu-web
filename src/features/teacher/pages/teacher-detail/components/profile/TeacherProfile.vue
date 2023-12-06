<script setup lang="ts">
import Icons from '@/assets/icons';
import { Gender, UserStatus } from '@/common/constants';
import {
  LoadingOverlay,
  ProfileAvatar,
  ProfileEmail,
  ProfileItemInfo,
} from '@/components';
import ProfileItemCard from '@/components/ProfileItemCard.vue';
import { useTeacherStore } from '@/features/teacher/stores';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const store = useTeacherStore();
const { t } = useI18n();
const emit = defineEmits(['resent-email']);
const isResending = ref(false);

const email = computed(() => ({
  icon: Icons.email,
  title: t('common.profile.email'),
  description: store.profile?.email,
  isVerified: store?.profile?.status === UserStatus.ACTIVE,
  isShow: !!store.profile?.email,
}));
const code = computed(() => ({
  icon: Icons.keyIcon,
  title: t('teacher.detail.info.basic.code'),
  description: store.profile?.code,
  isShow: !!store.profile?.code,
}));
const _profile = computed(() => {
  const profile = [
    {
      icon: Icons.dob,
      title: t('common.profile.dob'),
      description: store.profile?.dob,
      isShow: !!store.profile?.dob,
    },
    {
      icon: Icons.phone,
      title: t('common.profile.phone'),
      description: store.profile?.phone,
      isShow: !!store.profile?.phone,
    },

    {
      icon: Icons.date,
      title: t('common.profile.signingDate'),
      description: `${t('common.profile.signingDate')}: ${store.profile?.teacherDetail
        ?.signedContractDate}`,
      isShow: !!store.profile?.teacherDetail?.signedContractDate,
    },
    {
      icon: Icons.identity,
      title: t('common.profile.identity'),
      description: store.profile?.teacherDetail?.identity,

      isShow: !!store.profile?.teacherDetail?.identity,
    },
    {
      icon: Icons.nationality,
      title: t('common.profile.nationality'),
      description: store.profile?.teacherDetail?.nationality,
      isShow: !!store.profile?.teacherDetail?.nationality,
    },
    {
      icon:
        store.profile?.gender === Gender.FEMALE
          ? Icons.woman
          : store.profile?.gender === Gender.MALE
            ? Icons.man
            : Icons.other,
      title: t('common.profile.gender'),
      description: store.profile?.gender
        ? t('app.gender.' + store.profile?.gender?.toLocaleLowerCase())
        : '',
      isShow: !!store.profile?.gender,
    },
  ].filter((item) => item.isShow);
  return profile;
});

const _profileDetail = computed(() => {
  const profile = [
    {
      icon: Icons.degreeSpecial,
      title: t('teacher.detail.info.basic.academicLevel'),
      description: store.profile?.teacherDetail?.degree,
      isShow: !!store.profile?.teacherDetail?.degree,
    },
    {
      icon: Icons.subjectSpecial,
      title: t('teacher.detail.info.basic.teachingSubjects'),
      description: (
        store.profile?.teacherDetail?.subjects?.map((subject) => subject.name) || []
      ).join(', '),
      isShow: !!store.profile?.teacherDetail?.subjects?.length,
    },
    {
      icon: Icons.descriptionSpecial,
      title: t('teacher.detail.info.basic.note'),
      description: store.profile?.teacherDetail?.note,
      isShow: !!store.profile?.teacherDetail?.note,
    },
    {
      icon: Icons.descriptionSpecial,
      title: t('teacher.detail.info.basic.role'),
      description: store.profile?.role?.name,
      isShow: !!store.profile?.role?.name,
    },
  ].filter((item) => item.isShow);
  return profile;
});

const handleResendEmail = async () => {
  isResending.value = true;
  await store.resendEmail();
  isResending.value = false;
  emit('resent-email');
};
</script>

<template>
  <v-card class="ma-4 pa-0">
    <v-card-text class="pa-8 d-flex align-center">
      <ProfileAvatar
        class="profile-avatar"
        :avatar="store.profile?.avatar"
        :name="store.profile?.name"
      />
      <div class="profile-content">
        <span class="profile-name">{{ store.profile?.name }} </span>
        <v-row>
          <v-col cols="6" class="py-0 mb-3" v-if="code?.isShow">
            <ProfileItemInfo :icon="code.icon" :title="code.description as string" />
          </v-col>
          <v-col cols="6" class="py-0 mb-3" v-if="email?.isShow">
            <ProfileEmail
              v-if="email?.isShow"
              :icon="email.icon"
              :title="email.description"
              :is-verified="email.isVerified"
              @resend="handleResendEmail"
            />
          </v-col>
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
    <v-card-text class="pa-8 pt-0 d-flex align-center" v-if="_profileDetail?.length">
      <ProfileItemCard :items="_profileDetail" />
    </v-card-text>
    <LoadingOverlay :loading="store.isFetching" />
  </v-card>
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
