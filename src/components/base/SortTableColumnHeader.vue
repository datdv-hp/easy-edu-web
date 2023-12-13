<script lang="ts" setup>
import { computed } from 'vue';
import { OrderDirection } from '@/common/constants';
import icons from '@/assets/icons';
import { getToggleOrderDirection } from '@/common/helpers';

interface Props {
  title: string;
  name: string;
  width?: string;
  direction?: OrderDirection | string;
  orderBy?: string;
  maxWidth?: string;
  minWidth?: string;
}
const props = defineProps<Props>();
const emit = defineEmits(['change']);

const iconDESC = computed(() => {
  if (props.direction === OrderDirection.ASC && props.name === props.orderBy) {
    return icons.sortDownActive;
  }
  if (props.direction === OrderDirection.DESC && props.name === props.orderBy) {
    return icons.sortUpActive;
  }
  return icons.sortDown;
});

const onToggleOrderDirection = () => {
  const orderDirection = getToggleOrderDirection(props.direction);
  emit('change', { field: props.name, direction: orderDirection });
};
</script>
<template>
  <th
    class="cursor-pointer"
    @click="onToggleOrderDirection"
    :style="{
      width,
      maxWidth,
      minWidth,
    }"
  >
    <div class="d-flex align-center gap-2">
      <span class="text-left ws-nowrap">{{ title }}</span>
      <div class="oder-direction-icon">
        <v-img width="8" class="order-direction desc" :src="iconDESC"></v-img>
      </div>
    </div>
  </th>
</template>
<style lang="scss" scoped>
.order-direction {
  cursor: pointer;
}
.oder-direction-icon {
  margin-top: 2px;
}
</style>
