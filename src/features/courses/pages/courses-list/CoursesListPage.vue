<script lang="ts" setup>
import { DEFAULT_COMMON_LIST_QUERY, PageName } from '@/common/constants';
import { useRole } from '@/common/stores/role.store';
import { BaseButton } from '@/components';
import DialogCourse from '@/features/courses/components/DialogCourse.vue';
import { useCourseDialog, useCoursesStore } from '@/features/courses/store';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { onMounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import CoursesList from './components/CoursesList.vue';
import SearchBar from './components/SearchBar.vue';

const role = useRole();
const store = useCoursesStore();
const dialogStore = useCourseDialog();

onMounted(async () => {
  store.getList();
});

onBeforeRouteLeave((to, _, next) => {
  if (to.name !== PageName.COURSE_DETAIL_PAGE) {
    store.setQuery({
      ...DEFAULT_COMMON_LIST_QUERY,
    });
  }
  next();
});
</script>

<template>
  <HeaderBar :title="$t('courses.list.title')">
    <template #append>
      <BaseButton
        v-if="role.course?.create"
        left-icon="mdi-plus"
        size="extra-small"
        :label="$t('common.button.create')"
        @click="dialogStore.open()"
      />
    </template>
  </HeaderBar>

  <DialogCourse v-if="dialogStore.isOpen && role.course?.create" />
  <SearchBar />
  <CoursesList />
</template>

<style lang="scss" scoped></style>
