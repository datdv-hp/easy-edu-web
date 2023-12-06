<script setup lang="ts">
import { PageName } from '@/common/constants';
import { ITableSorter } from '@/common/interfaces';
import { useRole } from '@/common/stores/role.store';
import {
  EllipsisTableData,
  LoadingOverlay,
  SortTableColumnHeader,
  TableBase,
  TableHeader,
} from '@/components';
import { useScheduleTrackingStore } from '@/features/schedule-tracking/stores';
import { IStudentCourse } from '@/features/student/interfaces';
import { useStudentCourse } from '@/features/student/stores';
import {
  ClassByTeacherStatus,
  ClassByTeacherStatusColor,
} from '@/features/teacher/constants';
import router from '@/plugins/vue-router';
import dayjs from 'dayjs';
import { computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
const scheduleStore = useScheduleTrackingStore();
const studentCourseStore = useStudentCourse();
const role = useRole();

function getStatus(item: IStudentCourse) {
  const { startDate, endDate } = item;
  if (!startDate || !endDate) {
    return ClassByTeacherStatus.NO_START;
  }
  if (dayjs().isBefore(dayjs(startDate))) {
    return ClassByTeacherStatus.NO_START;
  }
  if (dayjs().isAfter(dayjs(endDate))) {
    return ClassByTeacherStatus.FINISHED;
  }
  return ClassByTeacherStatus.STARTED;
}

const courseList = computed(() => {
  return studentCourseStore.studentCourseList?.map((item) => {
    return { ...item, status: getStatus(item) };
  });
});

onMounted(async () => {
  await studentCourseStore.getStudentCourseList(route.params.id as string);
});

const updatePage = async (value: number) => {
  studentCourseStore.setPage(value);
  studentCourseStore.getStudentCourseList(route.params.id as string);
};

const onChangeOrder = async ({ field, direction }: ITableSorter) => {
  studentCourseStore.setOrder({ [field]: direction });
  studentCourseStore.getStudentCourseList(route.params.id as string);
};
const openClassSchedule = (item: IStudentCourse) => {
  scheduleStore.setScheduleListQuery({ classroomIds: [item.id] });
  router.push({
    name: PageName.SCHEDULE_TRACKING_PAGE,
  });
};

const openClassroomDetail = (item: IStudentCourse) => {
  if (!item?.id) {
    return;
  }
  router.push({
    name: PageName.CLASSROOM_DETAIL_PAGE,
    params: { id: item.id },
  });
};

onUnmounted(() => {
  studentCourseStore.studentCourseListQuery.page = 1;
});
</script>

<template>
  <v-card class="pa-0 ma-4">
    <TableHeader
      :total="studentCourseStore.totalPages"
      @change-page="updatePage"
      :page="studentCourseStore.studentCourseListQuery.page || 1"
      :title="
        $t('teacher.totalClasses', {
          total: studentCourseStore.totalCourses,
        })
      "
    />
    <TableBase :is-empty="!studentCourseStore.totalCourses">
      <template #thead>
        <tr>
          <SortTableColumnHeader
            name="code"
            :title="t('student.detail.info.courses.id')"
            @change="onChangeOrder"
            :order-by="studentCourseStore.studentCourseListQuery?.orderBy"
            :direction="studentCourseStore.studentCourseListQuery?.orderDirection"
          />
          <SortTableColumnHeader
            name="name"
            :title="t('student.detail.info.courses.class')"
            width="30%"
            min-width="200px"
            @change="onChangeOrder"
            :order-by="studentCourseStore.studentCourseListQuery?.orderBy"
            :direction="studentCourseStore.studentCourseListQuery?.orderDirection"
          />
          <th class="text-left ws-nowrap w-30 minW-200px">
            {{ t('student.detail.info.courses.name') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ t('student.detail.info.courses.startDate') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ t('student.detail.info.courses.endDate') }}
          </th>
          <th class="text-left ws-nowrap minW-160px">
            {{ t('student.detail.info.courses.state') }}
          </th>
        </tr>
      </template>
      <template #tbody>
        <tr
          v-for="(item, index) in courseList"
          :key="index"
          :class="{ 'cursor-default': !role.classroom?.detailBasic }"
        >
          <td
            class="ws-nowrap"
            @click.stop="() => role.classroom?.detailBasic && openClassroomDetail(item)"
          >
            {{ item.code }}
          </td>
          <td>
            <div class="d-flex align-center">
              <v-tooltip :text="item?.name" location="top left" v-if="!!item?.name">
                <template v-slot:activator="{ props }">
                  <span
                    v-bind="props"
                    class="ellipsis-one-line"
                    @click.stop="
                      () => role.classroom?.detailBasic && openClassroomDetail(item)
                    "
                    >{{ item?.name }}</span
                  >
                </template>
              </v-tooltip>

              <img
                v-if="role.schedule?.view || role.schedule?.viewPersonal"
                class="date-icon pa-1"
                src="@/assets/icons/lms/calendar-purple.svg"
                alt=""
                @click.stop="() => openClassSchedule(item)"
              />
            </div>
          </td>
          <EllipsisTableData :text="item.course?.name" />
          <td class="ws-nowrap">{{ item.startDate }}</td>
          <td class="ws-nowrap">{{ item.endDate }}</td>
          <td>
            <div class="d-flex align-center ws-nowrap">
              <v-badge
                class="d-flex align-center mr-2 mb-2 dot"
                dot
                :color="ClassByTeacherStatusColor[item?.status]"
              ></v-badge>
              {{ $t(`teacher.classStatus.${item?.status}`) }}
            </div>
          </td>
        </tr>
      </template>
    </TableBase>
    <LoadingOverlay :loading="studentCourseStore.isFetching" />
  </v-card>
</template>

<style scoped lang="scss">
:deep(.v-table__wrapper) {
  height: calc(100vh - $offset-table-height-with-tab);
}
:deep(.v-badge--dot .v-badge__badge) {
  top: 1px !important;
  bottom: 0 !important;
  width: 6px !important;
  height: 6px !important;
}
</style>
