import yup from '@/plugins/yup';

export const createPaymentFormSchema = yup.object({
    paymentDate: yup.date().required().label('tuitionFeeForm.paymentDate'),
    paymentMethodId: yup.string().label('tuitionFeeForm.method'),
    value: yup.number().min(0).required().label('tuitionFeeForm.pay'),
});
