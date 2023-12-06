<script lang="ts" setup>
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { useRole } from '@/common/stores/role.store';
import { LoadingOverlay, TableHeader } from '@/components';
import SyllabusDeleteConfirmText from '@/features/syllabus/components/SyllabusDeleteConfirmText.vue';
import { useSyllabusStore } from '@/features/syllabus/stores';
import { showDialogConfirm } from '@/plugins';
import { computed, onBeforeMount, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SyllabusListGridLayout from './SyllabusListGridLayout.vue';
import SyllabusListTableLayout from './SyllabusListTableLayout.vue';

const store = useSyllabusStore();
const { t } = useI18n();
const role = useRole();

onBeforeMount(() => {
  store.getList();
});

onUnmounted(() => {
  store.unSelectAll();
});

function handleDeleteErrors(error: IResponseError) {
  showErrorNotification(error.message);
}

async function removeSelectedItems() {
  const checkSyllabusRes = await store.checkAssignedSyllabusesToClassroom();
  const selectedSyllabuses = store.list.filter(
    (syllabus) => store.selectedIds[syllabus.id],
  );
  const confirm = await showDialogConfirm('info', {
    title: t('common.deleteConfirm'),
    textComponent: {
      component: SyllabusDeleteConfirmText,
      props: {
        total: store.selectedIdsList.length,
        isAssignedToClassroom: !!checkSyllabusRes?.data,
        syllabuses: selectedSyllabuses,
      },
    },
  });
  if (confirm) {
    const res = await store.removeSelectedItems();
    if (res.success) {
      showSuccessNotification(t('syllabus.success.delete'));
      store.selectedIds = {};
      store.getList();
      return;
    }
    if (res?.errors?.length) {
      handleDeleteErrors(res.errors[0]);
    } else {
      showErrorNotification(res.error || (res.message as string));
    }
  }
}

function updatePage(page: number) {
  store.setPage(page);
  store.getList();
}

const bgColor = computed(() => (store.layout === 'table' ? '#FFF' : 'transparent'));
</script>
<template>
  <v-card class="mx-4 pa-0" :color="bgColor" v-show="store.layout === 'table'">
    <TableHeader
      :total="store.totalPages"
      :show-delete="store.showDelete && role.syllabus?.delete"
      @remove-items="removeSelectedItems"
      @change-page="updatePage"
      :page="store.syllabusListQuery.page || 1"
      :class="!store.isTableLayout ? 'grid-header' : ''"
      :title="$t('syllabus.list.totalSyllabuses', { total: store.total })"
    />
    <SyllabusListTableLayout />
  </v-card>
  <div class="ma-4" v-show="store.layout === 'grid'">
    <TableHeader
      :total="store.totalPages"
      :show-delete="store.showDelete && role.syllabus?.delete"
      @remove-items="removeSelectedItems"
      @change-page="updatePage"
      :page="store.syllabusListQuery.page || 1"
      :class="!store.isTableLayout ? 'grid-header' : ''"
      :title="$t('syllabus.list.totalSyllabuses', { total: store.total })"
    />
    <SyllabusListGridLayout />
  </div>
  <LoadingOverlay :loading="store.isFetching && !store.isTableLayout" />
</template>
<style lang="scss" scoped>
.grid-header {
  border: none;
  padding: 0 0 12px 0;
}
</style>
