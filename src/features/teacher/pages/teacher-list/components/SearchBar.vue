<script lang="ts" setup>
import { SearchForm } from '@/components';
import { useTeacherStore } from '@/features/teacher/stores';
import { useForm } from 'vee-validate';
import { onMounted } from 'vue';

const store = useTeacherStore();
const { handleSubmit, setFieldValue } = useForm();

const submit = handleSubmit(async (values) => {
  store.setKeyword(values.keyword?.trim());
  setFieldValue('keyword', store.listQuery.keyword);
  await store.getList();
});

onMounted(async () => {
  setFieldValue('keyword', store.listQuery.keyword);
});
</script>

<template>
  <SearchForm @submit="submit()"> </SearchForm>
</template>

<style lang="scss" scoped></style>
