import { defineStore } from 'pinia';
import { commonApiService } from '../services/common.api';

export const useFileStore = defineStore('file', () => {
  async function getUploadSignedUrl(_contentType: string) {
    return await commonApiService._getUploadSignedUrl(_contentType);
  }

  async function uploadFile(_url: string, _file: File) {
    return await commonApiService._uploadFile(_url, _file);
  }

  return {
    getUploadSignedUrl,
    uploadFile,
  };
});
