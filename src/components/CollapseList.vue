<script lang="ts" setup>
import { computed, ref } from 'vue';

interface Props {
  items: any[];
  visible?: number;
  collapseText?: string;
  showAllText?: string;
}
const props = withDefaults(defineProps<Props>(), {
  visible: 5,
  isShowAll: false,
});
const isShowAll = ref(false);

const showList = computed(() => {
  return isShowAll.value ? props.items : props.items.slice(0, props.visible);
});

const isShowToggleText = computed(() => props.visible < props.items.length);

const onClickToggle = () => {
  isShowAll.value = !isShowAll.value;
};
</script>
<template>
  <div v-for="(item, index) in showList" :key="index">
    <slot name="item" :item="item" :index="index"></slot>
  </div>
  <span v-if="isShowToggleText" class="toggle-text" @click="onClickToggle">
    {{
      isShowAll
        ? collapseText || $t('common.toggle.collapse')
        : showAllText || $t('common.toggle.show')
    }}
  </span>
</template>
<style lang="scss" scoped>
.toggle-text {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: $color-primary-1;
  cursor: pointer;
}
</style>
