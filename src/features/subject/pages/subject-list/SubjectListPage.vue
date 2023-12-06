<script lang="ts" setup>
import { useRole } from '@/common/stores/role.store';
import { BaseButton } from '@/components';
import SubjectFormDialog from '@/features/subject/components/SubjectFormDialog.vue';
import { useSubjectDialog, useSubjectStore } from '@/features/subject/store';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { onMounted, onUnmounted } from 'vue';
import SearchBar from './components/SearchBar.vue';
import SubjectList from './components/SubjectList.vue';
import { DEFAULT_COMMON_LIST_QUERY } from '@/common/constants';
import { computed } from 'vue';

const role = useRole();
const store = useSubjectStore();
const dialogStore = useSubjectDialog();

onMounted(async () => {
  store.getList();
});

onUnmounted(() => {
  store.setQuery(DEFAULT_COMMON_LIST_QUERY);
});

const isAbleToOpenPopup = computed(() => role.subject?.create || role.subject?.update);
</script>

<template>
  <HeaderBar :title="$t('subjects.list.title')">
    <template #append>
      <BaseButton
        v-if="role.subject?.create"
        left-icon="mdi-plus"
        size="extra-small"
        :label="$t('common.button.create')"
        @click="dialogStore.open()"
      />
    </template>
  </HeaderBar>

  <SubjectFormDialog v-if="dialogStore.isOpen && isAbleToOpenPopup" />
  <SearchBar />
  <SubjectList />
</template>

<style lang="scss" scoped></style>
