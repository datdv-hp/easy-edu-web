import { FORM_VALIDATION, Regex } from '@/common/constants';
import yup from '@/plugins/yup';

export const classCreationFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required()
    .min(3)
    .max(FORM_VALIDATION.textMaxLength)
    .label('classroom.name'),
  startDate: yup.date().required().label('classroom.startDate'),
  endDate: yup
    .date()
    .required()
    .when('startDate', ([startDate], schema) => {
      if (startDate) {
        return schema.min(startDate).typeError('Required');
      } else {
        return schema;
      }
    })
    .label('classroom.endDate'),
  courseId: yup.string().required().label('classroom.course'),
  participantIds: yup.array().nullable().label('classroom.participants'),
  teacherIds: yup.array().nullable().label('classroom.teachers'),
  color: yup.string().matches(new RegExp(Regex.COLOR)).required(),
});
