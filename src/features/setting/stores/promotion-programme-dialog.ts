import { defineStore } from 'pinia';
import { computed } from 'vue';
import { ref } from 'vue';

export const usePromotionProgrammeDialog = defineStore(
    'promotion-programme-dialog',
    () => {
        const _isOpen = ref<boolean>(false);
        const _isFetching = ref<boolean>(false);
        const _isSubmitting = ref<boolean>(false);
        const _currentId = ref<string>('');

        // Getter
        const isUpdate = computed(() => !!_currentId.value);
        const isOpen = computed(() => _isOpen.value);
        const isFetching = computed(() => _isFetching.value);
        const isSubmitting = computed(() => _isSubmitting.value);
        const currentId = computed(() => _currentId.value);

        // Setter
        function open(id = '') {
            _currentId.value = id;
            _isOpen.value = true;
        }
        function close() {
            _isOpen.value = false;
            _currentId.value = '';
            _isFetching.value = false;
            _isSubmitting.value = false;
        }
        function setIsFetching(value: boolean) {
            _isFetching.value = value;
        }
        function setIsSubmitting(value: boolean) {
            _isSubmitting.value = value;
        }

        return {
            isOpen,
            isFetching,
            isSubmitting,
            currentId,
            isUpdate,
            open,
            close,
            setIsFetching,
            setIsSubmitting,
        };
    },
);
