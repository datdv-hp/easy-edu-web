import type { IBodyResponse } from '@/common/interfaces';
import { ApiService } from '@/plugins/axios/api';
import { AxiosRequestConfig } from 'axios';
import axiosService from '../../../plugins/axios';
import { RoleType } from '@/common/constants';

class CommonAPIService extends ApiService {
  _getUploadSignedUrl(
    _contentType: string,
  ): Promise<IBodyResponse<{ signedUrl: string }>> {
    return this.client.post(`/avatar/presigned-url`, {
      contentType: _contentType,
    });
  }
  _uploadFile(
    _url: string,
    _file: File,
    config = {} as AxiosRequestConfig,
  ): Promise<IBodyResponse<null>> {
    return this.client.put(_url, _file, {
      ...config,
      headers: {
        'Content-Type': _file.type,
        Authorization: undefined,
      },
    });
  }
  _getUploadSyllabusSignedUrl(
    _contentType: string,
    config = {} as AxiosRequestConfig,
  ): Promise<IBodyResponse<{ signedUrl: string }>> {
    return this.client.post(
      `/syllabus/presigned-url`,
      {
        contentType: _contentType,
      },
      config,
    );
  }
  _getUploadSyllabusCoverSignedUrl(
    _contentType: string,
    config = {} as AxiosRequestConfig,
  ): Promise<IBodyResponse<{ signedUrl: string }>> {
    return this.client.post(
      `/syllabus-cover/presigned-url`,
      {
        contentType: _contentType,
      },
      config,
    );
  }
  _getSyllabusDropdown() {
    return this.client.get('/dropdown/syllabus') as Promise<
      IBodyResponse<Record<string, unknown>[]>
    >;
  }
  _deleteUploadedFiles(urls: string[]): Promise<IBodyResponse<any>> {
    return this.client.delete('/uploaded-file', { data: { urls } });
  }
  _getSubjectDropdown(params?: {
    courseId?: string;
    classroomId?: string;
  }): Promise<IBodyResponse<Record<string, string>[]>> {
    return this.client.get(`/dropdown/subject`, {
      params,
    });
  }

  _getManagerDropdown(): Promise<IBodyResponse<Record<string, unknown>[]>> {
    return this.client.get('/dropdown/manager');
  }

  _getCourseTypeDropdown() {
    return this.client.get(`/dropdown/course-form`) as Promise<
      IBodyResponse<Record<string, string>[]>
    >;
  }
  _getRoleDropdown(type?: RoleType): Promise<IBodyResponse<Record<string, unknown>[]>> {
    return this.client.get('/dropdown/role', { params: { type } });
  }
  _getCourseDropdown(): Promise<IBodyResponse<Record<string, unknown>[]>> {
    return this.client.get('/dropdown/course');
  }
  getSyllabusDropdownByClassroomId(
    classroomId: string,
  ): Promise<IBodyResponse<Record<string, unknown>[]>> {
    return this.client.get(`/dropdown/syllabus-by-classroom/${classroomId}`);
  }
  getLectureDropdownBySyllabusId(
    syllabusId: string,
  ): Promise<IBodyResponse<Record<string, unknown>[]>> {
    return this.client.get(`/dropdown/lectures-by-syllabus/${syllabusId}`);
  }

  _getTeacherDropdown(): Promise<IBodyResponse<Record<string, unknown>[]>> {
    return this.client.get(`/dropdown/teacher`);
  }
  _getClassroomDropdown(): Promise<IBodyResponse<Record<string, unknown>[]>> {
    return this.client.get(`/dropdown/classroom`);
  }
  _getPromotionDropdown(params: {
    courseId: string;
  }): Promise<IBodyResponse<Record<string, unknown>[]>> {
    return this.client.get('/dropdown/promotion', { params });
  }
  _getPresenterDropdown(): Promise<IBodyResponse<Record<string, unknown>[]>> {
    return this.client.get('/dropdown/presenter');
  }
  _getPaymentMethodDropdown(): Promise<IBodyResponse<Record<string, unknown>[]>> {
    return this.client.get('/dropdown/payment-method');
  }
}

export const commonApiService = new CommonAPIService(
  {
    baseUrl: '',
  },
  axiosService,
);
