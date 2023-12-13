<script lang="ts" setup>
type Props = {
  icon: string;
  tooltipText?: string;
  size?: number;
};

defineProps<Props>();
</script>
<template>
  <div>
    <v-hover>
      <template #default="{ isHovering, props }">
        <v-icon :size="size" v-bind="props" class="action-icon" :icon="icon" />
        <v-tooltip
          :model-value="isHovering && !!tooltipText"
          location="top center"
          activator="parent"
          :text="tooltipText"
          open-delay="200"
        />
      </template>
    </v-hover>
  </div>
</template>
<style lang="scss" scoped>
.action-icon {
  &:hover {
    cursor: pointer;
    color: $color-primary-1;
    transform: scale(1.1);
    transition: all 0.2s linear;
  }
}
</style>
