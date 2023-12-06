<script lang="ts" setup>
import { CollapseList } from '@/components';
import { ISyllabusLectureListItem } from '@/features/syllabus/interfaces';
interface Props {
  lectures?: ISyllabusLectureListItem[];
}
defineProps<Props>();
</script>
<template>
  <div>
    {{ $t('syllabus.delete.lecture.confirmText', { total: lectures?.length || 0 }) }}
  </div>
  <div v-if="lectures?.length" class="text-left mt-2">
    <CollapseList :items="lectures || []" :visible="5">
      <template #item="{ item }: { item: ISyllabusLectureListItem }">
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
