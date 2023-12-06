<script lang="ts" setup>
import { useTimekeepingStore } from '@/features/teacher/stores';
import { BaseButton, DatePicker, SearchInput } from '@/components';
import { onMounted } from 'vue';
import { useField, useForm } from 'vee-validate';
import { onUnmounted } from 'vue';
import { useUserStore } from '@/features/auth/stores';
import { ProfileType } from '@/common/constants';
import dayjs from 'dayjs';

const store = useTimekeepingStore();
const user = useUserStore();
const { setFieldValue } = useForm();
const { setValue: setCurrentMonth } = useField('month');

onMounted(async () => {
  setCurrentMonth({ month: dayjs().month(), year: dayjs().year() });
  setFieldValue('keyword', store.teacherListQuery.keyword?.trim());
});

onUnmounted(() => {
  store.setInputSearch(undefined);
});

async function search() {
  setFieldValue('keyword', store.teacherListQuery.keyword?.trim());
  store.setInputSearch(store.teacherListQuery.keyword?.trim());
  await store.fetchTeacherTimekeeping();
}

const setTimekeepingMonth = async ($event) => {
  if ($event) {
    store.selectedMonth = $event;
  }
};
</script>

<template>
  <div class="ma-4 searchbar-container">
    <div class="d-flex">
      <SearchInput
        v-if="user.profile?.type !== ProfileType.TEACHER"
        class="mr-3"
        v-model="store.teacherListQuery.keyword"
        style="max-height: 100%"
        @enter="search"
      />
      <BaseButton
        v-if="user.profile?.type !== ProfileType.TEACHER"
        :label="$t('teacher.timekeeping.search.searchButton')"
        size="medium"
        @click="search"
      />
    </div>
    <div style="width: 255px">
      <DatePicker
        name="month"
        :placeholder="$t('teacher.timekeeping.search.month')"
        :month-picker="true"
        format="YYYY-MM"
        :clearable="false"
        @update:model-value="setTimekeepingMonth"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.searchbar-container {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  height: 50px;
  align-items: stretch;
}
</style>
