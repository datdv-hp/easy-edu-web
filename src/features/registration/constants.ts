export enum RegistrationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export const VERIFY_LINK_DURATION = 72; // hours

export const RegistrationStatusColor = {
  [RegistrationStatus.APPROVED]: '#52C41A',
  [RegistrationStatus.PENDING]: '#1890FF',
  [RegistrationStatus.REJECTED]: '#FF4D4F',
};
