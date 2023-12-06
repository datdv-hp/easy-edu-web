<script setup lang="ts">
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import SettingCourseOptions from './components/SettingCourseOptions.vue';
import { BaseButton } from '@/components';
import { useSettingCourseDialog } from '../../stores/setting-course-dialog.store';
import { useRole } from '@/common/stores/role.store';
import SettingCourseSearchBar from './components/SettingCourseSearchBar.vue';

const settingCourseDialog = useSettingCourseDialog();
const role = useRole();
</script>
<template>
  <header-bar
    :title="$t('settings.courseTitle')"
    :has-extension="false"
    :isHideBack="true"
  >
    <template #append>
      <BaseButton
        v-if="role.courseFormSetting?.create"
        :label="$t('common.button.create')"
        :size="'extra-small'"
        @click="settingCourseDialog.open()"
      />
    </template>
  </header-bar>
  <SettingCourseSearchBar />
  <SettingCourseOptions />
</template>
