import { FORM_VALIDATION } from '@/common/constants';
import yup from '@/plugins/yup';
import { LessonRepeatOption } from '../schedule-tracking/constants';

export const timeListSchema = yup
  .array()
  .of(
    yup.object().shape({
      repeatOption: yup
        .string()
        .oneOf([...Object.values(LessonRepeatOption)])
        .required()
        .label('lesson.repeatOption'),
      startDate: yup.string().required().label('lesson.startDate'),
      startTime: yup.object().required().label('lesson.startTime'),
      endTime: yup.object().required().label('lesson.endTime'),
      endDate: yup
        .string()
        .when('repeatOption', ([repeatOption], schema) => {
          return repeatOption !== LessonRepeatOption.NO_REPEAT
            ? schema.required()
            : schema.optional();
        })
        .label('lesson.endDate'),
      repeatDays: yup
        .array(yup.number().min(0).max(6))
        .when('repeatOption', ([repeatOption], schema) => {
          return repeatOption === LessonRepeatOption.OTHER_REPEAT
            ? schema.min(1).max(7).required()
            : schema.optional();
        })
        .label('lesson.repeatDays'),
    }),
  )
  .min(1)
  .required()
  .label('lesson.timeList');

export const createLessonFormSchema = yup.object({
  name: yup.string().required().max(FORM_VALIDATION.textMaxLength).label('lesson.name'),
  teacherId: yup.string().required().label('lesson.teacher'),
  subjectId: yup.string().optional().nullable().label('lesson.subject'),
  classroomId: yup.string().required().label('lesson.classroom'),
  syllabusId: yup.string().optional().nullable().label('lesson.syllabus'),
  lectureIds: yup
    .array(yup.string())
    .label('lesson.lecture')
    .transform((value) => {
      return value?.length ? value : undefined;
    })
    .when('syllabusId', ([syllabusId], schema) => {
      return syllabusId ? schema.required() : schema.optional();
    }),
  isUseGoogleMeet: yup.boolean(),
  room: yup.string().when('isUseGoogleMeet', ([isUseGoogleMeet], schema) => {
    return isUseGoogleMeet
      ? schema.optional().nullable()
      : schema.required().label('lesson.room');
  }),
  documents: yup
    .array()
    .of(yup.string().max(FORM_VALIDATION.textMaxLength).url('common.error.invalidLink'))
    .label('lesson.documents'),
  timeList: timeListSchema,
});
export const updateLessonFormSchema = yup.object({
  name: yup.string().required().max(FORM_VALIDATION.textMaxLength).label('lesson.name'),
  teacherId: yup.string().required().label('lesson.teacher'),
  subjectId: yup.string().optional().nullable().label('lesson.subject'),
  classroomId: yup.string().required().label('lesson.classroom'),
  syllabusId: yup.string().optional().nullable().label('lesson.syllabus'),
  lectureIds: yup
    .array(yup.string())
    .label('lesson.lecture')
    .transform((value) => {
      return value?.length ? value : undefined;
    })
    .when('syllabusId', ([syllabusId], schema) => {
      return syllabusId ? schema.required() : schema.optional();
    }),
  isUseGoogleMeet: yup.boolean(),
  room: yup.string().when('isUseGoogleMeet', ([isUseGoogleMeet], schema) => {
    return isUseGoogleMeet
      ? schema.optional().nullable()
      : schema.required().label('lesson.room');
  }),
  documents: yup
    .array()
    .of(yup.string().max(FORM_VALIDATION.textMaxLength))
    .label('lesson.documents'),
  timeList: yup
    .array()
    .of(
      yup.object().shape({
        startDate: yup.string().required().label('lesson.startDate'),
        startTime: yup.object().required().label('lesson.startTime'),
        endTime: yup.object().required().label('lesson.endTime'),
      }),
    )
    .min(1)
    .required()
    .label('lesson.timeList'),
});
