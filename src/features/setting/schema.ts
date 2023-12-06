import { FORM_VALIDATION } from '@/common/constants';
import yup from '@/plugins/yup';
import { CriteriaType, TypeScore } from './constant';

export const settingDateTimekeepingFormSchema = yup.object({
  isLastDayOfMonth: yup.boolean(),
  dateTimekeeping: yup
    .string()
    .when('isLastDayOfMonth', ([isLastDayOfMonth], schema) => {
      return isLastDayOfMonth ? schema.optional() : schema.required();
    })
    .label('dateTimekeeping'),
});

export const settingCourseFormSchema = yup.object({
  name: yup.string().required().max(FORM_VALIDATION.textMaxLength).label('courseType'),
});

export const settingCourseTypeArrayFormSchema = yup.object({
  listData: yup.array().of(
    yup.object({
      id: yup.string().optional(),
      name: yup
        .string()
        .required()
        .min(1)
        .max(FORM_VALIDATION.textMaxLength)
        .label('courseType'),
    }),
  ),
});

export const settingEvaluationFormSchema = yup.object({
  name: yup
    .string()
    .required()
    .max(FORM_VALIDATION.textMaxLength)
    .label('evaluationType'),
});

export const settingEvaluationCriteriaFormSchema = yup.object({
  name: yup
    .string()
    .required()
    .max(FORM_VALIDATION.textMaxLength)
    .label('evaluationCriteria'),
  description: yup.string().optional(),
  type: yup.string().required().oneOf(Object.values(CriteriaType)).label('CriteriaType'),
});

export const settingListContent = yup.object({
  isForAllCourse: yup.boolean().required(),
  contents: yup
    .array()
    .of(yup.string().optional().max(FORM_VALIDATION.textMaxLength).label('content')),
  listContents: yup
    .array()
    .of(
      yup.object({
        courseId: yup
          .string()
          .required()
          .max(FORM_VALIDATION.textMaxLength)
          .label('course'),
        contents: yup.array(
          yup.string().optional().max(FORM_VALIDATION.textMaxLength).label('content'),
        ),
      }),
    )
    .optional(),
});

export const settingListRecipe = yup.object({
  formulas: yup.array(
    yup.object({
      courseId: yup
        .string()
        .required()
        .max(FORM_VALIDATION.textMaxLength)
        .label('course'),
      recipe: yup.string().required().max(FORM_VALIDATION.textMaxLength).label('recipe'),
      typeScore: yup
        .string()
        .required()
        .oneOf(Object.values(TypeScore))
        .label('typeScore'),
    }),
  ),
});

export const settingListRecipeScore = yup.object({
  scores: yup.array().of(
    yup.object({
      name: yup.string().required().max(FORM_VALIDATION.nameMaxLength).label('nameScore'),
      to: yup
        .string()
        .required()
        .when('from', ([from], schema) => {
          if ((from && Number(from) < 9999) || Number(from) === 0) {
            return schema.min(Number(from) + 1);
          } else if (Number(from) === 9999) {
            return schema.min(9999);
          } else {
            return schema;
          }
        })
        .max(9999)
        .label('score'),
    }),
  ),
});
