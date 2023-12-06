<script setup lang="ts">
import SearchInput from './SearchInput.vue';

withDefaults(defineProps<{ hideSearch?: boolean; hideSearchBtn?: boolean }>(), {
  hideSearch: false,
  hideSearchBtn: false,
});
const emit = defineEmits(['submit']);

const onSubmit = () => {
  emit('submit');
};
</script>

<template>
  <div class="d-flex pa-4 align-center w-100">
    <SearchInput v-if="!hideSearch" @enter="onSubmit" />
    <slot></slot>
    <v-btn
      v-if="!hideSearchBtn"
      class="text-none ms-3"
      variant="flat"
      color="primary"
      height="40"
      :text="$t('common.search')"
      @click="onSubmit"
    />
  </div>
</template>

<style scoped lang="scss"></style>
