<script setup lang="ts">
import { LoadingOverlay } from '.';

withDefaults(
  defineProps<{
    isEmpty?: boolean;
    height?: number | string;
    loading?: boolean;
    isBorderAll?: boolean;
  }>(),
  {
    isEmpty: false,
  },
);
</script>

<template>
  <v-table class="rounded-0" :class="{ 'border-all': isBorderAll }" fixed-header>
    <thead>
      <slot name="thead"></slot>
    </thead>
    <tbody>
      <slot name="tbody"></slot>
      <tr v-if="isEmpty && !loading" class="cursor-default">
        <td class="text-center ws-nowrap" colspan="100%">
          {{ $t('common.noDataText') }}
        </td>
      </tr>
      <LoadingOverlay :loading="loading" />
    </tbody>
  </v-table>
</template>

<style scoped lang="scss">
:deep(.v-table__wrapper) {
  height: calc(100vh - $offset-table-height-in-list);
  tr,
  th,
  td {
    border-collapse: collapse;
    border-color: #00000014;

  }

  th {
    background-color: #f3f4f8 !important;
  }
  tr {
    &:hover {
      background-color: #f4f7ff;
    }
    &.clickable {
      cursor: pointer;
    }
    &.selected {
      background-color: #f4f7ff;
    }
  }

  &::-webkit-scrollbar {
    visibility: hidden;
    background-color: #fff;
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    visibility: hidden;
    background-color: $color-neutral-6;
    border-radius: 6px;
  }

  &:hover::-webkit-scrollbar-thumb {
    visibility: visible;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
}
</style>
