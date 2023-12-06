import { IBodyResponse, ICommonListQuery, IGetListResponse } from '@/common/interfaces';
import axiosService, { ApiService } from '@/plugins/axios';
import { getClassroomFormData } from '../helpers';
import { IClassroomListQuery } from '../interfaces';

class ClassroomApiService extends ApiService {
  update(
    id: number | string,
    params: Record<string, unknown>,
  ): Promise<IBodyResponse<Record<string, unknown>>> {
    return this._update(id, getClassroomFormData(params));
  }

  create(
    params: Record<string, unknown>,
  ): Promise<IBodyResponse<Record<string, unknown>>> {
    return this._create(getClassroomFormData(params));
  }

  detail(id: number | string): Promise<IBodyResponse<any>> {
    return this._getDetail(id);
  }

  getMoreDetail(id: number | string): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.get(`${this.baseUrl}/${id}/detail`);
  }

  getList(
    queryString: IClassroomListQuery,
  ): Promise<IBodyResponse<IGetListResponse<any>>> {
    return this.client.get(this.baseUrl, { params: queryString });
  }

  bulkDelete(ids: string[]): Promise<IBodyResponse<any>> {
    return this.client.delete(this.baseUrl, { data: ids });
  }

  getDropDown(): Promise<IBodyResponse<any>> {
    return this.client.get(`/dropdown/classroom`);
  }

  getStudentAndSubject(id: number | string): Promise<IBodyResponse<any>> {
    return this.client.get(`${this.baseUrl}/${id}/subjects`);
  }

  getClassroomTimekeepingStudentList(classroomId: string): Promise<IBodyResponse<any>> {
    return this.client.get(`${this.baseUrl}/${classroomId}/timekeeping/student`);
  }

  getClassroomTimekeepingTeacherList(classroomId: string): Promise<IBodyResponse<any>> {
    return this.client.get(`${this.baseUrl}/${classroomId}/timekeeping/teacher`);
  }

  checkSyllabuses(syllabusIds: string[]): Promise<IBodyResponse<boolean>> {
    return this.client.post(`${this.baseUrl}/check-syllabus`, syllabusIds);
  }

  getClassroomSyllabusList(
    classroomId: string,
    query: ICommonListQuery,
  ): Promise<IBodyResponse<IGetListResponse<Record<string, unknown>>>> {
    return this.client.get(`${this.baseUrl}/${classroomId}/syllabus`, {
      params: query,
    });
  }
}

export const classroomApiService = new ClassroomApiService(
  { baseUrl: '/classroom' },
  axiosService,
);
