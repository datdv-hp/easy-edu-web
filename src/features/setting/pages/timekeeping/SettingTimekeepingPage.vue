<script setup lang="ts">
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { BaseButton } from '@/components';
import SettingTimekeepingDetail from './components/SettingTimekeepingDetail.vue';
import { ref } from 'vue';
import { computed } from 'vue';

const refElement = ref();
const isSave = ref<boolean>(false);
const isCancel = ref<boolean>(false);

const isEditing = computed(() => (refElement.value as any)?.isEditing);

const handleCancel = () => {
  isCancel.value = true;
};
const handleSave = () => {
  isSave.value = true;
};

const reset = () => {
  isSave.value = false;
  isCancel.value = false;
};
</script>
<template>
  <header-bar
    :title="$t('settings.timekeepingTitle')"
    :has-extension="false"
    :isHideBack="true"
  >
    <template #append>
      <BaseButton
        v-if="isEditing"
        class="mr-3"
        size="extra-small"
        variant="outline"
        @click="handleCancel"
      >
        <span>{{ $t('common.button.cancel') }}</span>
      </BaseButton>
      <BaseButton
        size="extra-small"
        variant="solid"
        :is-disabled="!isEditing"
        @click="handleSave"
      >
        <span>{{ $t('common.button.save') }}</span>
      </BaseButton>
    </template>
  </header-bar>
  <SettingTimekeepingDetail
    ref="refElement"
    :isCancel="isCancel"
    :isSave="isSave"
    @save-done="reset()"
  />
</template>
