import { compact, get } from 'lodash';
import {
  ILectureFile,
  ISyllabus,
  ISyllabusCreateBody,
  ISyllabusDetail,
  ISyllabusEditHistory,
  ISyllabusLecture,
  ISyllabusLectureCreateBody,
  ISyllabusLectureListItem,
  ISyllabusLectureUpdateBody,
  ISyllabusUpdateBody,
} from './interfaces';
import dayjs from '@/plugins/dayjs';
import { DATE_TIME_FORMAT } from '@/common/constants';

export const convertToSyllabusListItem = (params: Record<string, unknown>) => {
  const createdAtUTC = get(params, 'createdAt') as string;
  const updatedAtUTC = get(params, 'updatedAt') as string;
  const isUpdated = !dayjs(createdAtUTC).isSame(updatedAtUTC, 'second');
  return {
    id: get(params, '_id') as string,
    name: get(params, 'name') as string,
    image: get(params, 'image') as string,
    numberOfLectures: get(params, 'numberOfLectures') as number,
    createdAt: dayjs(createdAtUTC).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
    createdBy: get(params, 'createdBy') as string,
    updatedAt: isUpdated
      ? dayjs(updatedAtUTC).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN)
      : '-',
    updatedBy: isUpdated ? (get(params, 'updatedBy') as string) : '-',
  };
};

export const convertToSyllabusList = (params: Record<string, unknown>[]) => {
  return params.map((param) => convertToSyllabusListItem(param));
};

export const convertToSyllabusLectureFile = (params: Record<string, unknown>) => {
  return {
    name: get(params, 'name') as string,
    mimeType: get(params, 'mimeType') as string,
    link: get(params, 'link') as string,
  } as ILectureFile;
};

export const convertToSyllabusLecture = (params: Record<string, unknown>) => {
  const _files = get(params, 'files') as Record<string, unknown>[];
  const _links = get(params, 'referenceLinks', []) as string[];
  return {
    id: get(params, '_id') as string,
    name: get(params, 'name') as string,
    files: _files.map((file) => convertToSyllabusLectureFile(file)),
    referenceLinks: compact(_links),
  } as ISyllabusLecture;
};

export function convertToCreateSyllabusFormData(params: Record<string, unknown>) {
  const _lectures = get(params, 'lectures') as Record<string, unknown>[];
  return {
    name: get(params, 'name') as string,
    image: get(params, 'image') as string,
    lectures: _lectures?.map((lecture) => convertToSyllabusLecture(lecture)),
  } as ISyllabusCreateBody;
}

export function convertToUpdateSyllabusFormData(params: Record<string, unknown>) {
  const _lectures = get(params, 'lectures') as Record<string, unknown>[];
  return {
    name: get(params, 'name') as string,
    image: get(params, 'image') as string,
    lectures: _lectures?.map((lecture) => convertToSyllabusLecture(lecture)),
    note: get(params, 'note') as string,
  } as ISyllabusUpdateBody;
}

export function convertToSyllabusDetail(params: Record<string, unknown>) {
  const createdAtUTC = get(params, 'createdAt') as string;
  const updatedAtUTC = get(params, 'updatedAt') as string;
  const isUpdated = !dayjs(createdAtUTC).isSame(updatedAtUTC, 'second');
  return {
    id: get(params, '_id') as string,
    name: get(params, 'name') as string,
    image: get(params, 'image') as string,
    createdAt: dayjs(get(params, 'createdAt') as string).format(
      DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN,
    ),
    createdBy: get(params, 'createdBy') as string,
    updatedAt: isUpdated
      ? dayjs(updatedAtUTC).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN)
      : '-',
    updatedBy: isUpdated ? (get(params, 'updatedBy') as string) : '-',
  } as ISyllabusDetail;
}

export const convertSyllabusInfo = (params: Record<string, unknown>) => {
  return {
    id: get(params, '_id') as string,
    name: get(params, 'name') as string,
  } as ISyllabus;
};

export const convertToSyllabusLectureListItem = (params: Record<string, unknown>) => {
  const _files = get(params, 'files', []) as Record<string, unknown>[];
  const _syllabus = get(params, 'syllabusId', undefined) as Record<string, unknown>;
  return {
    id: get(params, '_id') as string,
    name: get(params, 'name') as string,
    files: _files.map((file) => convertToSyllabusLectureFile(file)),
    referenceLinks: get(params, 'referenceLinks', []) as string[],
    syllabus: _syllabus ? convertSyllabusInfo(_syllabus) : undefined,
  } as ISyllabusLectureListItem;
};

export function convertToSyllabusLectureList(params: Record<string, unknown>[]) {
  return params?.map((lecture) => convertToSyllabusLectureListItem(lecture)) || [];
}

export function convertToCreateLectureFormData(params: Record<string, unknown>) {
  const _lectures = get(params, 'lectures') as Record<string, unknown>[];
  return {
    syllabusId: get(params, 'syllabusId') as string,
    lectures: _lectures?.map((lecture) => convertToSyllabusLecture(lecture)),
    note: get(params, 'note') as string,
  } as ISyllabusLectureCreateBody;
}

export function convertToLecturesInUpdateForm(params: Record<string, unknown>) {
  const _files = get(params, 'files') as Record<string, unknown>[];
  const _links = get(params, 'referenceLinks', []) as string[];
  return {
    name: get(params, 'name') as string,
    files: _files.map((file) => convertToSyllabusLectureFile(file)),
    referenceLinks: compact(_links),
    lectureId: get(params, 'id') as string,
  };
}

export function convertToUpdateLectureFormData(params: Record<string, unknown>) {
  const _lectures = get(params, 'lectures') as Record<string, unknown>[];
  return {
    lectures: _lectures?.map((lecture) => convertToLecturesInUpdateForm(lecture)),
    note: get(params, 'note') as string,
  } as ISyllabusLectureUpdateBody;
}

export function convertToUpdateHistoryListItem(params: Record<string, unknown>) {
  return {
    id: get(params, '_id') as string,
    updatedAt: dayjs(get(params, 'createdAt') as string).format(
      DATE_TIME_FORMAT.YYYY_MM_DD_HH_MM_SS_HYPHEN,
    ),
    updatedBy: get(params, 'updatedBy') as string,
    note: get(params, 'note') as string,
  } as ISyllabusEditHistory;
}
export function convertToUpdateHistoryList(params: Record<string, unknown>[]) {
  return params?.map((record) => convertToUpdateHistoryListItem(record)) || [];
}

export function validateLecturesEmpty(lectures: ISyllabusLecture[]) {
  if (!lectures?.length) return { valid: false, errorIndexes: [] };
  const errorIndexes: number[] = [];
  lectures.forEach((lecture, index) => {
    if (!lecture.files?.length && !compact(lecture.referenceLinks)?.length) {
      errorIndexes.push(index);
    }
  });

  return { valid: !errorIndexes.length, errorIndexes };
}

export function checkDuplicateLecturesName(lectures: ISyllabusLecture[]) {
  if (!lectures?.length) return { valid: false, errorIndexes: [] };
  const lectureNames = lectures.map((lecture) => lecture.name?.trim());
  const errorIndexes: number[] = [];
  lectureNames.forEach((item, index) => {
    if (lectureNames.indexOf(item) !== index) {
      errorIndexes.push(index);
    }
  });
  return { valid: !!errorIndexes.length, errorIndexes };
}

export function fileLinkFromUrl(url: string) {
  const { origin, pathname } = new URL(url);
  const imageUrl = origin + pathname;
  return imageUrl;
}

export function fileSizeInMB(number: number) {
  return number / 1048576; // bytes to MB
}
