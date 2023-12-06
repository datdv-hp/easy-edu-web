<script setup lang="ts">
import { DEFAULT_COMMON_LIST_QUERY, PageName } from '@/common/constants';
import { useRole } from '@/common/stores/role.store';
import { BaseButton } from '@/components';
import { useLessonDialog, useLessonStore } from '@/features/lesson/stores';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { onBeforeMount } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import LessonFormDialog from '../../components/LessonFormDialog.vue';
import LessonList from './components/LessonList.vue';
import SearchBar from './components/SearchBar.vue';

const role = useRole();
const dialogStore = useLessonDialog();
const store = useLessonStore();

onBeforeMount(async () => {
  store.getList();
});

const createSuccess = () => {
  store.getList();
};

onBeforeRouteLeave((to, _, next) => {
  if (to.name !== PageName.LESSON_DETAIL_PAGE) {
    store.setQuery({
      ...DEFAULT_COMMON_LIST_QUERY,
      statuses: undefined,
      classroomIds: undefined,
    });
  }
  next();
});
</script>

<template>
  <header-bar :title="$t('lesson.list')">
    <template #append>
      <BaseButton
        v-if="role.lesson?.create"
        left-icon="mdi-plus"
        @click="dialogStore.open('', {})"
        size="extra-small"
        :label="$t('common.button.create')"
      />
    </template>
  </header-bar>

  <LessonFormDialog v-if="dialogStore.isOpen" @createSuccess="createSuccess" />
  <div class="d-flex">
    <SearchBar />
  </div>
  <LessonList />
</template>

<style scoped lang="scss"></style>
