import { RoleType } from '@/common/constants';
import { IUserRole } from '@/common/interfaces';

export interface IRoleInfo {
  name: string;
  id: string;
  features: IUserRole[];
  description?: string;
  type: RoleType;
  isDefault?: boolean;
}

export interface RoleForm {
  name: string;
  description?: string;
  features: IUserRole[];
}

export interface IDefaultFeature {
  type: RoleType;
  keys: Record<string, string[]>;
}
