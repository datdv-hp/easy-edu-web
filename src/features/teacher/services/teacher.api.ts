import { ApiService } from '@/plugins/axios/api';
import axiosService from '../../../plugins/axios';
import { IBodyResponse, ICommonListQuery, IGetListResponse } from '@/common/interfaces';
import { getTeacherCreateFormData, getTeacherUpdateFormData } from '../helpers';
import { ITeacher, ITeacherClass } from '../interfaces';
import { ISubject } from '@/features/subject/interfaces';

class TeacherApiService extends ApiService {
  update(
    id: number | string,
    params: Record<string, unknown>,
  ): Promise<IBodyResponse<any>> {
    return this._update(id, getTeacherUpdateFormData(params));
  }

  create(params: Record<string, unknown>): Promise<IBodyResponse<any>> {
    return this._create(getTeacherCreateFormData(params));
  }

  detail(id: number | string) {
    return this._getDetail<IBodyResponse<Record<string, unknown>>>(id);
  }

  delete(id: number | string): Promise<IBodyResponse<any>> {
    return this._delete(id);
  }

  bulkDelete(ids: string[]): Promise<IBodyResponse<any>> {
    return this.client.delete(this.baseUrl, { data: ids });
  }

  getDropDown(): Promise<IBodyResponse<ITeacher[]>> {
    return this.client.get(`/dropdown/teacher`);
  }

  _getDropDownSubject(id: number | string): Promise<IBodyResponse<ISubject[]>> {
    return this.client.get(`/subject/dropdown`, { params: { classroomId: id } });
  }

  _getListClass(id: number | string): Promise<IBodyResponse<any>> {
    return this.client.get(`/teacher/${id}/classes-more-detail`);
  }

  getClassListByTeacherId(
    id: string,
    queryString: ICommonListQuery,
  ): Promise<IBodyResponse<IGetListResponse<ITeacherClass>>> {
    return this.client.get(`${this.baseUrl}/${id}/class`, {
      params: queryString,
    });
  }
}
export const teacherApiService = new TeacherApiService(
  { baseUrl: '/teacher' },
  axiosService,
);
