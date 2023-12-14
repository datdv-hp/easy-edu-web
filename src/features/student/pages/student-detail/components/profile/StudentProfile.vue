<script setup lang="ts">
import Icons from '@/assets/icons';
import { Gender, UserStatus } from '@/common/constants';
import {
  LoadingOverlay,
  ProfileAvatar,
  ProfileEmail,
  ProfileItemCard,
  ProfileItemInfo,
} from '@/components';
import { useStudentStore } from '@/features/student/stores';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const store = useStudentStore();
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
  title: t('common.profile.code.student'),
  description: store.profile?.code,
  isShow: !!store.profile?.code,
}));
const profile = computed(() => {
  const _profile = [
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
    {
      icon: Icons.level,
      title: t('student.detail.info.basic.academicLevel'),
      description: store.profile?.studentDetail?.degree
        ? t('common.degree.' + store.profile?.studentDetail?.degree?.toLocaleLowerCase())
        : ' ',
      isShow: !!store.profile?.studentDetail?.degree,
    },
  ].filter((item) => item.isShow);
  return _profile;
});

const course = computed(() => {
  const _course = [
    {
      icon: Icons.subjects,
      title: t('common.profile.course') as string,
      description: store.profile?.courses?.join(', '),
      isShow: !!store.profile?.courses?.length,
    },
    {
      icon: Icons.descriptionSpecial,
      title: t('student.detail.info.basic.role'),
      description: store.profile?.role?.name,
      isShow: !!store.profile?.role?.name,
    },
  ].filter((item) => item.isShow);
  return _course;
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
          <v-col cols="6" class="py-0 mb-3" v-for="(item, index) in profile" :key="index">
            <ProfileItemInfo
              v-if="item.isShow"
              :icon="item.icon"
              :title="item.description as string"
            />
          </v-col>
        </v-row>
      </div>
    </v-card-text>
    <v-card-text class="pa-8 pt-0 d-flex align-center" v-if="course?.length">
      <ProfileItemCard :items="course" />
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
