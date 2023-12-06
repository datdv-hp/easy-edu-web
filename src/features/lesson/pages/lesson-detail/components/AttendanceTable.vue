<script lang="ts" setup>
import { DEFAULT_FIRST_PAGE, DEFAULT_LIMIT_FOR_PAGINATION } from '@/common/constants';
import { EllipsisTableData, LoadingOverlay, TableBase, TableHeader } from '@/components';
import { useLessonStore } from '@/features/lesson/stores';
import { computed } from 'vue';
import { ref } from 'vue';
import { getTableIndex } from '@/common/helpers';
import { useI18n } from 'vue-i18n';
import { LessonStatus } from '@/features/lesson/constants';
import { LeaveRequestStatus } from '@/features/schedule-tracking/constants';
import { ILessonLeave } from '@/features/schedule-tracking/interfaces';

const { t } = useI18n();
const store = useLessonStore();
const page = ref(DEFAULT_FIRST_PAGE);
const totalPages = computed(() => {
  const total = (store.lessonInfo?.students || []).length;
  return Math.ceil(total / DEFAULT_LIMIT_FOR_PAGINATION) || 1;
});
const total = computed(() => (store.lessonInfo?.students || []).length);
const updatePage = (_page: number) => {
  page.value = _page;
};
const isLessonUpcoming = computed(
  () => store.lessonInfo?.status === LessonStatus.UPCOMING,
);
const leaveReason = computed(() => (leave?: ILessonLeave) => {
  if (leave?.status == LeaveRequestStatus.APPROVED) {
    return leave?.reason;
  }
  return '';
});
</script>
<template>
  <TableHeader
    :total="totalPages"
    :show-delete="false"
    @change-page="updatePage"
    :page="page"
    :title="$t('student.totalStudents', { total })"
  />
  <TableBase :is-empty="!total">
    <template #thead>
      <tr>
        <th class="text-left ws-nowrap">
          {{ t('lesson.detail.attendance.table.index') }}
        </th>
        <th class="text-left ws-nowrap">
          {{ t('lesson.detail.attendance.table.id') }}
        </th>
        <th class="text-left ws-nowrap minW-200px w-25">
          {{ t('lesson.detail.attendance.table.studentName') }}
        </th>
        <th class="text-left ws-nowrap">
          {{ t('lesson.detail.attendance.table.status') }}
        </th>
        <th class="text-left ws-nowrap minW-200px w-25">
          {{ t('lesson.detail.attendance.table.reason') }}
        </th>
      </tr>
    </template>
    <template #tbody>
      <tr
        v-for="(item, index) in store.lessonInfo?.students || []"
        :key="index"
        class="cursor-default"
      >
        <td class="ws-nowrap">
          {{ getTableIndex(index, page) }}
        </td>
        <td class="ws-nowrap">
          {{ item.code }}
        </td>
        <EllipsisTableData :text="item.name" />
        <td class="ws-nowrap">
          {{
            $t(
              `lesson.detail.attendance.status.${
                isLessonUpcoming ? undefined : item.status?.toLowerCase()
              }`,
            )
          }}
        </td>
        <EllipsisTableData :text="leaveReason(item.leave)" />
      </tr>
    </template>
  </TableBase>
  <LoadingOverlay :loading="store.isFetching" />
</template>
<style scoped lang="scss">
:deep(.v-table__wrapper) {
  height: unset;
  max-height: 500px;
}
</style>
