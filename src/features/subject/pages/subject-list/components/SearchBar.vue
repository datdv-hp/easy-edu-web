<script lang="ts" setup>
import { useSubjectStore } from '@/features/subject/store';
import { SearchForm } from '@/components';
import { useForm } from 'vee-validate';
import { onMounted, onUnmounted } from 'vue';

const store = useSubjectStore();

const { handleSubmit, setFieldValue } = useForm();

onMounted(() => {
  setFieldValue('keyword', store.subjectListQuery.keyword);
});

onUnmounted(() => {
  store.setInputSearch(undefined);
});

const submit = handleSubmit(async (values) => {
  store.subjectListQuery.keyword = values.keyword?.trim();
  setFieldValue('keyword', store.subjectListQuery.keyword);
  await store.getList();
});
</script>

<template>
  <SearchForm @submit="submit()" />
</template>

<style lang="scss" scoped></style>
