<script lang="ts" setup>
import { useClassroomStore } from '@/features/classroom/stores';
import { BaseAutoComplete, MultiSelect, SearchForm } from '@/components';
import { useForm } from 'vee-validate';
import { computed } from 'vue';
import { ClassroomStatus } from '@/features/classroom/contants';
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';

const { t } = useI18n();
const store = useClassroomStore();

onMounted(async () => {
  await store.getCoursesOptions();
  setFieldValue('keyword', store.classroomListQuery.keyword);
});

const { handleSubmit, setFieldValue } = useForm();

const statusOptionItems = computed(() => {
  return Object.values(ClassroomStatus).map((item) => ({
    title: t(`classroom.status.${item.toLowerCase()}`),
    value: item,
  }));
});

const submit = handleSubmit(async (values) => {
  store.classroomListQuery.keyword = values.keyword?.trim();
  setFieldValue('keyword', store.classroomListQuery.keyword);
  store.classroomListQuery.statuses = values.status;
  store.classroomListQuery.courseIds = values.course;
  await store.getList();
});
</script>

<template>
  <SearchForm @submit="submit()">
    <v-sheet width="220" class="ml-3 rounded--2">
      <BaseAutoComplete
        name="course"
        :placeholder="$t('classroom.table.course')"
        :items="store.coursesOptions"
        multiple
        @keydown.enter="submit"
      />
    </v-sheet>
    <v-sheet width="220" class="ml-3 rounded--2">
      <MultiSelect
        name="status"
        :placeholder="$t('classroom.table.status')"
        :items="statusOptionItems"
        @keydown.enter="submit"
        clearable
      />
    </v-sheet>
  </SearchForm>
</template>

<style lang="scss" scoped></style>
