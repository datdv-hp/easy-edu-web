import {
  DATE_TIME_FORMAT,
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
} from '@/common/constants';
import HeaderTooltip from '@/features/classroom/components/HeaderTooltip.vue';
import plugins from '@/plugins';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { App, createApp } from 'vue';
import { ICourse } from '../courses/interfaces';
import { IStudent } from '../student/interfaces';
import { ClassroomStatus, StudentInSubject } from './contants';
import {
  IClassroom,
  IClassroomTimekeepingStudent,
  ICreateClassRoomBody,
  IEvaluationStudentTimekeeping,
  IUpdateClassroomBody,
} from './interfaces';

export const transformClassroom = (data: any[]): IClassroom[] => {
  const transformData = data.map((item) => {
    return convertToClassroom(item);
  });

  return transformData;
};

export const convertToClassroom = (data: Record<string, unknown>): IClassroom => {
  const startDate = get(data, 'startDate', '') as string;
  const endDate = get(data, 'endDate', '') as string;
  return {
    id: get(data, '_id', '') as string,
    code: get(data, 'code', '') as string,
    name: get(data, 'name', '') as string,
    course: get(data, 'course', '') as ICourse,
    dateRange: `${startDate}  -  ${endDate}`,
    startDate,
    endDate,
    participants: get(data, 'participants', '') as IStudent[],
    totalStudents: get(data, 'totalStudents', 0) as number,
    totalLesson: get(data, 'totalLesson', 0) as number,
    status: get(data, 'status') as ClassroomStatus,
    countFinishedLesson: get(data, 'countFinishedLesson', 0) as number,
    countInProgressLesson: get(data, 'countInProgressLesson', 0) as number,
    syllabusIds: get(data, 'syllabusIds') as string[],
    paymentStartDate: data.paymentStartDate as string,
  };
};

export const getClassroomDetail = (data: Record<string, unknown>): IClassroom => {
  return {
    ...convertToClassroom(data),
    countFinishedLesson: get(data, 'countFinishedLesson', 0) as number,
    totalLesson: get(data, 'totalLesson', 0) as number,
  };
};

export const getClassroomFormData = (
  params: Record<string, unknown>,
): ICreateClassRoomBody | IUpdateClassroomBody => {
  const paymentDate = params.paymentDate as Record<string, unknown>;
  return {
    name: params.name as string,
    courseId: params.courseId as string,
    startDate: params.startDate
      ? dayjs(params.startDate as string).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN)
      : undefined,
    endDate: params.endDate
      ? dayjs(params.endDate as string).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN)
      : undefined,
    paymentDate: paymentDate
      ? {
          startDate: dayjs(params.paymentStartDate as string).format(
            DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN,
          ),
          endDate: dayjs(params.paymentEndDate as string).format(
            DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN,
          ),
        }
      : undefined,
    participantIds: params.participantIds as string[],
    color: params.color as string,
    teacherIds: params.teacherIds as string[],
    syllabusIds: params.syllabusIds as string[],
  };
};

export const calculateTableIndex = (index: number, page?: number, limit?: number) => {
  return (
    ((page || DEFAULT_FIRST_PAGE) - 1) * (limit || DEFAULT_LIMIT_FOR_PAGINATION) +
    index +
    1
  );
};

export const transformClassroomTimekeepingList = (
  data: any[],
): IClassroomTimekeepingStudent[] => {
  const transformData = data.map((item) => {
    return convertToClassroomTimekeeping(item);
  });

  return transformData;
};

export const convertToClassroomTimekeeping = (
  data: Record<string, unknown>,
): IClassroomTimekeepingStudent => {
  return {
    id: get(data, '_id', '') as string,
    code: get(data, 'code', '') as string,
    name: get(data, 'name', '') as string,
    timekeeping: get(data, 'timekeeping', {}) as IEvaluationStudentTimekeeping,
  };
};
export class CheckSubscribedRenderer {
  el: Element;
  constructor(props) {
    const el = document.createElement('div');
    el.style.width = '100%';
    el.style.fontSize = '20px';
    el.style.display = 'flex';
    el.style.justifyContent = 'center';
    el.style.alignItems = 'center';
    if (props.value !== null) {
      if (props.value === StudentInSubject.SUBSCRIBED) {
        el.classList.add('mdi');
        el.classList.add('mdi-check');
        el.style.color = 'green';
      }
      if (props.value === StudentInSubject.UNSUBSCRIBED) {
        el.classList.add('mdi');
        el.classList.add('mdi-minus');
        el.style.color = '#ADAEBA';
      }
    }
    this.el = el;
    this.render(props);
  }
  getElement() {
    return this.el;
  }

  render(props) {
    if (props.columnInfo.renderer?.options?.isConfirmDate) {
      (this.el as HTMLDivElement).classList.add('confirmdate');
    }
  }
}

export class CustomColumnHeader {
  el: HTMLElement;
  app?: App<Element>;
  header: any;
  constructor(props) {
    const columnInfo = props.columnInfo;
    const el = document.createElement('div');
    el.addEventListener('mouseenter', () => {
      const _header = this.header ? this.header : columnInfo.header;
      this.app = createApp(HeaderTooltip, { ..._header });
      this.app.use(plugins.vuetify);
      this.app.mount(this.el);
    });
    el.addEventListener('mouseleave', () => {
      this.app?.unmount();
      this.el.textContent = `${this.header?.code || columnInfo.header.code}`;
    });
    el.addEventListener('mousedown', (e: MouseEvent) => {
      e.stopPropagation();
    });
    el.textContent = `${columnInfo.header.code}`;
    this.el = el;
  }

  getElement() {
    return this.el;
  }

  render(props) {
    this.header = props.columnInfo.header;
    this.el.textContent = `${props.columnInfo.header.code}`;
  }
}
