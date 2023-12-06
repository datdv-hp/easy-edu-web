<script lang="ts" setup>
import { useStudentStore } from '@/features/student/stores';
import { BaseAutoComplete, SearchForm } from '@/components';
import { useForm } from 'vee-validate';
import { onMounted } from 'vue';

const store = useStudentStore();
const { handleSubmit, setFieldValue } = useForm();

onMounted(async () => {
  await store.getCourseOptions();
  setFieldValue('keyword', store.studentListQuery.keyword);
  setFieldValue('courseIds', store.studentListQuery.courseIds);
});

const submit = handleSubmit(async (values) => {
  store.studentListQuery.keyword = values.keyword?.trim();
  setFieldValue('keyword', store.studentListQuery.keyword);
  store.studentListQuery.courseIds = values.courseIds;
  store.getList();
});
</script>

<template>
  <SearchForm @submit="submit()">
    <v-sheet width="300" class="ml-3 rounded--2">
      <BaseAutoComplete
        name="courseIds"
        multiple
        :placeholder="$t('student.course')"
        :items="store.courses"
        @keydown.enter="submit"
      />
    </v-sheet>
  </SearchForm>
</template>

<style lang="scss" scoped></style>
