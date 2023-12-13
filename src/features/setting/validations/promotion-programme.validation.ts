import { FORM_VALIDATION } from '@/common/constants';
import yup from '@/plugins/yup';
import { PromotionType } from '../constant';

export const promotionProgrammeFormSchema = yup.object({
    name: yup
        .string()
        .required()
        .max(FORM_VALIDATION.textMaxLength)
        .label('promotion.name'),
    description: yup
        .string()
        .max(FORM_VALIDATION.textAreaMaxLength)
        .label('promotion.description'),
    info: yup
        .object({
            type: yup
                .string()
                .oneOf(Object.values(PromotionType))
                .required()
                .label('promotion.type'),
            value: yup
                .number()
                .required()
                .when('info.type', ([type], schema) => {
                    if (type === PromotionType.PERCENTAGE) {
                        return schema.max(100).label('promotion.value.percentage');
                    } else {
                        return schema.label('promotion.value.fixedAmount');
                    }
                }),
        })
        .required(),
    applyForCourseIds: yup.array().of(yup.string()).label('promotion.applyForCourses'),
    times: yup.number().label('promotion.times').required(),
    startDate: yup.date().label('promotion.startDate').required(),
    endDate: yup.date().label('promotion.endDate').required().min(yup.ref('startDate')),
});
