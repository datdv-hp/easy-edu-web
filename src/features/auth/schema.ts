import { FORM_VALIDATION, Regex } from '@/common/constants';
import yup from '@/plugins/yup';

const emailSchema = yup.string().required().matches(Regex.EMAIL);
const passwordSchema = yup
  .string()
  .required()
  .min(FORM_VALIDATION.passwordMinLength)
  .max(FORM_VALIDATION.textMaxLength);

export const loginWithPasswordSchema = yup.object({
  email: emailSchema,
  password: passwordSchema.matches(Regex.PASSWORD),
});

export const changePasswordSchema = yup.object({
  oldPassword: passwordSchema.matches(Regex.PASSWORD, {
    message: 'auth.validate.password',
  }),
  password: passwordSchema.matches(Regex.PASSWORD, {
    message: 'auth.validate.password',
  }),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'auth.validate.confirmPassword'),
});

export const forgotPasswordSchema = yup.object({
  email: emailSchema,
});
