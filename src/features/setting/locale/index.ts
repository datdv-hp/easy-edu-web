import authorizationVi from './vi/authorization.vi';
import authorizationEn from './en/authorization.en';
import SettingsVi from './vi/settings.vi';
import SettingsEn from './en/settings.en';
import PromotionProgrammeEn from './en/promotion-programme.en';
import PromotionProgrammeVi from './vi/promotion-programme.vi';
import { paymentMethodEn } from './en/payment-method.en';
import { paymentMethodVi } from './vi/payment-method.vi';

export const authorization = {
  en: authorizationEn,
  vi: authorizationVi,
};

export const Settings = {
  en: SettingsEn,
  vi: SettingsVi,
};
export const PromotionProgramme = {
  en: PromotionProgrammeEn,
  vi: PromotionProgrammeVi,
};

export const PaymentMethod = {
  en: paymentMethodEn,
  vi: paymentMethodVi,
};
