import yup from '@/plugins/yup';
export const reasonSchema = yup.object({
  reason: yup.string().required().min(3),
});
