<script lang="ts" setup>
import { useLessonStore } from '@/features/lesson/stores';
import { BaseAutoComplete, MultiSelect } from '@/components';
import { onMounted } from 'vue';
import { LessonStatus } from '@/features/lesson/constants';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { SearchForm } from '@/components';

const { t } = useI18n();
const store = useLessonStore();
const { handleSubmit, values: lessonFilter, setFieldValue } = useForm();

const submit = handleSubmit(async () => {
  store.setQuery(lessonFilter);
  store.lessonListQuery.keyword = lessonFilter.keyword?.trim();
  setFieldValue('keyword', store.lessonListQuery.keyword);
  await store.getList();
});

const statusOptions = computed(() =>
  Object.values(LessonStatus).map((status) => ({
    title: t(`lesson.status.${status.toLowerCase()}`),
    value: status,
  })),
);

onMounted(async () => {
  await store.getClassroomOptions();
  setFieldValue('keyword', store.lessonListQuery.keyword);
  setFieldValue('statuses', store.lessonListQuery.statuses);
  setFieldValue('classroomIds', store.lessonListQuery.classroomIds);
});
</script>

<template>
  <SearchForm @submit="submit()">
    <div class="filter filter-classroom mx-3" style="width: 240px">
      <BaseAutoComplete
        name="classroomIds"
        :placeholder="$t('lesson.filter.classroom')"
        :items="store.classroomOptions"
        multiple
        clearable
        @keydown.enter="submit"
      />
    </div>
    <div class="filter filter-status" style="width: 240px">
      <MultiSelect
        name="statuses"
        :placeholder="$t('lesson.filter.status')"
        :items="statusOptions"
        clearable
        @keydown.enter="submit"
      />
    </div>
  </SearchForm>
</template>

<style lang="scss" scoped>
.filter {
  min-width: 140px;
}

.filter-course,
.filter-classroom {
  width: 30%;
}
.filter-status {
  width: 20%;
}
</style>
