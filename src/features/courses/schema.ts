import { FORM_VALIDATION } from '@/common/constants';
import yup from '@/plugins/yup';
import { MAX_TIMES, MIN_TIMES } from './contants';

export const coursesFormSchema = yup.object({
  name: yup
    .string()
    .required()
    .trim()
    .min(FORM_VALIDATION.textMinLength)
    .max(FORM_VALIDATION.textMaxLength)
    .label('courses.name'),
  times: yup
    .number()
    .min(MIN_TIMES, 'courses.validate.minTimes')
    .max(MAX_TIMES, 'courses.validate.maxTimes')
    .required()
    .label('courses.time'),
  description: yup
    .string()
    .optional()
    .max(FORM_VALIDATION.textAreaMaxLength)
    .label('courses.description'),
  subjectIds: yup.array().optional().label('courses.subjects'),
  courseType: yup.array().optional().nullable().label('courses.courseType'),
});
