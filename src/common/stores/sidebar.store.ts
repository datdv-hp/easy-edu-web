import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar-store', () => {
  const rail = ref<boolean>(false);

  const setRail = (value: boolean) => {
    rail.value = value;
  };
  return {
    rail,
    setRail,
  };
});
