<script setup lang="ts">
import icons from '@/assets/icons';
import { TableBase } from '@/components';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { checkOverlapTimes } from '../helpers';
import { useLessonStore } from '../stores';
import LessonPreviewItem from './LessonPreviewItem.vue';
const store = useLessonStore();

withDefaults(
  defineProps<{
    isValidPreview?: boolean;
  }>(),
  {
    isValidPreview: false,
  },
);
const { t } = useI18n();
const lessonName = (index: number) => {
  const name = store.lessonName;
  if (name) {
    return store.previewTimes?.length > 1 ? `${name} - ${index + 1}` : name;
  }
};
const isRemoved = (index: number) => {
  return store.removedPreviewTimeIndexes.includes(index);
};
const removeLesson = (index: number) => {
  const removedItem = store.previewTimes[index];
  const timeItems = store.previewTimes.filter((_, index) => !isRemoved(index));
  if (timeItems.length <= 1 && !isRemoved(index)) return;
  removedItem.error = undefined;
  store.removedPreviewTime(index);
  // check overlapping lesson time
  const listOverLap = checkOverlapTimes(
    store.previewTimes,
    store.removedPreviewTimeIndexes,
  );
  store.setErrorOverlapPreviewTimes(
    listOverLap,
    t('lesson.form.message.overlapTimeError'),
  );
};

const onlyOneItem = computed(() => {
  return store.previewTimes?.length === 1;
});
</script>

<template>
  <div v-if="!isValidPreview" class="preview-container preview-no-content">
    <div>
      <v-img class="mx-auto" :src="icons.lessonNote" width="80"></v-img>
      <p class="mt-6 fw-500 text--neutral-2">
        {{ $t('lesson.previewTitle') }}
      </p>
    </div>
  </div>
  <div v-else class="preview-container">
    <TableBase :is-empty="!store.previewTimes?.length">
      <template #thead>
        <tr>
          <th>{{ $t('lesson.table.index') }}</th>
          <th>{{ $t('lesson.table.name') }}</th>
          <th>{{ $t('lesson.table.time') }}</th>
          <th v-if="!onlyOneItem"></th>
        </tr>
      </template>
      <template #tbody>
        <tr
          v-for="(item, index) in store.previewTimes"
          :key="index"
          class="cursor-default"
          :class="{
            'remove-row': isRemoved(index),
          }"
        >
          <td class="cell-preview">{{ index + 1 }}</td>
          <td class="cell-preview">
            <v-tooltip
              :text="lessonName(index)"
              location="top left"
              v-if="!!lessonName(index)"
            >
              <template v-slot:activator="{ props }">
                <span v-bind="props" class="ellipsis-one-line minW-150px">{{
                  lessonName(index)
                }}</span>
              </template>
            </v-tooltip>
          </td>
          <td class="cell-preview">
            <LessonPreviewItem :item="item" />
          </td>
          <td v-if="!onlyOneItem" class="cell-action">
            <v-tooltip
              :text="isRemoved(index) ? $t('lesson.form.undo') : $t('lesson.form.remove')"
              location="top"
            >
              <template v-slot:activator="{ props }">
                <v-img
                  v-if="!isRemoved(index)"
                  width="32"
                  v-bind="props"
                  :src="icons.deleteIcon"
                  class="pa-2 cursor-pointer"
                  @click="() => removeLesson(index)"
                />
                <v-icon
                  v-if="isRemoved(index)"
                  icon="mdi-reload"
                  width="16"
                  v-bind="props"
                  class="pa-2 mr-2 cursor-pointer"
                  @click="() => removeLesson(index)"
                ></v-icon>
              </template>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </TableBase>
  </div>
</template>

<style scoped lang="scss">
:deep(.v-table__wrapper) {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  height: unset;
  min-height: 400px;
  max-height: 958px;
}
.preview-no-content {
  min-height: 416px;
  display: flex;
  padding: 24px 20px;
  align-items: center;
  justify-content: center;
}

.preview-container {
  background: $color-white;
  border-radius: 6px;
}

.cell-preview {
  vertical-align: top;
  padding-top: 16px !important;
}
.remove-row {
  text-decoration: line-through;
}
.cell-action {
  text-align: center;
  color: #464962;
}
</style>
