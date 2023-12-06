<script lang="ts" setup>
import { SearchForm, SingleSelect } from '@/components';
import { useManagerStore } from '@/features/manager/stores';
import { useField, useForm } from 'vee-validate';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const store = useManagerStore();

const { handleSubmit, setFieldValue } = useForm();
useField<boolean | string>('isTeacher', undefined, {
  initialValue: 'all',
});

onMounted(() => {
  if (typeof store.managerListQuery.isTeacher === 'boolean') {
    setFieldValue('isTeacher', store.managerListQuery?.isTeacher as boolean);
  }
  setFieldValue('keyword', store.managerListQuery?.keyword);
});

const submit = handleSubmit(async (values) => {
  store.managerListQuery.keyword = values.keyword?.trim();
  setFieldValue('keyword', store.managerListQuery.keyword);
  if (values.isTeacher === 'all') {
    store.managerListQuery.isTeacher = undefined;
  } else {
    store.managerListQuery.isTeacher = values.isTeacher;
  }
  await store.getList();
});

const { t } = useI18n();

const options = computed(() => {
  return [
    {
      value: 'all',
      title: t('manager.searchOptions.all'),
    },
    {
      value: true,
      title: t('manager.searchOptions.isTeacher'),
    },
    {
      value: false,
      title: t('manager.searchOptions.notTeacher'),
    },
  ];
});
</script>

<template>
  <SearchForm @submit="submit()">
    <v-sheet width="300" class="ml-3 rounded--2">
      <SingleSelect
        name="isTeacher"
        :placeholder="$t('teacher.subject')"
        :items="options"
        @keydown.enter="submit"
      />
    </v-sheet>
  </SearchForm>
</template>

<style lang="scss" scoped></style>
