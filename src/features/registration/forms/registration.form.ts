import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { FieldState, useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { registerSchema } from '../schema';
import { RegistrationApi } from '../services';

type IField = 'name' | 'email' | 'phone';

export const useRegisterForm = () => {
  const { t } = useI18n();
  const {
    handleSubmit,
    values: formValue,
    setValues,
    meta,
    validate,
    setFieldValue: _setFieldValue,
    setFieldError: _setFieldError,
    resetForm,
    resetField: _resetField,
  } = useForm({
    validationSchema: registerSchema,
  });
  const {
    value: name,
    setValue: setName,
    errorMessage: nameError,
  } = useField<string>('name');
  const {
    value: email,
    setValue: setEmail,
    errorMessage: emailError,
  } = useField<string>('email');
  const {
    value: phone,
    setValue: setPhone,
    errorMessage: phoneError,
  } = useField<string>('phone');

  const submitForm = handleSubmit(async (values) => {
    const res = await RegistrationApi.register({
      email: values.email,
      name: values.name,
      phone: values.phone,
    });
    if (res.success) {
      showSuccessNotification(t('registration.success.create'));
      return true;
    }
    showErrorNotification(t('registration.error.create'));
    return false;
  });

  const isValidForm = computed(() => meta.value.valid);

  function setFieldValue(field: IField, value: any) {
    _setFieldValue(field, value);
  }

  function setFieldError(field: IField, error: string) {
    _setFieldError(field, error);
  }
  function resetField(field: IField, state?: Partial<FieldState<unknown>> | undefined) {
    _resetField(field, state);
  }

  return {
    submitForm,
    formValue,
    isValidForm,
    validate,
    setValues,
    setFieldValue,
    setFieldError,
    resetField,
    resetForm,
    email,
    setEmail,
    emailError,
    name,
    setName,
    nameError,
    phone,
    setPhone,
    phoneError,
  };
};
