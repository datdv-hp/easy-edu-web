<script lang="ts" setup>
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import { computed } from 'vue';
import { useUserDialog, useUserStore } from '../../stores';
import { ProfileType, Role } from '@/common/constants';
import StudentFormDialog from './components/StudentFormDialog.vue';
import ManagerFormDialog from './components/ManagerFormDialog.vue';
import TeacherFormDialog from './components/TeacherFormDialog.vue';
import TeacherProfile from './components/TeacherProfile.vue';
import ManagerProfile from './components/ManagerProfile.vue';
import StudentProfile from './components/StudentProfile.vue';
import { type Component } from 'vue';
import icons from '@/assets/icons';
import { useRole } from '@/common/stores/role.store';
import MasterProfile from './components/MasterProfile.vue';

const store = useUserStore();
const dialogStore = useUserDialog();
const role = useRole();

const ProfileComponent = computed(() => {
  if (store.profile?.userRole === Role.MASTER) {
    return MasterProfile;
  }
  switch (store.profile?.type) {
    case ProfileType.STUDENT:
      return StudentProfile;
    case ProfileType.TEACHER:
      return TeacherProfile;
    case ProfileType.NONE:
      return ManagerProfile;
    default:
      return ManagerProfile;
  }
});

const ProfileDialogComponent = computed<Component | undefined>(() => {
  switch (store.profile?.type) {
    case ProfileType.STUDENT:
      return StudentFormDialog;
    case ProfileType.TEACHER:
      return TeacherFormDialog;
    case ProfileType.NONE:
      return ManagerFormDialog;
    default:
      return undefined;
  }
});
</script>

<template>
  <HeaderBar :isHideBack="true">
    <template #title>{{ $t('auth.userProfile.profile.title') }}</template>
    <template #append v-if="role?.user?.update">
      <BaseButton v-if="!store.isMaster" size="extra-small" @click="dialogStore.open()">
        <v-img width="16" :src="icons.editWhite" class="mr-1" />
        <span>{{ $t('common.button.edit') }}</span>
      </BaseButton>
      <component :is="ProfileDialogComponent" v-if="dialogStore.isOpen" />
    </template>
  </HeaderBar>

  <v-window>
    <component :is="ProfileComponent" />
  </v-window>
</template>

<style lang="scss" scoped>
.v-tab {
  text-align: center;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: 0;
  text-transform: none;
}

.custom-tabs {
  margin: 0 30px 0px 30px;

  .v-tab:not(.v-tab--selected) {
    color: #5a5c6f;
  }
}

:deep(.v-toolbar__extension) {
  height: 39px;
}

:deep(.v-slide-group) {
  --v-tabs-height: 39px !important;
}
</style>
