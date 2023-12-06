import { showSuccessNotification } from '@/common/helpers';
import { useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { LoginProvider } from '../auth.constants';
import { loginWithPasswordSchema } from '../schema';
import { useAuthStore } from '../stores';

export const useLoginForm = () => {
  const authStore = useAuthStore();
  const { t } = useI18n();
  const {
    handleSubmit,
    values: formValue,
    setValues,
    meta,
    validate,
  } = useForm({
    validationSchema: loginWithPasswordSchema,
  });
  const {
    value: email,
    setValue: setEmail,
    errorMessage: emailError,
  } = useField<string>('email');
  const {
    value: password,
    setValue: setPassword,
    errorMessage: passwordError,
  } = useField<string>('password');

  const handleLogin = handleSubmit(async (values) => {
    const res = await authStore.login({
      email: values.email,
      password: values.password,
      provider: LoginProvider.EMAIL,
    });
    if (res.success) {
      showSuccessNotification(t('auth.success.login'));
      return true;
    }
    return false;
  });

  const isValidForm = computed(() => meta.value.valid);

  return {
    handleLogin,
    formValue,
    isValidForm,
    validate,
    setValues,
    email,
    setEmail,
    emailError,
    password,
    setPassword,
    passwordError,
  };
};
