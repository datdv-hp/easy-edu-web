import { defineStore } from 'pinia';
import { computed } from 'vue';
import { ref } from 'vue';

export const useSettingCourseDialog = defineStore('setting-course-dialog', () => {
  const isOpen = ref<boolean>(false);
  const isFetching = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const currentId = ref<string>('');
  const initValue = ref();

  function open(id = '', formValue = {}) {
    currentId.value = id;
    isOpen.value = true;
    initValue.value = formValue;
  }

  function close() {
    isOpen.value = false;
    currentId.value = '';
    initValue.value = undefined;
    isFetching.value = false;
    isSubmitting.value = false;
  }

  const isUpdate = computed(() => !!currentId.value);

  return {
    isOpen,
    open,
    close,
    isFetching,
    isSubmitting,
    currentId,
    isUpdate,
    initValue,
  };
});
