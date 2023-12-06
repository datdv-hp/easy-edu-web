import { ErrorCode } from '@/common/constants';

export const authorizationForm = {
  name: 'Role name',
};

export default {
  title: 'User authorization management',
  roleList: {
    title: 'Danh sách vai trò',
    total: 'Tổng số {total} vai trò',
  },
  table: {
    index: 'STT',
    name: 'Tên vai trò',
  },
  permissionList: {
    title: 'Danh sách phân quyền',
    user: 'Hồ sơ của tôi',
    manager: 'Quản lý quản trị viên',
    teacher: 'Quản lý giảng viên',
    student: 'Quản lý student',
    schedule: 'Bảng theo dõi lịch học',
    subject: 'Quản lý học phần',
    course: 'Quản lý khóa học',
    classroom: 'Quản lý lớp học',
    lesson: 'Quản lý buổi học',
    timekeeping: 'Chấm công',
    role: 'Quản lý phân quyền',
  },
  permissions: {
    user: {
      update: 'Cập nhật',
    },
    role: {
      view: 'Xem',
      update: 'Cập nhật',
      delete: 'Xóa',
      create: 'Thêm mới',
    },
    manager: {
      view: 'Xem',
      update: 'Cập nhật',
      delete: 'Xóa',
      create: 'Thêm mới',
    },
    teacher: {
      view: 'Xem',
      update: 'Cập nhật',
      delete: 'Xóa',
      create: 'Thêm mới',
      viewReview: 'Xem đánh giá',
      createReview: 'Thêm mới đánh giá',
      deleteReview: 'Xóa đánh giá',
      updateReview: 'Cập nhật đánh giá',
    },
    student: {
      view: 'Xem',
      update: 'Cập nhật',
      delete: 'Xóa',
      create: 'Thêm mới',
    },
    schedule: {
      view: 'Xem tất cả buổi học',
      viewPersonal: 'Xem buổi học tham gia',
      createRequestLeave: 'Xin nghỉ',
      deleteLeaveRequest: 'Xóa đơn xin nghỉ',
      updateDocument: 'Cập nhật tài liệu buổi học',
      updateLesson: 'Cập nhật buổi học',
      attendance: 'Điểm danh',
      updateTimeKeeping: 'Chấm công',
      delete: 'Xóa',
    },
    subject: {
      view: 'Xem',
      update: 'Cập nhật',
      delete: 'Xóa',
      create: 'Thêm mới',
    },
    course: {
      view: 'Xem',
      update: 'Cập nhật',
      delete: 'Xóa',
      create: 'Thêm mới',
      detail: 'Chi tiết khóa học',
    },
    classroom: {
      view: 'Xem',
      create: 'Thêm mới',
      update: 'Cập nhật',
      delete: 'Xóa',
      detail: 'Chi tiết lớp học',
      viewTimeKeeping: 'Danh sách chấm công',
      viewAttendance: 'Danh sách điểm danh',
      viewStudentClassroom: true,
      viewGeneralClassroom: true,
      viewSubjectEvaluation: 'Xem đánh giá theo học phần',
      viewCourseEvaluation: 'Xem đánh giá theo khóa học',
      viewProjectEvaluation: 'Xem đánh giá theo đồ án',
      viewSummary: true,
      createSetting: 'Thiết lập cài đặt',
      updateGrade: 'Cập nhật điểm',
      updateGradeProject: 'Cập nhật điểm đồ án',
      updateGradeCourse: 'Cập nhật điểm khóa học',
      detailGrade: 'Chi tiết điểm',
      deleteGrade: 'Xóa điểm',
    },
    lesson: {
      view: 'Xem',
      create: 'Thêm mới',
      update: 'Cập nhật',
      delete: 'Xóa',
      updateDocument: 'Cập nhật tài liệu',
      detail: 'Xem chi tiết',
    },
    timekeeping: {
      view: 'Xem',
      update: 'Cập nhật',
      delete: 'Xóa',
      create: 'Thêm mới',
      setting: 'Cài đặt ngày chốt công',
    },
  },
  info: {
    title: 'Thông tin chung',
    name: 'Tên vai trò',
    description: 'Mô tả',
  },
  form: {
    name: {
      label: 'Tên vai trò',
      placeholder: 'Nhập tên vai trò',
    },
    description: {
      label: 'Mô tả',
      placeholder: 'Nhập mô tả',
    },
  },
  confirmation: {
    cancel: {
      title: 'Xác nhận hủy',
      text: 'Có thay đổi chưa được lưu. Bạn có chắc chắn muốn hủy các thay đổi?',
    },
    delete: {
      text: 'Bạn có chắc chắn muốn xóa vai trò này?',
    },
  },
  success: {
    delete: 'Xóa vai trò thành công',
    update: 'Cập nhật vai trò thành công',
    create: 'Thêm mới vai trò thành công',
  },
  error: {
    delete: 'Xóa vai trò không thành công',
    update: 'Cập nhật vai trò không thành công',
    create: 'Thêm mới vai trò không thành công',
  },
  deleteError: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      id: 'Xóa vai trò không thành công. Vì vai trò không tồn tại',
    },
  },
  updateError: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      id: 'Cập nhật vai trò không thành công. Vì vai trò không tồn tại',
    },
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      name: 'Vai trò đã tồn tại',
    },
  },
  createError: {
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      name: 'Vai trò đã tồn tại',
    },
  },
};
