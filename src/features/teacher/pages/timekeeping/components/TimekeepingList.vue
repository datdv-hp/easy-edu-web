<script setup lang="ts">
import { ProfileType, Role } from '@/common/constants';
import { showErrorNotification } from '@/common/helpers';
import { IResponseError, ITableSorter } from '@/common/interfaces';
import { useSidebarStore } from '@/common/stores/sidebar.store';
import {
  EllipsisTableData,
  LoadingOverlay,
  SortTableColumnHeader,
  TableBase,
  TableHeader,
} from '@/components';
import { useUserStore } from '@/features/auth/stores';
import { TimeKeepingStatus } from '@/features/teacher/constants';
import {
  ITeacherTimekeeping,
  ITimeKeeping,
  ITimeKeepingRow,
} from '@/features/teacher/interfaces';
import { useTimekeepingStore } from '@/features/teacher/stores';
import dayjs from 'dayjs';
import { debounce, range } from 'lodash';
import Grid, {
  ColumnOptions,
  GridEventListener,
  HeaderOptions,
  MenuItem,
  Row,
  RowKey,
} from 'tui-grid';
import 'tui-grid/dist/tui-grid.css';
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { CheckMarkRenderer } from '../../../helpers';
import { settingTimekeepingApiService } from '@/features/setting/services/settingTimekeeping.api';
import { ITimeKeepingSetting } from '@/features/setting/interfaces/setting-timekeeping.interfaces';
import { useRole } from '@/common/stores/role.store';

const role = useRole();
const store = useTimekeepingStore();
const user = useUserStore();
const sidebar = useSidebarStore();
const { t } = useI18n();
const grid = ref();
const tableTeacher = ref<HTMLElement>();
const scrollTeacherTable = ref();
const isTimekeeping = ref<boolean>(false);
const mockData = ref<ITimeKeepingRow[]>([]);

const settingTimekeeping = ref<ITimeKeepingSetting>();

const isTeacher = computed(() => {
  return (
    user.profile?.type === ProfileType.TEACHER && user.profile?.userRole === Role.USER
  );
});

const timekeepingDate = computed(() =>
  settingTimekeeping.value?.isEndOfMonth
    ? dayjs(store.selectedMonth).daysInMonth()
    : settingTimekeeping.value?.day &&
        settingTimekeeping.value.day > dayjs(store.selectedMonth).daysInMonth()
      ? dayjs(store.selectedMonth).daysInMonth()
      : settingTimekeeping.value?.day,
);

const hideTeacher = ref<boolean>(isTeacher.value);

const fetchData = async () => {
  const [resTeacher, resSettingTimekeeping] = await Promise.all([
    store.fetchTeacherTimekeeping(),
    settingTimekeepingApiService.getSettingTimekeeping(),
  ]);
  if (resSettingTimekeeping?.success) {
    settingTimekeeping.value = resSettingTimekeeping.data.value;
  }
  if (resTeacher?.success) {
    if (isTeacher.value) {
      const findTeacher = resTeacher.data.items.find(
        (item) => item._id === user.profile?.id,
      );
      store.setSelectedTeacherTimekeeping(findTeacher as unknown as ITeacherTimekeeping);
    } else {
      store.setSelectedTeacherTimekeeping(
        resTeacher.data.items[0] as unknown as ITeacherTimekeeping,
      );
    }
  }
  if (!store.selectedTeacherTimekeeping?._id) {
    setDataTimekeepingTable([]);
    return;
  }
  const resTimekeeping = await store.fetchTimekeepingEntries();
  setDataTimekeepingTable(resTimekeeping.data);
};

const setDataTimekeepingTable = (classroomList: ITimeKeeping[]) => {
  classroomList?.map((classroomItem: ITimeKeeping) => {
    if (classroomItem.lessons.length) {
      classroomItem.lessons.map((lesson) => {
        const find = mockData.value.find(
          (data: ITimeKeepingRow) => data.classroomId === lesson.classroom,
        );
        if (find) {
          const index = mockData.value.findIndex(
            (data: ITimeKeepingRow) => data.classroomId === lesson.classroom,
          );
          if (!mockData.value?.[index]?._children) {
            if (mockData.value?.[index]) {
              mockData.value[index]._children = [];
            }
          }
          mockData.value[index]._children?.push({
            rawData: {
              ...classroomItem,
            },
            id: lesson.timekeepingId,
            lessonId: lesson._id,
            lessonName: lesson.name,
            lessonCode: lesson.code,
            classroomId: lesson.classroom,
            classroomName: '',
            date: lesson.date,
            _attributes: {
              expanded: true,
            },
            [new Date(lesson.date as string).getDate() === timekeepingDate.value
              ? `timekeeping.style`
              : `timekeeping.${new Date(lesson.date).getDate()}`]:
              lesson.isAttended && TimeKeepingStatus.PRESENCE,
          });
        } else {
          mockData.value.push({
            rawData: {
              ...lesson,
            },
            id: lesson.timekeepingId,
            lessonId: lesson._id,
            lessonName: lesson.name,
            lessonCode: lesson.code,
            classroomId: lesson.classroom,
            classroomName: classroomItem.name,
            date: lesson.date,
            _attributes: {
              expanded: true,
            },
            _children: undefined,
            [new Date(lesson.date as string).getDate() === timekeepingDate.value
              ? `timekeeping.style`
              : `timekeeping.${new Date(lesson.date).getDate()}`]:
              lesson.isAttended && TimeKeepingStatus.PRESENCE,
          });
        }
      });
    }
  });
};

const generateDataTimekeepingTable = () => {
  Grid.setLanguage('en-US', {
    display: {
      noData: t('teacher.timekeeping.table.noData'),
    },
  });
  Grid.applyTheme('default', {
    outline: {
      // border: '#00000014',
    },
    selection: {
      background: 'rgba(255, 255, 255, 1)',
      border: 'none',
    },
    frozenBorder: {
      border: '#00000014',
    },
    area: {
      body: {
        background: 'rgba(255, 255, 255, 1)',
      },
      header: {
        background: 'rgba(243, 244, 248, 1)',
      },
    },
    cell: {
      disabled: {
        background: 'rgba(255, 255, 255, 1)',
      },
      focusedInactive: {
        border: 'none',
      },
      normal: {
        showHorizontalBorder: true,
        showVerticalBorder: true,
        background: 'rgba(255, 255, 255, 1)',
      },
      focused: {
        background: 'rgba(255, 255, 255, 1)',
        border: 'none',
      },
      selectedHeader: {
        background: 'rgba(243, 244, 248, 1)',
      },
      header: {
        background: 'rgba(243, 244, 248, 1)',
      },
    },
    scrollbar: {
      background: '#fff',
      thumb: '#e1e3e9',
      active: '#e1e3e9',
      emptySpace: 'true',
    },
  });

  const instance = new Grid({
    el: grid.value as HTMLElement,
    disabled: true,
    scrollX: true,
    scrollY: true,
    showDummyRows: true,
    contextMenu: null as unknown as () => MenuItem[][],
    minRowHeight: 52,
    treeColumnOptions: {
      name: 'classroomName',
      useIcon: false,
      useCascadingCheckbox: true,
    },
    columns: gridColumnsOptions.value,
    header: gridHeaderOptions.value,
    data: mockData.value,
    columnOptions: {
      frozenCount: 2,
      minWidth: 52,
    },
    selectionUnit: 'row',
    bodyHeight:
      user.profile?.type === ProfileType.TEACHER
        ? window.innerHeight - 60 - 94 - 165 - 16 //  60: header height, 94: vertical space between header and table header, 165: table header height, 16: margin bottom of table
        : window.innerHeight - 60 - 122 - 165 - 16, // 60: header height, 120: vertical space between header and table header, 164: table header height, 24: margin bottom of table
  });

  const instanceRows = instance.findRows((row) => row);
  instanceRows?.map((row, index) => {
    instance.enableCell(index, `timekeeping.${new Date(row.date as string).getDate()}`);
    if (new Date(row.date as string).getDate() === timekeepingDate.value) {
      instance.enableCell(index, `timekeeping.style`);
    }
  });

  instance.on('collapse', (e) => {
    const { rowKey, instance } = e as unknown as { instance: Grid; rowKey: RowKey };
    const rowOptions = instance.getRow(rowKey);
    if (!rowOptions) {
      return;
    }
    rowOptions._attributes.expanded = false;
    instance.setRow(rowOptions.rowKey, rowOptions);
  });
  instance.on('expand', (e) => {
    const { rowKey, instance } = e as unknown as { instance: Grid; rowKey: RowKey };
    const rowOptions = instance.getRow(rowKey);
    if (!rowOptions) {
      return;
    }
    rowOptions._attributes.expanded = true;
    instance.setRow(rowOptions.rowKey, rowOptions);
  });
  instance.on('click', (async (e: any) => {
    const { columnName, instance, rowKey, targetType } = e as {
      columnName: string;
      instance: Grid;
      rowKey: RowKey;
      targetType: string;
    };
    if (
      targetType !== 'cell' ||
      !columnName.includes('timekeeping') ||
      user.profile?.userRole === Role.USER ||
      isTimekeeping.value
    ) {
      return;
    }
    const rowClicked = instance.getRow(rowKey);
    if (
      rowClicked &&
      rowClicked._disabledPriority[columnName] &&
      role.timekeeping?.create
    ) {
      if (!rowClicked[columnName]) {
        // handle presence
        if (rowClicked.id) {
          // update timekeeping
          isTimekeeping.value = true;
          const res = await store.updateTimekeeping(rowClicked.id as string, true);
          if (res?.success) {
            rowClicked[columnName] = TimeKeepingStatus.PRESENCE;
            store.setCountCheckInTeacher(1);
          } else {
            if (res?.errors?.length) {
              handleErrorTimekeeping(res?.errors?.[0] as IResponseError);
            } else {
              showErrorNotification(t('timekeeping.error.update'));
            }
          }
          isTimekeeping.value = false;
        } else {
          // create timekeeping
          isTimekeeping.value = true;
          const res = await store.createTimekeeping(
            store.selectedTeacherTimekeeping?._id as string,
            rowClicked.lessonId as string,
            true,
          );
          if (res?.success) {
            rowClicked.id = res.data?._id;
            rowClicked[columnName] = TimeKeepingStatus.PRESENCE;
            store.setCountCheckInTeacher(1);
          } else {
            if (res?.errors?.length) {
              handleErrorTimekeeping(res?.errors?.[0] as IResponseError);
            } else {
              showErrorNotification(t('timekeeping.error.update'));
            }
          }
          isTimekeeping.value = false;
        }
      } else {
        // handle absence
        isTimekeeping.value = true;
        const res = await store.updateTimekeeping(rowClicked.id as string, false);
        if (res?.success) {
          rowClicked[columnName] = undefined;
          store.setCountCheckInTeacher(-1);
        } else {
          if (res?.errors?.length) {
            handleErrorTimekeeping(res?.errors?.[0] as IResponseError);
          } else {
            showErrorNotification(t('timekeeping.error.update'));
          }
        }
        isTimekeeping.value = false;
      }
    }
    instance.setRow(rowKey, rowClicked as Row);
  }) as unknown as GridEventListener);
  gridInstance.value = instance;
};

const gridHeaderOptions = computed<HeaderOptions>(() => {
  const es = {
    height: 104,
    complexColumns: [
      {
        header: t('teacher.timekeeping.table.month', {
          month:
            dayjs(store.selectedMonth).format('MM-YYYY') ||
            dayjs(new Date()).format('MM-YYYY'),
        }),
        name: 'month',
        childNames: [
          ...range(1, dayjs(store.selectedMonth).daysInMonth() + 1).map(
            (d) => `timekeeping.${d.toString()}`,
          ),
          'timekeeping.style',
        ],
      },
    ],
  };
  return es;
});
const gridColumnsOptions = computed<ColumnOptions[]>(() => [
  {
    header: t('teacher.timekeeping.table.classroom'),
    name: 'classroomName',
    minWidth: 200,
    align: 'left',
  },
  {
    header: t('teacher.timekeeping.table.lesson'),
    name: 'lessonCode',
    minWidth: 120,
    align: 'center',
  },

  ...range(1, dayjs(store.selectedMonth).daysInMonth() + 1).map((x) => {
    return {
      header: x.toString().padStart(2, '0'),
      name:
        x === timekeepingDate.value ? `timekeeping.style` : `timekeeping.${x.toString()}`,
      renderer: {
        type: CheckMarkRenderer,
      },
    };
  }),
]);

watch(gridHeaderOptions, (options) => {
  gridInstance.value?.setHeader(options);
});

watch(gridColumnsOptions, (options) => {
  gridInstance.value?.setColumns(options);
});

const gridInstance = ref<Grid>();
onMounted(async () => {
  await fetchData();
  generateDataTimekeepingTable();
  scrollTeacherTable.value = (tableTeacher.value as any)?.$el.getElementsByClassName(
    'v-table__wrapper',
  )[0];
  scrollTeacherTable.value.addEventListener('scroll', handleScrollTeacherTable);
});

const handleScrollTeacherTable = async () => {
  if (
    scrollTeacherTable.value.scrollTop + scrollTeacherTable.value.clientHeight ===
    scrollTeacherTable.value.scrollHeight
  ) {
    if (store.totalTeacherPages > (store.teacherListQuery.page as number)) {
      store.setPage((store.teacherListQuery.page as number) + 1);
      await store.fetchScrollTeacherTimekeeping();
    }
  }
};

onBeforeUnmount(() => {
  gridInstance.value?.destroy();
  store.selectedMonth = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  };
  scrollTeacherTable.value.removeEventListener('scroll', handleScrollTeacherTable);
});

const handleErrorTimekeeping = (error: IResponseError) => {
  const { errorCode = undefined, key = undefined } = error;
  const i18nKey = `timekeeping.update.${errorCode}.${key}`;
  showErrorNotification(t(i18nKey));
};

const handleClickTeacherTimekeeping = async (data: ITeacherTimekeeping) => {
  store.setSelectedTeacherTimekeeping(data);
  const resTimekeeping = await store.fetchTimekeepingEntries();
  if (resTimekeeping?.success) {
    gridInstance.value?.destroy();
    mockData.value = [];
    setDataTimekeepingTable(resTimekeeping.data);
    generateDataTimekeepingTable();
  }
};

watch(
  () => store.selectedMonth,
  async () => {
    const resTeacher = await store.fetchTeacherTimekeeping();
    if (resTeacher?.success) {
      store.setSelectedTeacherTimekeeping(
        resTeacher.data.items[0] as unknown as ITeacherTimekeeping,
      );
    }
    if (!store.selectedTeacherTimekeeping?._id) {
      gridInstance.value?.destroy();
      mockData.value = [];
      setDataTimekeepingTable([]);
      generateDataTimekeepingTable();

      return;
    }
    const resTimekeeping = await store.fetchTimekeepingEntries();
    gridInstance.value?.destroy();
    mockData.value = [];
    setDataTimekeepingTable(resTimekeeping.data);
    generateDataTimekeepingTable();
  },
);

watch(
  () => hideTeacher.value,
  async () => {
    if (!store.selectedTeacherTimekeeping?._id) {
      gridInstance.value?.destroy();
      mockData.value = [];
      setDataTimekeepingTable([]);
      generateDataTimekeepingTable();
      return;
    }
    const resTimekeeping = await store.fetchTimekeepingEntries();
    if (resTimekeeping?.success) {
      gridInstance.value?.destroy();
      mockData.value = [];
      setDataTimekeepingTable(resTimekeeping.data);
      generateDataTimekeepingTable();
    }
  },
);

watch(
  () => sidebar.rail,
  async () => {
    debounce(async () => {
      if (!store.selectedTeacherTimekeeping?._id) {
        gridInstance.value?.destroy();
        mockData.value = [];
        setDataTimekeepingTable([]);
        generateDataTimekeepingTable();
        return;
      }
      const resTimekeeping = await store.fetchTimekeepingEntries();
      if (resTimekeeping?.success) {
        gridInstance.value?.destroy();
        mockData.value = [];
        setDataTimekeepingTable(resTimekeeping.data);
        generateDataTimekeepingTable();
      }
    }, 300)();
  },
);

const updatePage = async (value: number) => {
  if (value > store.totalTeacherPages) {
    store.setPage(1);
  } else {
    store.setPage(value);
  }
  store.fetchTeacherTimekeeping();
};

const onChangeOrder = async ({ field, direction }: ITableSorter) => {
  store.setOrder({ [field]: direction });
  store.fetchTeacherTimekeeping();
};

const cursorOfEnabledCell = computed(() =>
  role.timekeeping?.create ? 'pointer' : 'default',
);

onUnmounted(() => {
  store.teacherListQuery.page = 1;
});
</script>
<template>
  <v-row class="mt-4">
    <v-col v-if="!isTeacher" cols="12" class="collapse">
      <v-checkbox v-model="hideTeacher" class="collapse-checkbox" />
      <div class="collapse-text">{{ $t('timekeeping.hideTeacher') }}</div>
    </v-col>
    <v-col v-if="!hideTeacher" cols="4">
      <v-card class="pa-0 ml-4">
        <TableHeader
          :total="store.totalTeacherPages"
          :page="store.teacherListQuery.page || 1"
          :title="$t('teacher.total', { total: store.totalTeachers })"
          @change-page="updatePage"
          :leftTitle="$t('teacher.timekeeping.table.teacherList')"
          :show-total="false"
        />
        <TableBase
          class="teacher-table"
          :is-empty="!store.totalTeacherPages"
          ref="tableTeacher"
        >
          <template #thead>
            <tr>
              <SortTableColumnHeader
                name="code"
                :title="t('teacher.timekeeping.table.idTeacher')"
                :order-by="store.teacherListQuery.orderBy"
                :direction="store.teacherListQuery.orderDirection"
                @change="onChangeOrder"
              />

              <th class="text-left ws-nowrap minW-140px w-40">
                {{ t('teacher.timekeeping.table.name') }}
              </th>
              <th class="text-left ws-nowrap">
                {{ t('teacher.timekeeping.table.attendance') }}
              </th>
            </tr>
          </template>
          <template #tbody>
            <tr
              v-for="(teacher, index) in store.teacherTimekeeping"
              :key="index"
              :class="{
                active: store.selectedTeacherTimekeeping?._id === teacher._id,
              }"
              @click="
                handleClickTeacherTimekeeping({
                  _id: teacher._id,
                  code: teacher.code,
                  name: teacher.name,
                  countCheckIn: teacher.countCheckIn,
                  totalLessons: teacher.totalLessons,
                })
              "
            >
              <td class="text-left ws-nowrap">
                {{ teacher.code }}
              </td>
              <EllipsisTableData :text="teacher.name" />
              <td class="text-left ws-nowrap">
                {{ `${teacher.countCheckIn}/${teacher.totalLessons}` }}
              </td>
            </tr>
          </template>
        </TableBase>
        <LoadingOverlay :loading="store.isFetchingTeacherTimekeeping" />
      </v-card>
    </v-col>
    <v-col :cols="hideTeacher ? 12 : 8">
      <v-card
        :class="hideTeacher ? `mx-4 pa-0 table-container` : `mr-4 pa-0 table-container`"
      >
        <div class="timekeeping-header">
          <div class="header-wrapper">
            <span class="text-bold">
              {{
                store.selectedTeacherTimekeeping?.name
                  ? `${store.selectedTeacherTimekeeping?.name}`
                  : ''
              }}</span
            >
            <span class="text-bold">
              {{
                store.selectedTeacherTimekeeping?.code
                  ? ` (${store.selectedTeacherTimekeeping?.code}) `
                  : ''
              }}</span
            >
            <span class="text-bold">
              {{
                store.selectedTeacherTimekeeping?.countCheckIn !== undefined &&
                store.selectedTeacherTimekeeping?.totalLessons !== undefined
                  ? `${t('timekeeping.teacherPresence')}${
                      store.selectedTeacherTimekeeping?.countCheckIn
                    }/${store.selectedTeacherTimekeeping?.totalLessons}`
                  : ''
              }}</span
            >
          </div>
          <div class="tbl-header-title">
            <v-chip variant="text" class="tbl-header-text">
              <span class="text-bold"
                >{{ $t('teacher.timekeeping.table.header.presence') }}:</span
              >
              <template #append>
                <v-icon icon="mdi-check" color="green" :size="22" class="ml-2"></v-icon>
              </template>
            </v-chip>
            <v-chip variant="text" class="tbl-header-text">
              <span class="text-bold"
                >{{ $t('teacher.timekeeping.table.header.confirmDate') }}:</span
              >
              <template #append>
                <v-icon
                  icon="mdi-square-rounded "
                  color="yellow"
                  :size="22"
                  class="ml-2"
                ></v-icon>
              </template>
            </v-chip>
          </div>
        </div>
        <div ref="grid" class="timekeeping-table"></div>
        <LoadingOverlay :loading="store.isFetching" />
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.active {
  background-color: #f4f7ff;
}

:deep(.v-table__wrapper) {
  height: calc(
    100vh - $offset-table-height-in-list - 40px
  ) !important; //40px: height of hideTeacher checkbox
}
.teacher-table {
  border-bottom-left-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}

:deep(.table-header) {
  box-shadow: none;
  padding-right: 8px;
  padding-left: 8px;
  height: 60px;
}

:deep(.separate) {
  margin: 0 !important;
  white-space: nowrap;
}

:deep(.tui-grid-cell) {
  font-family: 'Be Vietnam Pro';
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  color: $color-text-black;
}

:deep(.tui-grid-cell-header) {
  font-weight: 500;
}

.tbl-header-title {
  display: flex;
  flex-wrap: nowrap;
}
.tbl-header-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: right;
}

:deep(.tui-grid-tree-depth) {
  top: 6px;
}

:deep(.tui-grid-header-area) {
  border-color: #00000014;
}

:deep(.tui-grid-rside-area) {
  .tui-grid-body-area {
    width: 100% !important ;
  }
}

:deep(.tui-grid-scrollbar-left-bottom) {
  border-left: none;
  border-right: none;
}

:deep(.tui-grid-border-line-left, .tui-grid-border-line-right, ) {
  border: none;
}

:deep(.tui-grid-border-line-top) {
  border-top: 1px solid #ebebeb;
}

:deep(.tui-grid-content-area) {
  border: none;
}

:deep(.tui-grid-scrollbar-y-outer-border) {
  width: 0;
}

:deep(.tui-grid-scrollbar-left-bottom) {
  background-color: #fff;
}

:deep(.tui-grid-scrollbar-right-top) {
  background-color: #f3f4f8;
  border-right: none;
}

:deep(.tui-grid-scrollbar-right-bottom) {
  width: 17px;
  background-color: #fff;
  border-right: none;
}

:deep(
    .tui-grid-cell:not(
        .tui-grid-cell-disabled,
        .tui-grid-cell-dummy,
        .tui-grid-cell-header
      )
  ) {
  cursor: v-bind(cursorOfEnabledCell);
  background-color: rgba(244, 247, 255, 1);
}

.timekeeping-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14.5px 16px;
  font-size: 14px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border: 1px solid #00000014;
  border-bottom: none;
  overflow: hidden;
  .header-wrapper {
    height: 21px;
    overflow: hidden;
  }
}

.timekeeping-table {
  border-left: 1px solid #00000014;
  border-right: 1px solid #00000014;
  border-bottom: 1px solid #00000014;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow: hidden;
}

.text-bold {
  font-weight: 500;
  color: rgb(27, 27, 51);
}

.collapse {
  height: 40px;
  width: 40px;
  margin: -6px 0;
  padding: 0;
  display: flex;
  align-items: center;
  :deep(.v-input) {
    flex: 0;
  }
  .collapse-checkbox {
    margin-left: 32px;
    height: 40px;
    display: flex;
    align-items: center;
  }
  .collapse-text {
    font-size: 14px;
    font-weight: 500;
    color: rgb(27, 27, 51);
  }
}

:deep(.tui-grid-cell-header[data-column-name='classroomName']) {
  text-align: left !important;
  padding-left: 36px;
}

:deep(.tui-grid-cell-header[data-column-name='timekeeping.style']) {
  background-color: #fadb14 !important;
}

:deep(.tui-grid-layer-state-content) {
  p {
    position: absolute;
    top: 22px;
    color: #1b1b33;
    font-size: 15px;
    font-weight: 400;
    font-family: Be Vietnam Pro;
  }
}

:deep(.tui-grid-cell-content) {
  text-overflow: ellipsis;
}

:deep(.tui-grid-rside-area) {
  width: auto !important;
}
</style>
