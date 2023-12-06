<script lang="ts" setup>
import { useField } from 'vee-validate';

const props = withDefaults(
  defineProps<{
    width?: string | number;
    name?: string;
    minWidth?: string | number;
    maxWidth?: string | number;
  }>(),
  {
    width: 336,
    name: 'keyword',
  },
);

const emit = defineEmits(['update:modelValue', 'enter']);
const { value } = useField(props.name);

const filter = (evt: KeyboardEvent) => {
  if (!evt.target) return;
  const input = evt.target as HTMLInputElement;
  const cursorPosition = input.selectionStart;
  if (cursorPosition === 0 && evt.key === ' ') {
    evt.preventDefault();
  } else {
    return true;
  }
};

const updateValue = (val) => {
  emit('update:modelValue', val);
};

const onEnter = () => {
  emit('enter', value.value);
};
</script>

<template>
  <v-sheet :width="width" :max-width="maxWidth" :min-width="minWidth">
    <v-text-field
      :placeholder="$t('common.search')"
      type="input"
      density="compact"
      bg-color="#ffffff"
      variant="outlined"
      color="primary"
      v-model="value"
      clearable
      @update:model-value="updateValue"
      @keydown.enter="onEnter"
      hide-details
      :maxLength="255"
      prepend-inner-icon="mdi-magnify"
      @keypress="(evt: KeyboardEvent) => filter(evt)"
    ></v-text-field>
  </v-sheet>
</template>

<style lang="scss" scoped></style>
