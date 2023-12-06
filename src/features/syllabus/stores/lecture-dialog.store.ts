import { defineStore } from 'pinia';
import { computed } from 'vue';
import { ref } from 'vue';

export const useLectureDialog = defineStore('lecture-dialog', () => {
  const isOpen = ref<boolean>(false);
  const isFetching = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const currentIds = ref<string[]>([]);

  function open(ids = [] as string[]) {
    currentIds.value = ids;
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
    currentIds.value = [];
    isFetching.value = false;
    isSubmitting.value = false;
  }

  const isUpdate = computed(() => !!currentIds.value.length);

  return {
    isOpen,
    isFetching,
    isSubmitting,
    currentIds,
    open,
    close,
    isUpdate,
  };
});
