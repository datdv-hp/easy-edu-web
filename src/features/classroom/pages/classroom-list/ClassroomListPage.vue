<script setup lang="ts">
import { DEFAULT_COMMON_LIST_QUERY, PageName } from '@/common/constants';
import { useRole } from '@/common/stores/role.store';
import { BaseButton } from '@/components';
import ClassroomFormDialog from '@/features/classroom/components/ClassroomFormDialog.vue';
import { useClassroomDialog, useClassroomStore } from '@/features/classroom/stores';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { onMounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import ClassroomList from './components/ClassroomList.vue';
import SearchBar from './components/SearchBar.vue';

const role = useRole();

const dialogStore = useClassroomDialog();
const store = useClassroomStore();
onMounted(async () => {
  store.getList();
});
onBeforeRouteLeave((to, _, next) => {
  if (to.name !== PageName.CLASSROOM_DETAIL_PAGE) {
    store.setQuery({
      ...DEFAULT_COMMON_LIST_QUERY,
      statuses: undefined,
      courseIds: undefined,
    });
  }
  next();
});
</script>
<template>
  <header-bar :title="$t('classroom.list')">
    <template #append>
      <BaseButton
        v-if="role.classroom?.create"
        left-icon="mdi-plus"
        size="extra-small"
        :label="$t('common.button.create')"
        @click="dialogStore.open()"
      />
    </template>
  </header-bar>

  <ClassroomFormDialog v-if="dialogStore.isOpen && role.classroom?.create" />
  <SearchBar />
  <ClassroomList />
</template>

<style scoped lang="scss"></style>
