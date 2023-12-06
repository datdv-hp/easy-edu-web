<script lang="ts" setup>
import { SearchForm } from '@/components';
import { useSettingEvaluationStore } from '@/features/setting/stores/settingEvaluation.store';
import { useForm } from 'vee-validate';
import { onBeforeUnmount, onMounted } from 'vue';

const store = useSettingEvaluationStore();

const { handleSubmit, setFieldValue } = useForm();

onMounted(async () => {
  setFieldValue('keyword', store.evaluationTypeListQuery?.keyword);
});

onBeforeUnmount(() => {
  store.setInputSearch(undefined);
});

const submit = handleSubmit(async (values) => {
  store.evaluationTypeListQuery.keyword = values.keyword?.trim();
  setFieldValue('keyword', store.evaluationTypeListQuery.keyword);
  await store.getList();
});
</script>

<template>
  <SearchForm @submit="submit()"> </SearchForm>
</template>

<style lang="scss" scoped></style>
