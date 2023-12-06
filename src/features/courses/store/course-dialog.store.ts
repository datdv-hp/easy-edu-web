import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCourseDialog = defineStore('couse-dialog', () => {
  const isOpen = ref<boolean>(false);
  const isFetching = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const currentId = ref<string>('');
  const subjects = ref<string[]>([]);
  subjects.value = ['Javascript', 'NestJs', 'Python', 'Java', 'C++'];

  function open(id = '') {
    currentId.value = id;
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
    currentId.value = '';
    isFetching.value = false;
    isSubmitting.value = false;
  }

  return {
    isOpen,
    isFetching,
    isSubmitting,
    currentId,
    subjects,
    open,
    close,
  };
});
