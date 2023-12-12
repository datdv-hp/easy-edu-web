import { RegistrationStatus } from './constants';

export type IRegistrationListItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  status: RegistrationStatus;
};