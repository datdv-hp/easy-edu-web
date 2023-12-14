import { ErrorCode } from '@/common/constants';

const timekeepingVi = {
  title: 'Bảng theo dõi chấm công',
  teacherTitle: 'Giảng viên: ',
  teacherCode: 'ID giảng viên: ',
  teacherPresence: 'Có mặt (buổi): ',
  hideTeacher: 'Ẩn danh sách giảng viên',
  status: {
    absence: 'Vắng mặt',
    presence: 'Có mặt',
    default: 'Chưa chấm công',
  },
  update: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      user: 'Giảng viên tồn tại',
      lesson: 'Buổi học không tồn tại',
      timekeeping: 'Thông tin chấm công không tồn tại',
    },
    [ErrorCode.ITEM_INVALID]: {
      lessonUpcoming: 'Buổi học chưa diễn ra',
      lessonCompleted: 'Buổi học đã kết thúc',
    },
  },
  error: {
    update: 'Chấm công không thành công',
  },
  setting: {
    title: 'Cài đặt ngày chốt công',
    placeholder: 'Chọn ngày chốt công',
    titleAuto: 'Tự động chốt công cho giảng viên đến',
    dateTimekeeping: 'Ngày chốt công',
    lastDate: 'Ngày cuối tháng',
    dateFuture: 'Cả các ngày trong tương lai',
    dateTimekeepingDescription:
      'Ví dụ: Ngày chốt công là ngày 20 thì giảng viên chỉ được mặc định tính công đến ngày 20, các ngày tương lai chưa có công',
    dateFutureDescription:
      'Ví dụ: Ngày chốt công là ngày 20 mà bảng chấm công lập đến ngày 30 thì giảng viên được mặc định tính công cho cả ngày 21 đến 30',
  },
};

export default timekeepingVi;
