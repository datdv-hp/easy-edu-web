import { defineStore } from 'pinia';
import { computed } from 'vue';
import { ref } from 'vue';

export const useSyllabusBasicInfoDialog = defineStore(
  'syllabus-basic-info-dialog',
  () => {
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

    const isUpdate = computed(() => !!currentId.value);

    return {
      isOpen,
      isFetching,
      isSubmitting,
      currentId,
      open,
      close,
      isUpdate,
    };
  },
);
