<script lang="ts" setup>
import { BaseButton, EllipsisTableData, TableBase, TableHeader } from '@/components';
import ExpandList from './ExpandList.vue';
import { useLectureDialog, useSyllabusDetail } from '@/features/syllabus/stores';
import { calculateTableIndex } from '@/features/classroom/helpers';
import { useRoute } from 'vue-router';
import { showDialogConfirm } from '@/plugins';
import { useI18n } from 'vue-i18n';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { useRole } from '@/common/stores/role.store';
import { onUnmounted, ref } from 'vue';
import LectureDeleteConfirmText from './LectureDeleteConfirmText.vue';
import ViewDocumentDialog from '@/components/ViewDocumentDialog.vue';

const store = useSyllabusDetail();
const lectureDialog = useLectureDialog();
const role = useRole();
const route = useRoute();
const { t } = useI18n();
const syllabusId = route.params.id as string;
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
async function handleRemoveSelectedItems() {
  const selectedLectures = store.lectureList.filter(
    (lecture) => store.selectedLectureIds?.[lecture.id],
  );
  const res = await showDialogConfirm('info', {
    title: t('common.deleteConfirm'),
    textComponent: {
      component: LectureDeleteConfirmText,
      props: {
        lectures: selectedLectures,
      },
    },
  });
  if (res) {
    const res = await store.deleteLectures(store.selectedLectureIdList);
    if (res.success) {
      showSuccessNotification(t('syllabus.success.deleteLecture'));
      store.selectedLectureIds = {};
      store.getLectureList(syllabusId);
      store.getUpdateHistoryList(syllabusId);
      return;
    }
    if (res?.errors?.length) {
      const error = res.errors[0];
      showErrorNotification(error.message);
    } else {
      showErrorNotification(res.error || (res.message as string));
    }
  }
}
function updatePage(page: number) {
  store.setLecturePage(page);
  store.getLectureList(syllabusId);
}

function onClickUpdateSelectedItems() {
  lectureDialog.open(store.selectedLectureIdList);
}

function getRowIndex(index: number) {
  return calculateTableIndex(
    index,
    store.lectureListQuery.page,
    store.lectureListQuery.limit,
  );
}

function openLectureDialog() {
  lectureDialog.open();
}

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

onUnmounted(() => {
  store.setLecturePage(1);
  store.unSelectAllLectures();
});
</script>
<template>
  <ExpandList :title="$t('syllabus.detail.lectureList.title')">
    <template #prepend-inner="{ isOpen }">
      <BaseButton
        v-if="isOpen && role.syllabus?.update"
        size="extra-small"
        class="ms-3"
        :label="$t('common.button.create')"
        button-class="px-5"
        @click.stop="openLectureDialog"
      />
    </template>
    <TableHeader
      :total="store.totalLecturePages"
      class="lecture-list-header"
      @change-page="updatePage"
      :page="store.lectureListQuery.page || 1"
      :title="$t('syllabus.detail.lectureList.total', { total: store.totalLectures })"
    >
      <template #prepend>
        <template v-if="store.isShowLectureActions">
          <div class="d-flex align-center gap-1 ml-3">
            <v-icon
              v-if="role.syllabus?.delete"
              class="action-icon"
              icon="$custom.trash"
              @click="handleRemoveSelectedItems"
            />
            <v-icon
              v-if="role.syllabus?.update"
              class="action-icon"
              icon="$custom.edit"
              @click="onClickUpdateSelectedItems"
            />
          </div>
        </template>
      </template>
    </TableHeader>
    <TableBase
      :is-empty="!store.lectureList?.length"
      :loading="store.isFetching.lectureList"
    >
      <template #thead>
        <tr>
          <th
            v-if="role.syllabus?.delete || role.syllabus?.update"
            class="text-left ws-nowrap"
          >
            <v-checkbox
              color="primary"
              class="w-100 minW-52px"
              hide-details
              :model-value="store.isAllLecturesSelected || store.isShowLectureActions"
              @update:model-value="store.toggleSelectAllLectures()"
              :indeterminate="
                store.isShowLectureActions &&
                !store.isEmptyLectureSelected &&
                !store.isAllLecturesSelected
              "
            />
          </th>
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
        <tr
          v-for="(item, index) in store.lectureList"
          :key="index"
          :class="store.selectedLectureIdList[item.id] ? 'selected' : ''"
        >
          <td v-if="role.syllabus?.delete || role.syllabus?.update" @click.stop>
            <v-checkbox
              color="primary"
              hide-details
              :model-value="store.selectedLectureIds[item.id]"
              @update:model-value="store.setSelectLectureId(item.id)"
            />
          </td>
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
                  item.referenceLinks?.length &&
                  _index !== item.referenceLinks?.length - 1
                "
              />
            </template>
          </td>
        </tr>
      </template>
    </TableBase>
  </ExpandList>
  <ViewDocumentDialog
    v-if="viewingDocument.isShow"
    :src="viewingDocument.src"
    :name="viewingDocument.name"
    :fileType="viewingDocument.mimeType"
    @close="handleCloseViewingDocument"
  />
</template>
<style lang="scss" scoped>
.lecture-list-header {
  border: unset;
  border-top: 1px solid $color-neutral-6;
  border-radius: 0;
  padding-right: 0;
  padding-left: 12px;
  padding: 13px 0 9px 12px;
}

:deep(.v-table__wrapper) {
  border-radius: 8px;
  height: unset;
  max-height: 500px;
  border: 1px solid $color-neutral-6;
  td:not(:last-of-type),
  th:not(:last-of-type) {
    border-right: 1px solid $color-neutral-6;
  }
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

.action-icon {
  color: $color-neutral-4;
  &:hover {
    color: $color-text-black;
  }
}
</style>
