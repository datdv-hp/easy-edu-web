import { defineStore } from 'pinia';
import { computed } from 'vue';
import { ref } from 'vue';

export const useReasonDialog = defineStore('reason-dialog', () => {
  const isOpen = ref<boolean>(false);
  const isFetching = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const studentId = ref<string>();
  const reason = ref<string>();

  function open(_studentId?: string) {
    studentId.value = _studentId;
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
    studentId.value = undefined;
    isFetching.value = false;
    isSubmitting.value = false;
  }

  const isProcessLeave = computed(() => !!studentId.value);

  return {
    isOpen,
    open,
    close,
    isFetching,
    isSubmitting,
    studentId,
    isProcessLeave,
    reason,
  };
});
