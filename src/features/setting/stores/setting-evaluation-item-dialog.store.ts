import { IBodyResponse } from '@/common/interfaces';
import { defineStore } from 'pinia';
import { computed } from 'vue';
import { ref } from 'vue';
import { IEvaluationItem } from '../interfaces/setting-evaluation.interfaces';
import { settingEvaluationApiService } from '../services/settingEvaluation.api';

export const useSettingEvaluationItemDialog = defineStore(
  'setting-evaluation-item-dialog',
  () => {
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

    async function getDetail() {
      isFetching.value = true;
      const response: IBodyResponse<IEvaluationItem> =
        await settingEvaluationApiService.getEvaluationDetail(currentId.value);
      if (!response.success) {
        isFetching.value = false;
        return response;
      }
      isFetching.value = false;
      return response;
    }

    return {
      isOpen,
      isFetching,
      isSubmitting,
      currentId,
      isUpdate,
      initValue,
      open,
      close,
      getDetail,
    };
  },
);
