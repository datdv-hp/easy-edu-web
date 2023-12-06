<script setup lang="ts">
import { PageName } from '@/common/constants';
import { showErrorNotification } from '@/common/helpers';
import { useRole } from '@/common/stores/role.store';
import {
  EllipsisTableData,
  LoadingOverlay,
  SingleSelect,
  TableBase,
  TableHeader,
} from '@/components';
import { useClassroomTimekeepingStore } from '@/features/classroom/stores';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { chunk } from 'lodash';
import { computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { ClassroomTimekeepingListType } from '../../contants';
import { calculateTableIndex } from '../../helpers';

const store = useClassroomTimekeepingStore();
const role = useRole();
const route = useRoute();
const classroomId = route.params?.id;
const { t } = useI18n();

onMounted(async () => {
  const classroomDetailResponse = await store.getClassroomDetail(classroomId as string);
  if (!classroomDetailResponse.success) {
    showErrorNotification(classroomDetailResponse?.message);
    return;
  }
});

const listTimekeepingTypeFunc = {
  student: store.getClassroomTimekeepingStudentList,
  teacher: store.getClassroomTimekeepingTeacherList,
};

const timekeepingViewStudentOptions = computed(() => {
  const _options = [] as ClassroomTimekeepingListType[];
  if (role.classroom?.viewAttendance) {
    _options.push(ClassroomTimekeepingListType.STUDENT);
  }
  if (role.classroom?.viewTimeKeeping) {
    _options.push(ClassroomTimekeepingListType.TEACHER);
  }
  const options = _options.map((view) => ({
    title: t(`classroom.timekeepingPage.listType.${view.toLowerCase()}`),
    value: view,
  }));
  if (_options.length) {
    listTimekeepingTypeFunc[_options[0]](classroomId as string);
  }
  return options;
});

const updatePage = async (value: number) => {
  if (value > store.totalPages) {
    value = 1;
  }
  store.setPage(value);
};

onUnmounted(() => {
  store.listQuery.page = 1;
  store.setSelectedViewType(ClassroomTimekeepingListType.STUDENT);
});

const subjectList = computed(() => {
  const chunkList = chunk(store.list, store.listQuery.limit);
  return chunkList[(store.listQuery?.page || 1) - 1] || [];
});
const changeViewType = (value: string) => {
  store.setSelectedViewType(value as ClassroomTimekeepingListType);
  listTimekeepingTypeFunc[value](classroomId as string);
};

const classroomName = computed(() => {
  if (!store.classroomDetail) {
    return '';
  }
  return `(${store.classroomDetail?.name})`;
});
</script>
<template>
  <HeaderBar
    :back-to="{
      name: PageName.CLASSROOM_DETAIL_PAGE,
      params: {
        id: classroomId,
      },
    }"
  >
    <template #title>
      {{ `${$t('classroom.timekeepingPage.title')} ${classroomName}` }}
    </template>
  </HeaderBar>
  <div class="ma-4 filter-form">
    <SingleSelect
      name="viewType"
      menuWidth="200px"
      :items="timekeepingViewStudentOptions"
      :defaultSelect="timekeepingViewStudentOptions?.[0].value"
      @change="changeViewType"
    />
  </div>
  <v-card class="mx-4 mb-4 pa-0">
    <TableHeader
      :total="store.totalPages"
      @change-page="updatePage"
      :page="store.listQuery.page || 1"
      :title="
        store.selectedViewType === ClassroomTimekeepingListType.STUDENT
          ? $t('classroom.timekeepingPage.totalStudents', {
              total: store.total,
            })
          : $t('classroom.timekeepingPage.totalTeachers', {
              total: store.total,
            })
      "
    />
    <TableBase :is-empty="!store.total">
      <template #thead>
        <tr>
          <th class="ws-nowrap">
            {{ t('classroom.timekeepingPage.table.no') }}
          </th>
          <th class="ws-nowrap">
            {{ t('classroom.timekeepingPage.table.id') }}
          </th>
          <th class="ws-nowrap minW-300px w-40">
            {{
              store.selectedViewType === ClassroomTimekeepingListType.STUDENT
                ? t('classroom.timekeepingPage.table.studentName')
                : t('classroom.timekeepingPage.table.teacherName')
            }}
          </th>
          <th class="ws-nowrap w-20">
            {{ t('classroom.timekeepingPage.table.attended') }}
          </th>
        </tr>
      </template>
      <template #tbody>
        <tr v-for="(item, index) in subjectList" :key="index">
          <td>
            {{
              calculateTableIndex(index, store.listQuery?.page, store.listQuery?.limit)
            }}
          </td>
          <td>{{ item.code }}</td>
          <EllipsisTableData :text="item.name" />
          <td>
            {{
              `${item.timekeeping?.attended || 0}/${
                item.timekeeping?.finishedLesson || 0
              }`
            }}
          </td>
        </tr>
      </template>
    </TableBase>
    <LoadingOverlay :loading="store.isFetching" />
  </v-card>
</template>

<style lang="scss" scoped>
.filter-form {
  width: 200px;
}
</style>
