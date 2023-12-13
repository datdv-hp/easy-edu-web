<script lang="ts" setup>
import { useElementBounding, useElementSize } from '@vueuse/core';
import { ref } from 'vue';

interface Props {
  text?: string;
  location?: any;
}
withDefaults(defineProps<Props>(), {
  location: 'top left',
});

const tableDataRef = ref<HTMLTableCellElement | null>(null);
const textRef = ref<HTMLSpanElement | null>(null);
const { height: tableDataHeight } = useElementSize(tableDataRef);
const { height: textHeight } = useElementBounding(textRef);
</script>
<template>
  <td>
    <span ref="tableDataRef" class="ellipsis-one-line">
      <span ref="textRef">{{ text }}</span>
      <v-tooltip
        :text="text"
        activator="parent"
        :open-delay="150"
        :location="location"
        v-if="textHeight > tableDataHeight"
      />
    </span>
  </td>
</template>
<style lang="scss" scoped></style>
