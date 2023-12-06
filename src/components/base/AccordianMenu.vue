<script lang="ts" setup>
import { useField } from 'vee-validate';
import { ref, watch } from 'vue';

interface Props {
  modelValue?: any[];
  title: string;
  name: string;
  label?: string;
  items: any[];
  itemKey: string;
  itemLabel: string;
  validateOnUpdate?: boolean;
}

interface Emits {
  (e: 'update:modelValue', v: any[] | undefined): void;
}

const props = withDefaults(defineProps<Props>(), {
  itemKey: 'id',
  itemLabel: 'name',
  validateOnUpdate: true,
});
const value = ref<any[]>([]);

const emits = defineEmits<Emits>();
const { errorMessage, setValue } = useField(props.name, undefined, {
  validateOnValueUpdate: props.validateOnUpdate,
});
watch(value, (v) => {
  setValue(v);
  emits('update:modelValue', v);
});
</script>
<template>
  <v-expansion-panels variant="accordion">
    <v-expansion-panel elevation="0">
      <template v-slot:title>
        <span :class="{ 'error-title': !!errorMessage }">
          {{ title }}
        </span>
      </template>
      <template v-slot:text>
        <v-row>
          <v-col cols="6" v-for="(item, index) in items" :key="index">
            <v-checkbox
              density="compact"
              hide-details="auto"
              class="mb-0"
              v-model="value"
              :label="item[itemLabel]"
              :value="item"
            />
          </v-col>
        </v-row>
      </template>
      <span class="error-text" v-if="!!errorMessage">{{ errorMessage }}</span>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<style scoped lang="scss">
.error-text {
  color: rgb(234, 84, 85);
  font-size: 0.6rem;
  padding-left: 1rem;
}
.error-title {
  color: rgb(234, 84, 85);
}
</style>
