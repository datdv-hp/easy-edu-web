<script setup lang="ts">
import { BaseIconButton } from '@/components';
import { InputText } from '@/components';
import { computed } from 'vue';

const props = defineProps<{
  name: string;
  index: number;
  label: string;
  placeholder?: string;
  isAbleAddItem?: boolean;
}>();

const emit = defineEmits<{
  (event: 'clickBtnAction', index: number): void;
}>();

const isFirst = (index: number) => {
  return index === 0;
};
const btnIcon = computed(() => (index: number) => {
  if (isFirst(index) && props.isAbleAddItem) {
    return 'mdi-plus-circle';
  }
  return 'mdi-close-circle';
});

const onClickButtonAction = (index: number) => {
  emit('clickBtnAction', index);
};
</script>

<template>
  <div class="d-flex align-end gap-4">
    <InputText
      :name="name"
      :label="index === 0 ? label : undefined"
      :placeholder="placeholder"
    />
    <BaseIconButton
      :icon="btnIcon(index)"
      @click="onClickButtonAction(index)"
      size="medium"
      :state="isFirst(index) && isAbleAddItem ? 'default' : 'error'"
      variant="secondary"
    />
  </div>
</template>
