<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import InputRadio from './InputRadio.vue';
import { computed } from 'vue';
import { Gender } from '@/common/constants';

type Props = {
  isRequired?: boolean;
  name?: string;
};

const { t } = useI18n();
const genderOptions = computed(() => {
  const options = Object.values(Gender).map((_gender) => ({
    title: t(`app.gender.${_gender.toLowerCase()}`),
    value: _gender,
  }));
  return options;
});

withDefaults(defineProps<Props>(), {
  isRequired: true,
  name: 'gender',
});
</script>

<template>
  <InputRadio
    :name="name"
    :label="t('app.gender.label')"
    :items="genderOptions"
    :is-required="isRequired"
    density="compact"
  />
</template>

<style scoped lang="scss">
:deep(.v-label) {
  opacity: 1;
}
:deep(.v-input__control .v-selection-control-group) {
  margin-inline-start: -4px;
  gap: 24px;
}
:deep(.v-selection-control) {
  gap: 8px;
}
</style>
