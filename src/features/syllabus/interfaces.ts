export interface ISyllabus {
  id: string;
  name: string;
}

export interface ISyllabusListItem {
  id: string;
  name: string;
  image?: string;
  numberOfLectures: number;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface ILectureFile {
  name: string;
  mimeType?: string;
  link: string;
}
export interface ISyllabusLecture {
  id?: string;
  name: string;
  files: ILectureFile[];
  referenceLinks?: string[];
}

export interface ISyllabusCreateBody {
  name: string;
  image?: string;
  lectures: ISyllabusLecture[];
}

export interface ISyllabusUpdateBody {
  name?: string;
  image?: string;
  lectures?: ISyllabusLecture[];
  note: string;
}

export interface IFilePreview {
  link?: string;
  name: string;
  mimeType?: string;
  isUploading?: boolean;
  isSuccess?: boolean;
  key?: string;
}

export interface ISyllabusDetail {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ISyllabusLectureListItem {
  id: string;
  name: string;
  files: ILectureFile[];
  referenceLinks?: string[];
  syllabus?: ISyllabus;
}

export interface ISyllabusLectureCreateBody {
  syllabusId: string;
  note: string;
  lectures: ISyllabusLecture[];
}
export interface ISyllabusLectureUpdateBody {
  note?: string;
  lectures?: ISyllabusLecture[];
}

export interface ISyllabusEditHistory {
  id: string;
  updatedAt: string;
  updatedBy: string;
  note: string;
}
