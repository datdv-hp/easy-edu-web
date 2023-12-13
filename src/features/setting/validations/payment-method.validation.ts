import { FORM_VALIDATION } from '@/common/constants';
import yup from '@/plugins/yup';

export const paymentMethodFormSchema = yup.object({
    name: yup
        .string()
        .max(FORM_VALIDATION.textMaxLength)
        .required()
        .label('paymentMethodForm.name'),
});
