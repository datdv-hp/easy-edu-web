import {
  emailSchema,
  dobSchema,
  genderSchema,
  phoneSchema,
  degreeSchema,
  userNameSchema,
} from '@/common/schema';
import yup from '@/plugins/yup';

export const studentFormSchema = yup.object({
  picName: userNameSchema,
  email: emailSchema,
  dob: dobSchema.required(),
  gender: genderSchema.required(),
  phone: phoneSchema.required(),
  avatar: yup.string().nullable(),
  roleId: yup.string().required().label('role'),
  studentDetail: yup.object({
    degree: degreeSchema,
    courses: yup
      .array()
      .required()
      .of(
        yup
          .object({
            courseId: yup.string().required().label('studentDetail.courses'),
            subjectIds: yup.array(yup.string()).optional().label('studentDetail.subject'),
          })
          .required(),
      ),
  }),
});
