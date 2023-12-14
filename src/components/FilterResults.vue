<script lang="ts" setup>
import { FilterResult } from '@/common/interfaces';

type Props = {
  filters: FilterResult[];
};
defineProps<Props>();
const emit = defineEmits(['remove', 'remove-all']);
</script>
<template>
  <div class="filter-result">
    <div class="wrapper" v-for="filter in filters" :key="filter.field">
      <v-tooltip
        v-if="filter.text"
        open-delay="350"
        :text="filter.text"
        location="top center"
      >
        <template #activator="{ props }">
          <div v-bind="props" class="text">{{ filter.text }}</div>
        </template>
      </v-tooltip>
      <v-tooltip
        v-if="filter.text"
        open-delay="150"
        :text="$t('common.filter.delete')"
        location="top center"
      >
        <template #activator="{ props }">
          <v-icon
            v-bind="props"
            class="icon"
            @click="emit('remove', filter.field)"
            icon="mdi-close"
          />
        </template>
      </v-tooltip>
    </div>
    <span v-if="filters?.length" class="delete-all" @click="emit('remove-all')">
      {{ $t('common.filter.deleteAll') }}
    </span>
  </div>
</template>
<style lang="scss" scoped>
.filter-result {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.wrapper {
  display: inline-flex;
  padding: 4px 6px;
  align-items: center;
  justify-content: center;
  background-color: $color-white;
  border: 1px solid $color-neutral-6;
  border-radius: 6px;
  font-size: 12px;
}
.text {
  line-height: 18px;
  color: $color-text-black;
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
  margin-right: 4px;
}
.icon {
  height: 12px !important;
  color: $color-neutral-3;
  cursor: pointer;
  &:hover {
    color: $color-text-black;
    opacity: 0.8;
  }
}
.delete-all {
  font-weight: 500;
  font-size: 12px;
  color: $color-state-error;
  line-height: 12px;
  opacity: 0.8;
  &:hover {
    cursor: pointer;
    opacity: 1;
    text-decoration: underline;
  }
}
</style>
