<script lang="ts" setup>
import { DEFAULT_COMMON_LIST_QUERY, PageName } from '@/common/constants';
import { useRole } from '@/common/stores/role.store';
import { BaseButton } from '@/components';
import TeacherFormDialog from '@/features/teacher/components/TeacherFormDialog.vue';
import { useTeacherDialog, useTeacherStore } from '@/features/teacher/stores';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { onMounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import SearchBar from './components/SearchBar.vue';
import TeacherList from './components/TeacherList.vue';
const role = useRole();

const dialogStore = useTeacherDialog();
const store = useTeacherStore();

onMounted(async () => {
  store.getList();
});

onBeforeRouteLeave((to, _, next) => {
  if (to.name !== PageName.TEACHER_DETAIL_PAGE) {
    store.setQuery({
      ...DEFAULT_COMMON_LIST_QUERY,
    });
  }
  next();
});
</script>

<template>
  <header-bar :title="$t('teacher.list')">
    <template #append>
      <BaseButton
        v-if="role.teacher?.create"
        left-icon="mdi-plus"
        size="extra-small"
        :label="$t('common.button.create')"
        @click="dialogStore.open()"
      />
    </template>
  </header-bar>
  <TeacherFormDialog v-if="dialogStore.isOpen" />
  <SearchBar />
  <TeacherList />
</template>

<style lang="scss" scoped></style>
