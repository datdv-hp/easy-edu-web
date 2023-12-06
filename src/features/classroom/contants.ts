export enum ClassroomStatus {
  COMING = 'coming',
  OPENING = 'opening',
  FINISHED = 'finished',
}

export const ClassroomStatusColors = {
  [ClassroomStatus.COMING]: '#FA8C16',
  [ClassroomStatus.OPENING]: '#52C41A',
  [ClassroomStatus.FINISHED]: '#D9D9D9',
};

export const listColor = [
  '#007BFF',
  '#6610F2',
  '#696CFF',
  '#E83E8C',
  '#FF3E1D',
  '#FD7E14',
  '#FFAB00',
  '#71DD37',
  '#20C997',
  '#03C3EC',
];

export enum StudentInSubject {
  SUBSCRIBED = 'SUBSCRIBED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
}

export enum ClassroomTimekeepingListType {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export enum ClassroomTimekeepingListTypeStudent {
  STUDENT = 'student',
}
