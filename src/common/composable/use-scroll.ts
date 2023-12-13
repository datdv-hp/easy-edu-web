import { Ref, onMounted, ref } from 'vue';
import { useScroll } from '@vueuse/core';

export function useScrolling(_ref: Ref, className: string) {
    const instance = ref<HTMLElement | null>(null);
    onMounted(() => {
        if (_ref.value) {
            instance.value = _ref.value.$el.getElementsByClassName(
                className,
            )?.[0] as HTMLElement;
        }
    });
    const scroll = useScroll(instance);
    return scroll;
}
