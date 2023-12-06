<script lang="ts" setup>
import { DEFAULT_COMMON_LIST_QUERY, PageName } from '@/common/constants';
import { useRole } from '@/common/stores/role.store';
import BaseButton from '@/components/base/BaseButton.vue';
import DialogStudent from '@/features/student/components/DialogStudent.vue';
import { useStudentDialog, useStudentStore } from '@/features/student/stores';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { onMounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import SearchBar from './components/SearchBar.vue';
import StudentList from './components/StudentList.vue';

const role = useRole();
const dialogStore = useStudentDialog();
const store = useStudentStore();

onMounted(async () => {
  store.getList();
});

onBeforeRouteLeave((to, _, next) => {
  if (to.name !== PageName.STUDENT_DETAIL_PAGE) {
    store.setQuery({
      ...DEFAULT_COMMON_LIST_QUERY,
      courseIds: undefined,
    });
  }
  next();
});
</script>

<template>
  <HeaderBar>
    <template #title>{{ $t('student.list') }}</template>
    <template #append v-if="role.student?.create">
      <BaseButton
        v-if="role.student?.create"
        left-icon="mdi-plus"
        size="extra-small"
        :label="$t('common.button.create')"
        @click="dialogStore.open()"
      />
      <DialogStudent v-if="dialogStore.isOpen" />
    </template>
  </HeaderBar>
  <SearchBar />
  <StudentList />
</template>

<style lang="scss" scoped></style>
