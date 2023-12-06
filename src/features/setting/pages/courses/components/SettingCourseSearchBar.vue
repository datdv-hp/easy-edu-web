<script lang="ts" setup>
import { SearchForm } from '@/components';
import { useSettingCourseStore } from '@/features/setting/stores/settingCourse.store';
import { useForm } from 'vee-validate';
import { onBeforeUnmount, onMounted } from 'vue';

const store = useSettingCourseStore();

const { handleSubmit, setFieldValue } = useForm();

onMounted(async () => {
  setFieldValue('keyword', store.courseTypeListQuery?.keyword);
});

onBeforeUnmount(() => {
  store.setInputSearch(undefined);
});

const submit = handleSubmit(async (values) => {
  store.courseTypeListQuery.keyword = values.keyword?.trim();
  setFieldValue('keyword', store.courseTypeListQuery.keyword);
  await store.getList();
});
</script>

<template>
  <SearchForm @submit="submit()"> </SearchForm>
</template>

<style lang="scss" scoped></style>
