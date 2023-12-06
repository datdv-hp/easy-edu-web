export enum TeacherTab {
  basic_info = 'basic_info',
  courses_info = 'courses_info',
  rating = 'rating',
}

export enum TimekeepingSettingOptions {
  FINISH_DATE_OF_MONTH = 'finishDateOfMonth',
  OTHER = 'other',
}
export enum TimeKeepingStatus {
  ABSENCE = 'ABSENCE',
  PRESENCE = 'PRESENCE',
}

export enum ClassByTeacherStatus {
  NO_START = 'no_start',
  STARTED = 'started',
  FINISHED = 'finished',
}

export enum ClassByTeacherStatusColor {
  'no_start' = '#FA8C16',
  'started' = '#52C41A',
  'finished' = '#D9D9D9',
}

export enum ReviewerRole {
  MANAGER = 'manager',
  STUDENT = 'student',
}

export const TIMEKEEPING_END_OF_MONTH = 'END_OF_MONTH';
