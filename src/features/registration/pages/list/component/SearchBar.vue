<script lang="ts" setup>
import { MultiSelect, SearchForm } from '@/components';
import { RegistrationStatus } from '@/features/registration/constants';
import { useRegistrationStore } from '@/features/registration/stores';
import { useForm } from 'vee-validate';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useRegistrationStore();
const options = computed(() =>
  Object.values(RegistrationStatus).map((status) => ({
    title: t(`registration.status.${status}`),
    value: status,
  })),
);
const { handleSubmit, setFieldValue } = useForm();

const submit = handleSubmit(async (values) => {
  store.setQuery({
    ...values,
    keyword: values.keyword?.trim(),
  });
  setFieldValue('keyword', store.listQuery.keyword);
  await store.getList();
});
</script>
<template>
  <SearchForm @submit="submit()">
    <v-sheet width="300" class="ml-3 rounded--2">
      <MultiSelect
        name="statuses"
        :placeholder="$t('registration.filter.status')"
        :items="options"
        :clearable="true"
        @keydown.enter="submit"
      />
    </v-sheet>
  </SearchForm>
</template>
<style lang="scss" scoped></style>
