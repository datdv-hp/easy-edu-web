import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useClassroomDialog = defineStore('classroom-dialog', () => {
  const isOpen = ref<boolean>(false);
  const isFetching = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const currentId = ref<string>('');

  function open(id = '') {
    currentId.value = id;
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
    currentId.value = '';
    isSubmitting.value = false;
    isFetching.value = false;
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
