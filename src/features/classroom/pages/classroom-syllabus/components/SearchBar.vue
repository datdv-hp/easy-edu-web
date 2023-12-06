<script lang="ts" setup>
import { BaseButton, SearchInput } from '@/components';
import { useClassroomSyllabusStore } from '@/features/classroom/stores';
import { useForm } from 'vee-validate';
import { useRoute } from 'vue-router';

const store = useClassroomSyllabusStore();
const route = useRoute();

const { handleSubmit, setFieldValue } = useForm();

function toggleLayout() {
  store.toggleLayout();
}

const submit = handleSubmit(async (values) => {
  const trimKeyword = values.keyword?.trim();
  store.setKeyword(trimKeyword);
  setFieldValue('keyword', trimKeyword);
  store.getSyllabusList(route.params.id as string);
});
</script>

<template>
  <div class="d-flex align-center justify-space-between pa-4">
    <div class="d-flex align-center">
      <SearchInput @enter="submit" />
      <BaseButton
        :label="$t('common.search')"
        style="width: 136px"
        size="small"
        button-class="ml-3"
        @click="submit"
      />
    </div>
    <div>
      <v-btn-toggle
        :model-value="store.layout"
        class="toggle-layout"
        @update:model-value="toggleLayout"
        variant="outlined"
        mandatory
      >
        <v-btn
          class="toggle-button left"
          selected-class="selected"
          icon="$syllabus.grid-layout"
          value="grid"
          :ripple="false"
        ></v-btn>
        <v-btn
          class="toggle-button right"
          selected-class="selected"
          icon="$syllabus.table-layout"
          value="table"
          :ripple="false"
        ></v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toggle-layout {
  height: 40px !important;
  background-color: $color-primary-5;
  box-shadow: 0 0 0 1px $color-neutral-6 inset;
  border-radius: 6px;
  border-color: $color-neutral-6;
  .toggle-button {
    width: 40px !important;
    height: 40px !important;
    font-size: 14px;
    background-color: $color-primary-5;
    background-clip: padding-box;
    :deep(.v-btn__overlay) {
      display: none;
    }
    &.selected {
      background-color: $color-white;
      width: 41px !important;
      border: 1px solid $color-neutral-6;
      border-radius: 6px;
    }
  }
}
</style>
