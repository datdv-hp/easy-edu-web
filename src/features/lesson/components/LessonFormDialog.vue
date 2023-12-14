<script lang="ts" setup>
import { BaseDialog } from '@/components';
import { useLessonDialog, useLessonStore } from '@/features/lesson/stores';
import { computed, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import LessonForm from './LessonForm.vue';
import LessonPreview from './LessonPreview.vue';

const lessonFormRef = ref<any>();

const emit = defineEmits<{
  (event: 'update', values: Record<string, unknown>): void;
  (event: 'update-not-existed'): void;
  (event: 'createSuccess'): void;
}>();

const { t } = useI18n();
const store = useLessonStore();
const dialogStore = useLessonDialog();
const isPreview = ref(false);

const formTitle = computed(() =>
  dialogStore.isUpdate ? t(`lesson.form.title.edit`) : t(`lesson.form.title.create`),
);

const onCloseDialog = () => {
  dialogStore.close();
  // reset store
  store.resetRemovedPreviewTimeIndexes();
};

const handleClickPreview = () => {
  isPreview.value = true;
};

function submit() {
  if (dialogStore.isUpdate) {
    lessonFormRef.value?.handleClickUpdate();
    return;
  }
  lessonFormRef.value?.handleCreate();
}

const isValidSubmit = computed(() => {
  return lessonFormRef.value?.isValidSubmit;
});

const updateLesson = (data: Record<string, unknown>) => {
  emit('update', data);
};

const updateNotExisted = () => {
  emit('update-not-existed');
};

const createSuccess = () => {
  emit('createSuccess');
};

onBeforeUnmount(() => {
  store.resetSelected();
});
</script>

<template>
  <BaseDialog
    @close="onCloseDialog"
    :overlay="dialogStore.isFetching"
    :loading="dialogStore.isSubmitting"
    :disabled="!isValidSubmit || !!store.errorPreviewTimeIndexes?.length"
    :title="formTitle"
    content-class="bg-color-1 pl-4 pr-4 pb-4 pt-4"
    :max-width="!dialogStore.isUpdate && isPreview ? 1800 : 1000"
    @submit="submit"
  >
    <v-row class="mt-n0_5">
      <v-col>
        <LessonForm
          ref="lessonFormRef"
          @preview="handleClickPreview"
          @update="updateLesson"
          @update-not-existed="updateNotExisted"
          @create-success="createSuccess"
        />
      </v-col>
      <v-col v-show="!dialogStore.isUpdate && isPreview" cols="5" class="ps-1 pe-1">
        <LessonPreview :is-valid-preview="isPreview" />
      </v-col>
    </v-row>
  </BaseDialog>
</template>
<style lang="scss" scoped>
:deep(.selection-role .v-input__control) {
  width: 100%;

  .v-selection-control-group {
    gap: 20px;
  }

  .v-label {
    opacity: 1;
  }
}

.mt-n0_5 {
  margin-top: -14px;
}
</style>
