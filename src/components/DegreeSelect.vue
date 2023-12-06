<script setup lang="ts">
import { Degree, StudentDegree, TeacherDegree } from '@/common/constants';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SingleSelect from './base/SingleSelect.vue';

type Props = {
  name?: string;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  degree: typeof Degree | typeof TeacherDegree | typeof StudentDegree;
};

const { t } = useI18n();

const props = withDefaults(defineProps<Props>(), {
  name: 'degree',
  degree: () => Degree,
});

const options = computed(() => {
  const options = Object.values(props.degree).map((item) => ({
    title: t(`common.degree.${item.toLowerCase()}`),
    value: item,
  }));
  return options;
});

const _label = computed(() => {
  return props.label || t('common.degree.label');
});

const _placeholder = computed(() => {
  return props.placeholder || t('common.degree.placeholder');
});
</script>

<template>
  <SingleSelect
    :name="name"
    :items="options"
    :label="_label"
    :placeholder="_placeholder"
    clearable
    :is-required="isRequired"
  ></SingleSelect>
</template>

<style scoped lang="scss"></style>
