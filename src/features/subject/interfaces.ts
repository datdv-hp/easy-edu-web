export interface IDocument {
  name: string;
  link: string;
}

export interface ISubject {
  id: string;
  name: string;
  code: string;
  subjectCode: string;
  description?: string;
  documents?: IDocument[];
}

export interface ICreateSubjectForm {
  name: string;
  subjectCode: string;
  description?: string;
  documents: IDocument[];
}

export interface IUpdateSubjectForm {
  name?: string;
  subjectCode?: string;
  description?: string;
  documents?: IDocument[];
}
