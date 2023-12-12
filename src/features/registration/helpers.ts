import { RegistrationStatus } from './constants';
import { IRegistrationListItem } from './interfaces';
import dayjs from '@/plugins/dayjs'

export const convertToRegisterForm = (params: Record<string, unknown>) => {
  return {
    email: params?.email as string,
    name: params?.name as string,
    phone: (params?.phone as string)?.replaceAll(' ', ''),
  };
};

export const convertToRegistrationListItem = (params: Record<string, unknown>) => {
  const createdAt = params?.createdAt as Date;
  return {
    id: params?._id as string,
    name: params?.name as string,
    email: params?.email as string,
    phone: params?.phone as string,
    createdAt: dayjs(createdAt).format('DD/MM/YYYY HH:mm:ss'),
    status: params?.status as RegistrationStatus,
  } as IRegistrationListItem;
};

export const convertToRegistrationList = (params: Record<string, unknown>[]) => {
  return params.map((item) => convertToRegistrationListItem(item));
};
