import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IStudentRegistrationInfo } from '../interfaces';

export const useStudentDialog = defineStore('student-dialog', () => {
  const isOpen = ref<boolean>(false);
  const isFetching = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const currentId = ref<string>();
  const initialValues = ref<IStudentRegistrationInfo>();

  function open(id?: string, _initialValues?: IStudentRegistrationInfo) {
    currentId.value = id;
    isOpen.value = true;
    initialValues.value = _initialValues;
  }

  function close() {
    isOpen.value = false;
    currentId.value = undefined;
    isFetching.value = false;
    isSubmitting.value = false;
    initialValues.value = undefined;
  }

  return {
    isOpen,
    open,
    close,
    isFetching,
    isSubmitting,
    currentId,
    initialValues,
  };
});
