<script lang="ts" setup>
interface Props {
  text?: string;
  location?: any;
}
withDefaults(defineProps<Props>(), {
  location: 'top left',
});
</script>
<template>
  <td>
    <v-tooltip :text="text" :open-delay="150" :location="location" v-if="!!text">
      <template v-slot:activator="{ props }">
        <span v-bind="props" class="ellipsis-one-line">{{ text }}</span>
      </template>
    </v-tooltip>
  </td>
</template>
<style lang="scss" scoped></style>
