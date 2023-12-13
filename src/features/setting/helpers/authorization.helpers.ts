import { RoleType } from '@/common/constants';
import { IUserRole } from '@/common/interfaces';
import { get } from 'lodash';
import { IRoleInfo } from '../interfaces/authorization.interfaces';
export const convertToRole = (params: Record<string, unknown>) => {
  const features = get(params, 'features') as string | IUserRole;
  return {
    id: get(params, '_id') as string,
    features:
      typeof features === 'string' ? JSON.parse(features) : (features as IUserRole),
    name: get(params, 'name') as string,
    type: get(params, 'type') as RoleType,
    isDefault: get(params, 'isDefault') as boolean,
    description: get(params, 'description', '') as string,
  } as IRoleInfo;
};

export const convertToRoleFormData = (params: Record<string, unknown>) => {
  return {
    name: get(params, 'name') as string,
    description: get(params, 'description'),
    features: get(params, 'features') as IUserRole,
    type: get(params, 'type') as RoleType,
  };
};
