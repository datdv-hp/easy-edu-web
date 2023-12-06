import yup from '@/plugins/yup';
import { Degree, FORM_VALIDATION, Gender, Regex } from './constants';

export const phoneSchema = yup
  .string()
  .nullable()
  .transform((p: string) => p.replace(/ /g, ''))
  .transform((v) => (v === '' ? undefined : v))
  .length(10, 'common.validate.phoneLength');

export const emailSchema = yup.string().required().trim().matches(Regex.EMAIL);

export const passwordSchema = yup
  .string()
  .required()
  .matches(Regex.PASSWORD, { message: 'common.validate.password' });

export const nameSchema = yup.string().trim();
export const userNameSchema = yup
  .string()
  .trim()
  .required()
  .max(FORM_VALIDATION.textMaxLength);

export const taxCodeSchema = yup
  .string()
  .trim()
  .required()
  .matches(/^[\d-]+$/g, {
    excludeEmptyString: true,
    message: 'auth.userRegistration.form.taxCode.errorMessage',
  })
  .max(255)
  .ensure();

export const genderSchema = yup.string().oneOf(Object.values(Gender)).ensure();
export const degreeSchema = yup
  .string()
  .oneOf(Object.values(Degree))
  .nullable()
  .label('educationalBackground');
export const dobSchema = yup.string();
