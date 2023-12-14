<script setup lang="ts">
import AvatarDefault from '@/assets/images/avatar-default.png';
import { useRole } from '@/common/stores';
import { useAuthStore, useUserStore } from '@/features/auth/stores';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import UserChangePassword from './UserChangePassword.vue';
import { PageName } from '@/common/constants';

withDefaults(
  defineProps<{
    avatarSize?: number;
    location?: any;
  }>(),
  {
    avatarSize: 40,
    location: 'bottom',
  },
);
const user = useUserStore();
const { t } = useI18n();
const authStore = useAuthStore();
const role = useRole();

const avatarUrl = computed(() => {
  return user.profile?.avatar || AvatarDefault;
});

const menu = computed(() => {
  const list = [
    {
      title: t('app.sidebar.menu.profile'),
      routeName: PageName.PROFILE_PAGE,
      icon: '$user.profile',
      isShow: true,
    },
    {
      title: t('app.sidebar.menu.resetPassword'),
      icon: '$user.key',
      click: () => {
        user.isShowDialogChangePassword = true;
      },
      isShow: role.user?.changePassword,
    },
    {
      title: t('app.sidebar.menu.logout'),
      click: async () => await authStore.logoutAction(),
      icon: '$user.logout',
      isShow: true,
    },
  ];
  return list.filter((item) => item.isShow);
});
</script>
<template>
  <div>
    <v-menu :location="location">
      <template v-slot:activator="{ props }">
        <v-list-item
          class="h-100"
          v-bind="props"
          density="compact"
          color="primary"
          :prepend-avatar="avatarUrl"
          :title="user.profile?.name"
          :subtitle="user.profile?.email"
        />
      </template>

      <v-list density="compact">
        <v-list-item
          v-for="(menuItem, index) in menu"
          :key="index"
          density="compact"
          color="primary"
          :value="menuItem.title"
          :title="menuItem.title"
          :prepend-icon="menuItem.icon"
          :to="menuItem.routeName ? { name: menuItem.routeName } : undefined"
          @click.stop="menuItem.click ? menuItem.click() : undefined"
        />
      </v-list>
    </v-menu>
    <UserChangePassword v-if="user.isShowDialogChangePassword" />
  </div>
</template>

<style lang="scss" scoped></style>
