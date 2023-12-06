<script setup lang="ts">
import { PageName } from '@/common/constants';
import { getTableIndex } from '@/common/helpers';
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
import {
  ClassByTeacherStatus,
  ClassByTeacherStatusColor,
} from '@/features/teacher/constants';
import { ITeacherClass } from '@/features/teacher/interfaces';
import { useClassByTeacherStore } from '@/features/teacher/stores';
import router from '@/plugins/vue-router';
import dayjs from 'dayjs';
import { computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
const scheduleStore = useScheduleTrackingStore();
const classByTeacherStore = useClassByTeacherStore();
const role = useRole();

function getStatus(item: ITeacherClass) {
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

const classList = computed(() => {
  return classByTeacherStore.classListByTeacher?.map((item) => {
    return { ...item, status: getStatus(item) };
  });
});

onMounted(async () => {
  await classByTeacherStore.getClassListByTeacher(route.params.id as string);
});

const updatePage = async (value: number) => {
  classByTeacherStore.setPage(value);
  classByTeacherStore.getClassListByTeacher(route.params.id as string);
};

const onChangeOrder = async ({ field, direction }: ITableSorter) => {
  classByTeacherStore.setOrder({ [field]: direction });
  classByTeacherStore.getClassListByTeacher(route.params.id as string);
};
const openClassSchedule = (item: ITeacherClass) => {
  if (role.schedule?.view) {
    scheduleStore.setScheduleListQuery({
      classroomIds: [item.id],
      teacherIds: [route.params.id as string],
    });
    router.push({
      name: PageName.SCHEDULE_TRACKING_PAGE,
    });
  }
};

function viewClassroomDetail(item: ITeacherClass) {
  if (role.classroom?.view || role.classroom?.viewPersonal) {
    router.push({
      name: PageName.CLASSROOM_DETAIL_PAGE,
      params: {
        id: item.id,
      },
    });
  }
}

onUnmounted(() => {
  classByTeacherStore.classByTeacherListQuery.page = 1;
});
</script>

<template>
  <v-card class="ma-4 pa-0">
    <TableHeader
      :total="classByTeacherStore.totalPages"
      @change-page="updatePage"
      :page="classByTeacherStore.classByTeacherListQuery.page || 1"
      :title="
        $t('teacher.totalClasses', {
          total: classByTeacherStore.totalClasses,
        })
      "
    />
    <TableBase :is-empty="!classByTeacherStore.totalClasses">
      <template #thead>
        <tr>
          <th>{{ $t('common.tableIndex') }}</th>
          <SortTableColumnHeader
            name="code"
            :title="t('teacher.detail.info.courses.id')"
            width="20%"
            min-width="200px"
            @change="onChangeOrder"
            :order-by="classByTeacherStore.classByTeacherListQuery?.orderBy"
            :direction="classByTeacherStore.classByTeacherListQuery?.orderDirection"
          />
          <SortTableColumnHeader
            name="name"
            :title="t('teacher.detail.info.courses.class')"
            width="30%"
            min-width="200px"
            @change="onChangeOrder"
            :order-by="classByTeacherStore.classByTeacherListQuery?.orderBy"
            :direction="classByTeacherStore.classByTeacherListQuery?.orderDirection"
          />
          <th class="text-left ws-nowrap w-30 minW-200px">
            {{ t('teacher.detail.info.courses.name') }}
          </th>
          <th class="text-left ws-nowrap">
            {{ t('teacher.detail.info.courses.state') }}
          </th>
        </tr>
      </template>
      <template #tbody>
        <tr v-for="(item, index) in classList" :key="index" class="cursor-default">
          <td>
            {{ getTableIndex(index, classByTeacherStore.classByTeacherListQuery.page) }}
          </td>
          <td class="ws-nowrap">
            {{ item.code }}
          </td>
          <td>
            <div class="d-flex align-center">
              <v-tooltip :text="item?.name" location="top left" v-if="!!item?.name">
                <template v-slot:activator="{ props }">
                  <span
                    v-bind="props"
                    class="ellipsis-one-line"
                    :class="{
                      'cursor-pointer':
                        role.classroom?.view || role.classroom?.viewPersonal,
                    }"
                    @click.stop="() => viewClassroomDetail(item)"
                    >{{ item?.name }}</span
                  >
                </template>
              </v-tooltip>
              <img
                class="date-icon pa-1 cursor-pointer"
                :class="{ 'cursor-pointer': role.schedule?.view }"
                src="@/assets/icons/lms/calendar-purple.svg"
                alt=""
                @click="() => openClassSchedule(item)"
              />
            </div>
          </td>
          <EllipsisTableData :text="item.course?.name" />
          <td>
            <div class="d-flex align-center ws-nowrap">
              <div
                :style="{
                  display: 'inline-block',
                  marginRight: '6px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: ClassByTeacherStatusColor[item?.status],
                }"
              ></div>
              {{ $t(`teacher.classStatus.${item?.status}`) }}
            </div>
          </td>
        </tr>
      </template>
    </TableBase>
    <LoadingOverlay :loading="classByTeacherStore.isFetching" />
  </v-card>
</template>
<style scoped lang="scss">
:deep(.v-table__wrapper) {
  height: calc(100vh - $offset-table-height-with-tab);
}
</style>
