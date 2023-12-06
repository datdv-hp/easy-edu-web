<script lang="ts" setup>
import { DEFAULT_COMMON_LIST_QUERY, PageName } from '@/common/constants';
import { BaseButton } from '@/components';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import router from '@/plugins/vue-router';
import SearchBar from './components/SearchBar.vue';
import SyllabusList from './components/SyllabusList.vue';
import { useRole } from '@/common/stores/role.store';
import { onBeforeRouteLeave } from 'vue-router';
import { useSyllabusStore } from '../../stores';

const role = useRole();
const store = useSyllabusStore();
function goToCreatePage() {
  router.push({ name: PageName.SYLLABUS_CREATE_PAGE });
}

onBeforeRouteLeave((to, _, next) => {
  if (to.name !== PageName.SYLLABUS_DETAIL_PAGE) {
    store.setQuery(DEFAULT_COMMON_LIST_QUERY);
  }
  next();
});
</script>
<template>
  <HeaderBar :title="$t('syllabus.list.title')">
    <template #append>
      <BaseButton
        v-if="role.syllabus?.create"
        left-icon="mdi-plus"
        size="extra-small"
        :label="$t('common.button.create')"
        @click="goToCreatePage"
      />
    </template>
  </HeaderBar>
  <SearchBar />
  <SyllabusList />
</template>
<style lang="scss" scoped></style>
