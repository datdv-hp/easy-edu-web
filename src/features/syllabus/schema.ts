import { FORM_VALIDATION } from '@/common/constants';
import yup from '@/plugins/yup';
import { MAX_NUMBER_OF_FILES_PER_LECTURE } from './constants';
import { isEmpty } from 'lodash';

export const nameSchema = yup.string().max(FORM_VALIDATION.textMaxLength);
export const syllabusCoverImageSchema = yup.string().url().nullable().optional();
export const lectureFileSchema = yup.object({
  name: nameSchema.required(),
  mimeType: yup.string().required(),
  link: yup
    .string()
    .url()
    .when(['isSuccess', 'isUploading'], ([isSuccess, isUploading], schema) => {
      if (isSuccess === false || isUploading === true) {
        return schema.optional();
      }
      return schema.required(' ');
    }),
  isSuccess: yup.boolean().optional(),
  isUploading: yup.boolean().optional(),
});
export const lectureLinkSchema = yup
  .string()
  .url('common.error.invalidLink')
  .optional()
  .nullable()
  .label('syllabusForm.links');
export const syllabusLectureSchema = yup.object({
  name: yup
    .string()
    .required()
    .max(FORM_VALIDATION.textMaxLength)
    .label('syllabusForm.lectureName'),
  files: yup
    .array()
    .of(lectureFileSchema)
    .max(MAX_NUMBER_OF_FILES_PER_LECTURE, {
      i18nKey: 'common.error.limitFiles',
      params: {
        maxFiles: MAX_NUMBER_OF_FILES_PER_LECTURE,
      },
    })
    .label('syllabusForm.files')
    .when('referenceLinks', ([referenceLinks], schema) => {
      const validLinks = referenceLinks?.filter((link) => !isEmpty(link));
      if (validLinks?.length) {
        return schema.optional();
      } else {
        return schema.required().min(1, ' ');
      }
    })
    .test({
      test: function (files) {
        const invalidFile = files?.find(
          (file) => file?.isSuccess === false || file?.isUploading === true,
        );
        if (invalidFile) {
          return false;
        }
        return true;
      },
      message: ' ',
    }),
  referenceLinks: yup
    .array()
    .of(lectureLinkSchema)
    .label('syllabusForm.links')
    .optional(),
});

export const createSyllabusFormSchema = yup.object({
  name: nameSchema.required().label('syllabusForm.syllabusName'),
  image: syllabusCoverImageSchema.label('syllabusForm.coverImage'),
  lectures: yup.array().of(syllabusLectureSchema.required()).required().min(1),
});

export const createLectureFormSchema = yup.object({
  note: yup.string().required().max(500).label('syllabusForm.editNote'),
  lectures: yup.array().of(syllabusLectureSchema.required()).required().min(1),
});
export const updateLectureFormSchema = yup.object({
  note: yup.string().required().max(500).label('syllabusForm.editNote'),
  lectures: yup.array().of(syllabusLectureSchema.required()).optional().min(1),
});

export const updateBasicSyllabusInfoFormSchema = yup.object({
  name: nameSchema.required().label('syllabusForm.syllabusName'),
  image: syllabusCoverImageSchema.label('syllabusForm.coverImage'),
});
