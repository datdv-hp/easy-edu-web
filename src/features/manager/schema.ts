import {
  emailSchema,
  dobSchema,
  genderSchema,
  phoneSchema,
  userNameSchema,
} from '@/common/schema';
import yup from '@/plugins/yup';

export const managerFormSchema = yup.object({
  name: userNameSchema.label('managerForm.name'),
  email: emailSchema.required(),
  dob: dobSchema.required(),
  gender: genderSchema.required(),
  phone: phoneSchema.required(),
  avatar: yup.string().nullable(),
  isTeacher: yup.boolean().default(false),
  managerDetail: yup.object({
    signedContractDate: yup.string(),
  }),
  roleId: yup.string().required().label('role'),
  teacherDetail: yup.object({
    degree: yup.string().optional(),
    subjectIds: yup.array().of(yup.string()).optional(),
    signedContractDate: yup.string().optional(),
    note: yup.string().optional(),
    identity: yup.string().optional(),
    nationality: yup.string().optional(),
  }),
});
