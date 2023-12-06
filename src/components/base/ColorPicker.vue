<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed } from 'vue';

interface Props {
  name: string;
  label?: string;
  items: string[];
  isRequired?: boolean;
  validateOnUpdate?: boolean;
  defaultSelect?: any;
}

const props = withDefaults(defineProps<Props>(), {
  isRequired: false,
  color: 'primary',
  validateOnUpdate: true,
});
const emit = defineEmits(['change']);
const { value: color, setValue: setColor } = useField<string | undefined>(
  props.name,
  undefined,
  {
    initialValue: props.items?.[0],
  },
);

const handleChooseColor = (_color: string) => {
  if (_color === color.value) return;
  setColor(_color);
  emit('change', _color);
};

const isChosenColor = computed(() => (_color: string) => {
  return color.value == _color;
});
</script>

<template>
  <div class="color-wrapper">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="color-item"
      :class="{ shadow: isChosenColor(item) }"
      :style="{ backgroundColor: item }"
      @click="handleChooseColor(item)"
    >
      <v-icon v-show="isChosenColor(item)" color="white" size="14" icon="mdi-check" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.color-wrapper {
  display: flex;
  gap: 20px;
  align-items: center;
  .color-item {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;

    &:hover,
    &.shadow {
      box-shadow: 0px 0px 8px 0px #00000057;
    }
  }
}
</style>
