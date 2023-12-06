import { get } from 'lodash';
import {
  ISubject,
  IDocument,
  ICreateSubjectForm,
  IUpdateSubjectForm,
} from './interfaces';
export const transformSubject = (data: any[]): ISubject[] => {
  const transformData = data.map((item) => {
    return convertToSubject(item);
  });
  return transformData;
};

export const convertToSubject = (data: Record<string, unknown>): ISubject => {
  return {
    id: get(data, '_id') as string,
    name: get(data, 'name', '') as string,
    description: get(data, 'description', '') as string,
    code: get(data, 'code', '') as string,
    subjectCode: get(data, 'subjectCode', '') as string,
    documents: get(data, 'documents', []) as IDocument[],
  };
};

export const getSubjectCreateFormData = (
  params: Record<string, unknown>,
): ICreateSubjectForm => {
  const documents = params.documents as IDocument[];
  const _documents = documents?.filter((item) => item.link || item.name);
  return {
    name: (params.name as string)?.trim(),
    description: params.description as string,
    subjectCode: (params.subjectCode as string)?.trim(),
    documents: _documents,
  };
};

export const getSubjectUpdateFormData = (
  params: Record<string, unknown>,
): IUpdateSubjectForm => {
  const documents = params.documents as IDocument[];
  const _documents = documents?.filter((item) => item.link || item.name);
  return {
    name: (params.name as string)?.trim(),
    description: params.description as string,
    subjectCode: (params.subjectCode as string)?.trim(),
    documents: _documents,
  };
};
