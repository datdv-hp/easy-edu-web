<script lang="ts" setup>
import { CollapseList } from '@/components';
interface Props {
  title: string;
  data?: any[];
}
defineProps<Props>();
</script>
<template>
  <div>{{ title }}</div>
  <div v-if="data?.length" class="text-left mt-4">
    <CollapseList :items="data || []" :visible="5">
      <template #item="{ item }: { item: any }">
        <li class="item">{{ item.name }}</li>
      </template>
    </CollapseList>
  </div>
</template>
<style lang="scss" scoped>
.item {
  max-width: 480px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
