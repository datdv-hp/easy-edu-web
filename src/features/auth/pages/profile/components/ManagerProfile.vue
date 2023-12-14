<script setup lang="ts">
import { ProfileAvatar, ProfileItemInfo } from '@/components';
import Icons from '@/assets/icons';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/features/auth/stores';
import { IManager } from '@/features/manager/interfaces';
import { Gender } from '@/common/constants';

const store = useUserStore();

const { t } = useI18n();

const user = computed(() => {
  return (store.profile || {}) as IManager;
});

const profile = computed(() => {
  const _profile = [
    {
      icon: Icons.email,
      title: t('common.profile.email'),
      description: user.value?.email,
      isShow: user.value.email ? true : false,
    },
    {
      icon: Icons.dob,
      title: t('common.profile.dob'),
      description: user.value?.dob,
      isShow: user.value?.dob ? true : false,
    },
    {
      icon: Icons.phone,
      title: t('common.profile.phone'),
      description: user.value?.phone,
      isShow: user.value?.phone ? true : false,
    },
    {
      icon: Icons.date,
      title: t('common.profile.signingDate'),
      description: user.value?.managerDetail?.signedContractDate,
      isShow: user.value?.managerDetail?.signedContractDate ? true : false,
    },
    {
      icon:
        user.value?.gender === Gender.FEMALE
          ? Icons.woman
          : user.value?.gender === Gender.MALE
            ? Icons.man
            : Icons.other,
      title: t('common.profile.gender'),
      description: user.value?.gender
        ? t('app.gender.' + user.value?.gender?.toLocaleLowerCase())
        : '',
      isShow: user.value?.gender ? true : false,
    },
  ].filter((item) => item.isShow);
  return _profile;
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
