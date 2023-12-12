import { emailSchema, nameSchema, phoneSchema } from '@/common/schema';
import yup from '@/plugins/yup';

export const registerSchema = yup.object({
  email: emailSchema.required(),
  name: nameSchema.required(),
  phone: phoneSchema.required(),
});
