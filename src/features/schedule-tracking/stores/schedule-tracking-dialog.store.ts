import { defineStore } from 'pinia';
import { computed } from 'vue';
import { ref } from 'vue';

export const useSCheduleTrackingDialog = defineStore('schedule-tracking-dialog', () => {
  const isOpen = ref<boolean>(false);
  const isFetching = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const currentId = ref<string>('');

  function open(id: string) {
    currentId.value = id;
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
    currentId.value = '';
    isFetching.value = false;
    isSubmitting.value = false;
  }

  const isViewSchedule = computed(() => !!currentId.value);

  return {
    isOpen,
    open,
    close,
    isFetching,
    isSubmitting,
    currentId,
    isViewSchedule,
  };
});
