import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStudentDialog = defineStore('student-dialog', () => {
  const isOpen = ref<boolean>(false);
  const isFetching = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const currentId = ref<string>();

  function open(id?: string) {
    currentId.value = id;
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
    currentId.value = undefined;
    isFetching.value = false;
    isSubmitting.value = false;
  }

  return {
    isOpen,
    open,
    close,
    isFetching,
    isSubmitting,
    currentId,
  };
});
