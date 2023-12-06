import { ApiService } from '@/plugins/axios/api';
import axiosService from '@/plugins/axios';
import { IBodyResponse, ICommonListQuery, IGetListResponse } from '@/common/interfaces';
import { getStudentCreateFormData, getStudentUpdateFormData } from '../helpers';
import { IStudentCourse } from '../interfaces';

export class StudentApiService extends ApiService {
  update(
    id: number | string,
    params: Record<string, unknown>,
  ): Promise<IBodyResponse<any>> {
    return this._update(id, getStudentUpdateFormData(params));
  }

  create(params: Record<string, unknown>): Promise<IBodyResponse<any>> {
    return this._create(getStudentCreateFormData(params));
  }

  detail(id: number | string): Promise<IBodyResponse<any>> {
    return this._getDetail(id);
  }

  bulkDelete(ids: string[]): Promise<IBodyResponse<any>> {
    return this.client.delete(this.baseUrl, { data: ids });
  }

  getDropDown(course: string, subjects: string[]): Promise<IBodyResponse<any>> {
    return this.client.get(`/dropdown/student`, {
      params: {
        course,
        subjects: subjects.join(','),
      },
    });
  }

  getCourseListByStudentId(
    id: string,
    queryString: ICommonListQuery,
  ): Promise<IBodyResponse<IGetListResponse<IStudentCourse>>> {
    return this.client.get(`${this.baseUrl}/${id}/classes`, {
      params: { ...queryString },
    });
  }

  getDropDownByClassroom(classroomId: string): Promise<IBodyResponse<any>> {
    return this.client.get(`/dropdown/student-by-classroom/${classroomId}`);
  }

  getDropDownByCourse(courseId?: string): Promise<IBodyResponse<any>> {
    return this.client.get(`/dropdown/student-by-course/${courseId}`);
  }
}

export const studentApiService = new StudentApiService(
  { baseUrl: `/student` },
  axiosService,
);
