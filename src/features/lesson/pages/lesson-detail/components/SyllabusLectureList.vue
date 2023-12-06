<script setup lang="ts">
import { DEFAULT_LIMIT_FOR_PAGINATION } from '@/common/constants';
import { EllipsisTableData, TableBase, TableHeader } from '@/components';
import ViewDocumentDialog from '@/components/ViewDocumentDialog.vue';
import { calculateTableIndex } from '@/features/classroom/helpers';
import { ISyllabus, ISyllabusLectureListItem } from '@/features/syllabus/interfaces';
import { chunk } from 'lodash';
import { computed, ref } from 'vue';

const props = defineProps<{
  lectureList: ISyllabusLectureListItem[];
  isFetching?: boolean;
  syllabus?: ISyllabus;
}>();
const currentPage = ref(1);
const viewingDocument = ref<{
  isShow: boolean;
  src?: string;
  name?: string;
  mimeType?: string;
}>({
  isShow: false,
  src: undefined,
  name: undefined,
  mimeType: undefined,
});
function viewDocument(fileName: string, link: string, mimeType?: string) {
  if (link) {
    viewingDocument.value = {
      isShow: true,
      src: link,
      name: fileName,
      mimeType: mimeType,
    };
  }
}
function handleCloseViewingDocument() {
  viewingDocument.value = {
    isShow: false,
    src: undefined,
    name: undefined,
    mimeType: undefined,
  };
}

const updatePage = (_page: number) => {
  currentPage.value = _page;
};
const totalPages = computed(() => {
  return Math.ceil(props.lectureList.length / DEFAULT_LIMIT_FOR_PAGINATION) || 1;
});
const list = computed(() => {
  const chunkList = chunk(props.lectureList, DEFAULT_LIMIT_FOR_PAGINATION);
  return chunkList[(currentPage.value || 1) - 1] || [];
});

function getRowIndex(index: number) {
  return calculateTableIndex(index, currentPage.value, DEFAULT_LIMIT_FOR_PAGINATION);
}
</script>

<template>
  <TableHeader
    :total="totalPages"
    :show-delete="false"
    @change-page="updatePage"
    :page="currentPage"
    :title="$t('syllabus.detail.lectureList.total', { total: lectureList?.length || 0 })"
    :left-title="syllabus?.name || ''"
  />
  <TableBase :is-empty="!lectureList?.length" :loading="isFetching" :isBorderAll="true">
    <template #thead>
      <tr>
        <th class="text-left ws-nowrap minW-50px w-10">
          {{ $t('syllabus.detail.lectureList.table.index') }}
        </th>
        <th class="text-left ws-nowrap minW-200px w-40">
          {{ $t('syllabus.detail.lectureList.table.name') }}
        </th>
        <th class="text-left ws-nowrap minW-200px w-45">
          {{ $t('syllabus.detail.lectureList.table.file') }}
        </th>
      </tr>
    </template>
    <template #tbody>
      <tr v-for="(item, index) in list" :key="index">
        <td class="ws-nowrap">
          {{ getRowIndex(index) }}
        </td>
        <EllipsisTableData :text="item.name" />
        <td class="px-0">
          <template v-for="(file, _index) in item.files" :key="_index">
            <div
              @click="viewDocument(file.name, file.link, file.mimeType)"
              class="ellipsis-one-line px-4 my-4 document-link"
            >
              {{ file.name }}
            </div>
            <v-divider
              v-if="item.referenceLinks?.length || _index !== item.files.length - 1"
            />
          </template>
          <template v-for="(link, _index) in item.referenceLinks" :key="_index">
            <div class="ellipsis-one-line px-4 my-4">
              <a :href="link" target="_blank" class="document-link">{{ link }}</a>
            </div>
            <v-divider
              v-if="
                item.referenceLinks?.length && _index !== item.referenceLinks?.length - 1
              "
            />
          </template>
        </td>
      </tr>
    </template>
  </TableBase>
  <ViewDocumentDialog
    v-if="viewingDocument.isShow"
    :src="viewingDocument.src"
    :name="viewingDocument.name"
    :fileType="viewingDocument.mimeType"
    @close="handleCloseViewingDocument"
  />
</template>

<style scoped lang="scss">
.lecture-list-header {
  border: unset;
  border-top: 1px solid $color-neutral-6;
  border-radius: 0;
  padding-right: 0;
  padding-left: 12px;
  padding: 13px 0 9px 12px;
}

:deep(.v-table__wrapper) {
  height: unset;
  max-height: 500px;
}
.document-link {
  color: #6d79e8;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  &:active,
  &:hover {
    color: #4057d0;
    text-decoration: underline;
  }
}
</style>
