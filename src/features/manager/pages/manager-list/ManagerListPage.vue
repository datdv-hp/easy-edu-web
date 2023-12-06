<script setup lang="ts">
import SearchBar from './components/SearchBar.vue';
import ManagerList from './components/ManagerList.vue';
import ManagerFormDialog from '@/features/manager/components/ManagerFormDialog.vue';
import { useRole } from '@/common/stores/role.store';
import { useManagerDialog, useManagerStore } from '@/features/manager/stores';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { onMounted } from 'vue';
import { BaseButton } from '@/components';
import { DEFAULT_COMMON_LIST_QUERY, PageName } from '@/common/constants';
import { onBeforeRouteLeave } from 'vue-router';

const role = useRole();
const dialogStore = useManagerDialog();
const store = useManagerStore();

onMounted(async () => {
  store.getList();
});

onBeforeRouteLeave((to, _, next) => {
  if (to.name !== PageName.MANAGER_DETAIL_PAGE) {
    store.setQuery({
      ...DEFAULT_COMMON_LIST_QUERY,
      isTeacher: undefined,
    });
  }
  next();
});
</script>

<template>
  <HeaderBar :title="$t('manager.list')">
    <template #append>
      <BaseButton
        v-if="role?.manager?.create"
        left-icon="mdi-plus"
        size="extra-small"
        :label="$t('common.button.create')"
        @click="dialogStore.open()"
      />
    </template>
  </HeaderBar>

  <ManagerFormDialog v-if="dialogStore.isOpen" />
  <SearchBar />
  <ManagerList />
</template>

<style scoped lang="scss"></style>
