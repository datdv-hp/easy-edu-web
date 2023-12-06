<script lang="ts" setup>
import { CollapseList } from '@/components';
import { ISyllabusListItem } from '@/features/syllabus/interfaces';
interface Props {
  total?: number;
  isAssignedToClassroom?: boolean;
  syllabuses?: ISyllabusListItem[];
  withoutTotal?: boolean;
}
defineProps<Props>();
</script>
<template>
  <div v-if="isAssignedToClassroom">
    {{ $t('syllabus.delete.syllabus.assignedToClassroom') }}
  </div>
  <div v-if="withoutTotal">
    {{ $t('syllabus.delete.syllabus.confirmTextWithoutTotal') }}
  </div>
  <div v-else>{{ $t('syllabus.delete.syllabus.confirmText', { total }) }}</div>
  <div v-if="!withoutTotal" class="text-left mt-2">
    <CollapseList :items="syllabuses || []" :visible="5">
      <template #item="{ item }: { item: ISyllabusListItem }">
        <li class="item">{{ item.name }}</li>
      </template>
    </CollapseList>
  </div>
</template>
<style lang="scss" scoped>
.item {
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
