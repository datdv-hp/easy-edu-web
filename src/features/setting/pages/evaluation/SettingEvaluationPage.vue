<script setup lang="ts">
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { ref } from 'vue';
import SettingEvaluationList from './components/SettingEvaluationList.vue';
import SettingEvaluationItem from './components/SettingEvaluationItem.vue';
import { useRole } from '@/common/stores/role.store';
import { computed } from 'vue';

const role = useRole();
const tab = ref(1);

const isShowTab = computed(
  () => role.evaluationClassifiedSetting?.view || role.evaluationCriteriaSetting?.view,
);
</script>
<template>
  <header-bar
    :title="$t('settings.evaluationTitle')"
    :has-extension="isShowTab"
    :isHideBack="true"
  >
    <template #extension v-if="isShowTab">
      <v-tabs class="custom-tabs" v-model="tab" color="#6D79E8" align-tabs="start">
        <v-tab v-if="role.evaluationClassifiedSetting?.view" :value="1">{{
          $t('settings.evaluationList.title')
        }}</v-tab>
        <v-tab v-if="role.evaluationCriteriaSetting?.view" :value="2">{{
          $t('settings.evaluationItem.title')
        }}</v-tab>
      </v-tabs>
    </template>
  </header-bar>
  <v-window v-model="tab" v-if="isShowTab">
    <v-window-item v-if="role.evaluationClassifiedSetting?.view" :value="1">
      <SettingEvaluationList />
    </v-window-item>
    <v-window-item v-if="role.evaluationCriteriaSetting?.view" :value="2">
      <SettingEvaluationItem />
    </v-window-item>
  </v-window>
</template>
