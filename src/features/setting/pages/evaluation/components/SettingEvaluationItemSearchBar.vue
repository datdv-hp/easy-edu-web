<script lang="ts" setup>
import { BaseAutoComplete, SearchForm, SingleSelect } from '@/components';
import { StatusEvaluationCriteriaType } from '@/features/setting/constant';
import { useSettingEvaluationItemStore } from '@/features/setting/stores/settingEvaluationItem.store';
import { useForm } from 'vee-validate';
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const store = useSettingEvaluationItemStore();

const { handleSubmit, setFieldValue } = useForm();

onMounted(async () => {
  await store.getCoursesOptions();
  setFieldValue('keyword', store.evaluationItemQuery?.keyword);
  !store.evaluationItemQuery?.status
    ? setFieldValue('status', 0)
    : setFieldValue('status', store.evaluationItemQuery?.status);
  !store.evaluationItemQuery?.courseIds
    ? setFieldValue('courseIds', undefined)
    : setFieldValue('courseIds', store.evaluationItemQuery?.courseIds);
});

const submit = handleSubmit(async (values) => {
  store.evaluationItemQuery.keyword = values.keyword?.trim();
  setFieldValue('keyword', store.evaluationItemQuery.keyword);
  if (values.status === 0) {
    store.evaluationItemQuery.status = undefined;
  } else {
    store.evaluationItemQuery.status = values.status;
  }
  if (!values.courseIds?.length) {
    store.evaluationItemQuery.courseIds = undefined;
  } else {
    store.evaluationItemQuery.courseIds = values.courseIds;
  }
  await store.getList();
});

const { t } = useI18n();

const statusOptions = computed(() => {
  return [
    {
      value: 0,
      title: t('settings.evaluationItem.statusOptions.all'),
    },
    {
      value: StatusEvaluationCriteriaType.FOLLOWING,
      title: t('settings.evaluationItem.statusOptions.isStatus'),
    },
    {
      value: StatusEvaluationCriteriaType.UN_FOLLOWING,
      title: t('settings.evaluationItem.statusOptions.isNotStatus'),
    },
  ];
});

onBeforeUnmount(() => {
  store.setInputSearch(undefined);
  store.evaluationItemQuery.courseIds = undefined;
  store.evaluationItemQuery.status = undefined;
});
</script>

<template>
  <SearchForm @submit="submit()">
    <v-sheet class="d-flex ml-3 rounded--2" width="240">
      <SingleSelect
        :menu-width="'240'"
        class="search-bar__status"
        name="status"
        :items="statusOptions"
        @keydown.enter="submit"
      />
    </v-sheet>
    <v-sheet class="d-flex ml-3 rounded--2" width="300">
      <BaseAutoComplete
        :menu-width="'300'"
        class="search-bar__course"
        :placeholder="$t('student.course')"
        name="courseIds"
        :items="store.coursesOptions"
        :multiple="true"
        @keydown.enter="submit"
      />
    </v-sheet>
  </SearchForm>
</template>

<style lang="scss" scoped>
.search-bar__status {
  min-width: 240px;
}

.search-bar__course {
  min-width: 300px;
}
</style>
