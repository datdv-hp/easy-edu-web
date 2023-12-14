<script lang="ts" setup>
import { ProfileType } from '@/common/constants';
import { DatePicker, SearchForm } from '@/components';
import { useUserStore } from '@/features/auth/stores';
import { useTimekeepingStore } from '@/features/teacher/stores';
import dayjs from 'dayjs';
import { useField, useForm } from 'vee-validate';
import { onMounted, onUnmounted } from 'vue';

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
    <SearchForm
      class="ma-n4"
      v-if="user.profile?.type !== ProfileType.TEACHER"
      @submit="search"
    />
    <div class="select-month">
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

  .select-month {
    width: 250px;
    background-color: $color-white;
    border-radius: 4px;
  }
}
</style>
