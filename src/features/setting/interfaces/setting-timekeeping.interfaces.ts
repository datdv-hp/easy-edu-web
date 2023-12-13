import { TimeKeepingType } from '../constant';

export interface ITimeKeepingSetting {
    day?: number;
    isEndOfMonth?: boolean;
    type?: TimeKeepingType;
}

export interface ITimeKeepingSettingResponse {
    value: ITimeKeepingSetting;
    _id: string;
}
