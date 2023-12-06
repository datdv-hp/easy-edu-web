<script lang="ts" setup>
import { BaseAutoComplete, SearchForm } from '@/components';
import { commonApiService } from '@/features/common/services/common.api';
import { convertCourseTypeOptions } from '@/features/courses/helpers';
import { useCoursesStore } from '@/features/courses/store';
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';
import { onMounted } from 'vue';

const store = useCoursesStore();
const courseTypesDropdown = ref<{ title: string; value: string }[]>([]);

onMounted(async () => {
  const res = await commonApiService._getCourseTypeDropdown();
  if (res?.success) {
    courseTypesDropdown.value = convertCourseTypeOptions(res.data);
  }
  setFieldValue('keyword', store.courseListQuery.keyword);
});

const { handleSubmit, setFieldValue } = useForm();
useField<string[]>('type');

const submit = handleSubmit(async (values) => {
  store.courseListQuery.keyword = values.keyword?.trim();
  setFieldValue('keyword', store.courseListQuery.keyword);
  store.courseListQuery.courseFormIds = values?.courseType;
  store.getList();
});
</script>

<template>
  <SearchForm @submit="submit()">
    <div class="ml-3" style="width: 300px">
      <BaseAutoComplete
        name="courseType"
        :items="courseTypesDropdown"
        :placeholder="$t('courses.list.state')"
        @enter="submit"
        @keydown.enter="submit"
        clearable
        multiple
      />
    </div>
  </SearchForm>
</template>

<style lang="scss" scoped></style>
