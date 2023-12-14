<script setup lang="ts">
import { ref } from 'vue';
import SearchInput from './SearchInput.vue';
import { BaseButton } from '.';
import { FilterResult } from '@/common/interfaces';
import FilterResults from './FilterResults.vue';

interface Props {
  hideSearch?: boolean;
  hideSearchBtn?: boolean;
  isUseFilter?: boolean;
  isApplyFilter?: boolean;
  title?: string;
  filterResults?: FilterResult[];
}
withDefaults(defineProps<Props>(), {
  hideSearch: false,
  hideSearchBtn: false,
  isUseFilter: false,
});
const emit = defineEmits(['submit', 'click:outside', 'deleteFilter', 'delete:filter-result']);
const isOpen = ref(false);
const onSubmit = () => {
  emit('submit');
};
function onClickOutside() {
  emit('click:outside');
}
</script>

<template>
  <div>
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
      <v-spacer />
      <v-menu
        v-if="isUseFilter"
        v-model="isOpen"
        :offset="10"
        :close-on-back="true"
        :close-on-content-click="false"
        location="bottom right"
        @click:outside="onClickOutside"
        :eager="true"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="outlined"
            class="filter-btn"
            :height="48"
            :icon="isApplyFilter ? '$custom.filter-tick' : '$custom.filter'"
          />
        </template>
        <v-card>
          <template v-slot:append>
            <div class="delete-all" @click="emit('deleteFilter')">
              {{ $t('common.filter.deleteAll') }}
            </div>
          </template>
          <template v-slot:title>
            <slot name="title">
              <span class="menu-title">{{ title || $t('common.filter.title') }}</span>
            </slot>
          </template>
          <v-card-text class="pa-6">
            <slot name="filters"></slot>
          </v-card-text>
          <v-card-actions class="justify-end pa-3 actions">
            <BaseButton size="extra-small" @click.stop="onSubmit">
              {{ $t('common.button.apply') }}
            </BaseButton>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
    <div class="px-4 pb-4 mt-n2" v-if="filterResults?.length">
      <FilterResults
        :filters="filterResults"
        @remove="(field: string) => emit('delete:filter-result', field)"
        @remove-all="emit('delete:filter-result')"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.v-overlay__content) {
  border-radius: 12px !important;
}

:deep(.v-card-item) {
  padding: 14px 24px !important;
  border-bottom: 1px solid $color-border !important;
}
.menu-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 28px;
  color: $color-text-black;
}
.delete-all {
  color: $color-primary-1;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  &:hover {
    opacity: 0.8;
  }
}
.actions {
  box-shadow: 0px -2px 4px rgba(22, 1, 1, 0.06);
}

.filter-btn {
  border-radius: 6px;
  background-color: $color-white;
  color: $color-neutral-3;
  border-color: $color-neutral-6;
  :deep(.v-btn__overlay) {
    display: none;
  }
  &:hover,
  &:deep(.v-btn--active) {
    border-color: $color-neutral-5;
    background-color: $color-white;
  }
}
</style>
