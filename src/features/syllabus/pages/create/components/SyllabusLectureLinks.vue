<script lang="ts" setup>
import { BaseIconButton, InputText } from '@/components';
import { MAX_NUMBER_OF_LINKS_PER_LECTURE } from '@/features/syllabus/constants';
import { useField } from 'vee-validate';
import { computed } from 'vue';
interface Props {
  name: string;
}

const props = defineProps<Props>();

const { value: linksValue } = useField<string[]>(props.name);

const isFirstItem = (index: number) => {
  return index === 0;
};

const isAbleAddLinks = computed(
  () => linksValue.value?.length < MAX_NUMBER_OF_LINKS_PER_LECTURE,
);

const clickAction = (index: number) => {
  if (isFirstItem(index) && isAbleAddLinks.value) {
    linksValue.value?.push('');
  } else {
    linksValue.value?.splice(index, 1);
  }
};

const getIcon = (index: number) => {
  if (isFirstItem(index) && isAbleAddLinks.value) {
    return 'mdi-plus-circle';
  }
  return 'mdi-close-circle';
};

const getStateIcon = (index: number) => {
  if (isFirstItem(index) && isAbleAddLinks.value) {
    return 'default';
  }
  return 'error';
};
</script>

<template>
  <div
    v-for="(_, index) in linksValue"
    :key="index"
    class="d-flex align-start syllabus-lecture-link"
  >
    <InputText
      :name="`${props.name}[${index}]`"
      :label="isFirstItem(index) ? $t('syllabus.form.lectureLink.label') : ''"
      :placeholder="$t('syllabus.form.lectureLink.placeholder')"
    />
    <BaseIconButton
      :class="{ 'mt-6': isFirstItem(index), 'ml-1': true }"
      :icon="getIcon(index)"
      size="medium"
      variant="secondary"
      :state="getStateIcon(index)"
      @click="() => clickAction(index)"
    />
  </div>
</template>

<style scoped lang="scss">
.syllabus-lecture-link {
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
