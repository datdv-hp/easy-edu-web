<script lang="ts" setup>
import { getFilterResult } from '@/common/helpers';
import { FilterResult, IFilterType, IOption } from '@/common/interfaces';
import { BaseAutoComplete, DatePicker, MultiSelect, SearchForm } from '@/components';
import { TuitionStatus } from '@/features/tuition-fee/constants';
import { useTuitionFeeStore } from '@/features/tuition-fee/stores';
import { cloneDeep, isEmpty } from 'lodash';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from '@/plugins/dayjs';

const store = useTuitionFeeStore();
const { t } = useI18n();
const { handleSubmit, setFieldValue, values: formValue, resetForm } = useForm();
const filterResults = ref<FilterResult[]>([]);
const TuitionStatusOptions = computed<IOption[]>(() => {
  return Object.values(TuitionStatus).map((status) => ({
    title: t(`tuitionFee.status.${status}`),
    value: status,
  }));
});
const filters = computed<IFilterType[]>(() => [
  { name: 'classroomIds', options: store.classroomOptions },
  { name: 'presenterIds', options: store.presenterOptions },
  { name: 'statuses', options: TuitionStatusOptions.value },
  { name: 'startAt', isDate: true },
  { name: 'endAt', isDate: true },
]);
onMounted(() => {
  store.getClassroomOptions();
  store.getPresenterOptions();
});

function handleUpdateFilterResult() {
  filterResults.value = getFilterResult(formValue, filters.value);
}

function handleRemoveFilter(field?: string, callList = false) {
  if (field) {
    setFieldValue(field, undefined);
  } else {
    resetForm();
  }
  callList ? submit() : handleUpdateFilterResult();
}

const submit = handleSubmit(async (values) => {
  const filter = cloneDeep(values);
  handleUpdateFilterResult();
  store.setQuery({
    ...filter,
    keyword: values.keyword?.trim(),
  });
  setFieldValue('keyword', store.listQuery.keyword);
  store.getList();
});

const isApplyFilter = computed(() =>
  Object.keys(formValue).some((key) => key !== 'keyword' && !isEmpty(formValue[key])),
);
</script>
<template>
  <SearchForm
    :is-apply-filter="isApplyFilter"
    @submit="submit"
    :is-use-filter="true"
    @deleteFilter="handleRemoveFilter"
    @delete:filter-result="(field?: string) => handleRemoveFilter(field, true)"
    :filter-results="filterResults"
  >
    <template #filters>
      <v-row class="filter-content mx-0">
        <v-col cols="12" class="px-0">
          <BaseAutoComplete
            name="classroomIds"
            :label="$t('tuitionFee.filter.classroom')"
            :placeholder="$t('tuitionFee.filter.placeholder.classroom')"
            :multiple="true"
            :items="store.classroomOptions"
          />
        </v-col>
        <v-col cols="12" class="px-0">
          <MultiSelect
            name="statuses"
            :label="$t('tuitionFee.filter.status')"
            :placeholder="$t('tuitionFee.filter.placeholder.status')"
            :clearable="true"
            :items="TuitionStatusOptions"
          />
        </v-col>
        <v-col cols="12" class="px-0">
          <DatePicker
            name="startAt"
            :label="$t('tuitionFee.filter.startDate')"
            :placeholder="$t('tuitionFee.filter.placeholder.startDate')"
            value-type="string"
            :max="formValue.endAt && dayjs(formValue.endAt).toDate()"
          />
        </v-col>
        <v-col cols="12" class="px-0">
          <DatePicker
            name="endAt"
            :label="$t('tuitionFee.filter.endDate')"
            :placeholder="$t('tuitionFee.filter.placeholder.endDate')"
            value-type="string"
            :min="formValue.startAt && dayjs(formValue.startAt).toDate()"
          />
        </v-col>
        <v-col cols="12" class="px-0">
          <BaseAutoComplete
            name="presenterIds"
            :label="$t('tuitionFee.filter.counselor')"
            :placeholder="$t('tuitionFee.filter.placeholder.counselor')"
            :multiple="true"
            :items="store.presenterOptions"
          />
        </v-col>
      </v-row>
    </template>
  </SearchForm>
</template>
<style lang="scss" scoped>
.filter-content {
  max-width: 300px;
}
</style>
