<script lang="ts" setup>
interface Props {
  icon?: string;
  wrapperClass?: string;
  size?: 'default' | 'small';
  bgColor?: string;
}
withDefaults(defineProps<Props>(), {
  size: 'default',
});
const emit = defineEmits<{
  (event: 'click'): void;
}>();
</script>
<template>
  <div
    class="icon-wrapper"
    :class="`size-${size} ${wrapperClass || ''}`"
    :style="{ backgroundColor: bgColor }"
    @click.stop="emit('click')"
  >
    <slot>
      <v-icon>
        <v-img :src="icon" :width="size === 'small' ? '20' : '24'" />
      </v-icon>
    </slot>
  </div>
</template>
<style lang="scss" scoped>
.icon-wrapper {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  &.size-default {
    height: 44px;
    width: 44px;
  }

  &.size-small {
    height: 32px;
    width: 32px;
  }
}
</style>
