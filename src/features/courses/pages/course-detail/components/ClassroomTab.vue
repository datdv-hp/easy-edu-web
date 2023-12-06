<script lang="ts" setup>
import { getTableIndex } from '@/common/helpers';
import { EllipsisTableData, MultiSelect, TableBase, TableHeader } from '@/components';
import { ClassroomStatus, ClassroomStatusColors } from '@/features/classroom/contants';
import { useCourseDetail } from '@/features/courses/store';
import { computed, onUnmounted } from 'vue';
import { onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const store = useCourseDetail();

const updatePage = async (value: number) => {
  store.setClassroomPage(value);
  store.getListClassroomOfCourse();
};

const submit = async (values: ClassroomStatus[]) => {
  store.setClassroomStatus(values);
  store.getListClassroomOfCourse();
};

const statusOptions = computed(() =>
  Object.values(ClassroomStatus).map((status) => ({
    title: t(`classroom.status.${status.toLowerCase()}`),
    value: status,
  })),
);

onBeforeMount(() => {
  store.getListClassroomOfCourse();
});

onUnmounted(() => {
  store.classroomListQuery.page = 1;
});
</script>
<template>
  <div class="d-flex align-center justify-end mb-6">
    <div class="wrapper">
      <MultiSelect
        class="select-status"
        name="status"
        multiple
        menu-width="248px"
        :items="statusOptions"
        clearable
        :placeholder="$t('courses.detail.classroom.status')"
        @change="(values: ClassroomStatus[]) => submit(values)"
      />
    </div>
  </div>
  <TableHeader
    :total="store.totalClassroomPages"
    @change-page="updatePage"
    :page="store.classroomListQuery.page || 1"
    :title="$t('classroom.total', { total: store.totalClassrooms })"
  />
  <TableBase :is-empty="!store.totalClassrooms" :loading="store.isFetchingList">
    <template #thead>
      <tr>
        <th class="text-left ws-nowrap minW-50px w-10">
          {{ $t('courses.detail.classroom.index') }}
        </th>
        <th class="text-left ws-nowrap">
          {{ $t('courses.detail.classroom.id') }}
        </th>
        <th class="text-left ws-nowrap w-30 minW-200px">
          {{ $t('courses.detail.classroom.name') }}
        </th>
        <th class="text-left ws-nowrap">
          {{ $t('courses.detail.classroom.startDate') }}
        </th>
        <th class="text-left ws-nowrap">
          {{ $t('courses.detail.classroom.endDate') }}
        </th>
        <th class="text-left ws-nowrap">
          {{ $t('courses.detail.classroom.numberOfStudents') }}
        </th>
        <th class="text-left ws-nowrap">
          {{ $t('courses.detail.classroom.status') }}
        </th>
      </tr>
    </template>
    <template #tbody>
      <tr v-for="(item, index) in store.classroomList" :key="index">
        <td>
          {{ getTableIndex(index, store.classroomListQuery.page) }}
        </td>
        <td class="ws-nowrap">
          {{ item.code }}
        </td>
        <EllipsisTableData :text="item.name" />
        <td class="ws-nowrap">
          {{ item.startDate }}
        </td>
        <td class="ws-nowrap">
          {{ item.endDate }}
        </td>
        <td class="ws-nowrap">
          {{ item.totalStudents }}
        </td>
        <td>
          <div class="d-flex align-center flex-nowrap">
            <div
              class="mr-2"
              :style="{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: ClassroomStatusColors[item.status],
              }"
            ></div>
            <span class="ws-nowrap">{{ $t(`classroom.status.${item.status}`) }}</span>
          </div>
        </td>
      </tr>
    </template>
  </TableBase>
</template>
<style lang="scss" scoped>
.wrapper {
  width: 240px;
  padding-right: 4px;
}
// :deep(.v-table__wrapper) {
//   height: calc(100vh - 60px - 32px - 388px - 16px - 16px - 56px - 16px);
// }
.select-status {
  :deep(.v-field__input) {
    min-height: 36px !important;
    width: 240px;
  }
}
</style>
