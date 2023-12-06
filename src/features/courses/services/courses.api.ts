import axiosService, { ApiService } from '@/plugins/axios';
import { IBodyResponse } from '@/common/interfaces';
import { getCourseCreateFormData, getCourseUpdateFormData } from '../helpers';

class CourseApiService extends ApiService {
  update(
    id: number | string,
    params: Record<string, unknown>,
  ): Promise<IBodyResponse<any>> {
    return this._update(id, getCourseUpdateFormData(params));
  }

  create(params: Record<string, unknown>): Promise<IBodyResponse<any>> {
    return this._create(getCourseCreateFormData(params));
  }

  detail(id: number | string): Promise<IBodyResponse<any>> {
    return this._getDetail(id);
  }

  moreDetail(id: number | string): Promise<IBodyResponse<Record<string, unknown>>> {
    return this.client.get(`${this.baseUrl}/${id}/detail`);
  }

  bulkDelete(ids: string[]): Promise<IBodyResponse<any>> {
    return this.client.delete(this.baseUrl, { data: ids });
  }

  getDropDown(): Promise<IBodyResponse<any>> {
    return this.client.get(`${this.baseUrl}/dropdown`);
  }

  getSubjectsDropDown(id: string): Promise<IBodyResponse<any>> {
    return this.client.get(`${this.baseUrl}/dropdown/${id}/subjects`);
  }

  getDetailTeachers(id: string): Promise<IBodyResponse<any>> {
    return this.client.get(`${this.baseUrl}/${id}/teacher`);
  }

  getDetailExams(id: string): Promise<IBodyResponse<any>> {
    return this.client.get(`${this.baseUrl}/${id}/exams`);
  }
}

export const courseApiService = new CourseApiService(
  { baseUrl: '/course' },
  axiosService,
);
