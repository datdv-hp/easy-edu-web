import { FORM_VALIDATION } from '@/common/constants';
import Yup from '@/plugins/yup';

export const RoleFormSchema = Yup.object({
    name: Yup.string()
        .required()
        .max(FORM_VALIDATION.textMaxLength)
        .label('authorizationForm.name'),
    description: Yup.string().optional().max(FORM_VALIDATION.textAreaMaxLength),
    features: Yup.object().required(),
});
