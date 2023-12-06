import {
  emailSchema,
  dobSchema,
  genderSchema,
  phoneSchema,
  userNameSchema,
} from '@/common/schema';
import yup from '@/plugins/yup';

export const teacherFormSchema = yup.object({
  name: userNameSchema.label('teacher.name'),
  email: emailSchema.required(),
  dob: dobSchema.required(),
  gender: genderSchema.required(),
  phone: phoneSchema.required(),
  avatar: yup.string().nullable(),
  roleId: yup.string().required().label('role'),
  teacherDetail: yup.object({
    degree: yup.string().optional(),
    subjectIds: yup.array().of(yup.string()).optional(),
    signedContractDate: yup.string().optional(),
    note: yup.string().optional(),
    identity: yup.string().optional().label('picIdentity'),
    nationality: yup.string().optional(),
  }),
});

export const rowReviewSubjectsSchema = yup.string().required();

export const rowReviewCommentSchema = yup.string().required();

export const rowReviewSchema = yup.object({
  subjects: rowReviewSubjectsSchema,
  comment: rowReviewCommentSchema,
});

export const reviewFormSchema = yup.array().of(yup.array().of(rowReviewSchema));
export const settingFormSchema = yup.object({
  dateClosed: yup.string().required(),
  date: yup.number().min(1).max(31).optional(),
});
