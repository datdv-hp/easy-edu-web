import { ErrorCode } from '@/common/constants';

export const authorizationForm = {
  name: 'Tên vai trò',
  description: 'Mô tả',
};

export default {
  title: 'Quản lý vai trò',
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
    student: 'Quản lý học viên',
    schedule: 'Bảng theo dõi lịch học',
    subject: 'Quản lý học phần',
    course: 'Quản lý khóa học',
    classroom: 'Quản lý lớp học',
    lesson: 'Quản lý buổi học',
    timekeeping: 'Chấm công',
    role: 'Quản lý vai trò',
    syllabus: 'Quản lý giáo trình',
    setting: 'Cài đặt',
    lecture: 'Quản lý bài giảng',
    courseFormSetting: 'Cài đặt hình thức',
    evaluationClassifiedSetting: 'Cài đặt xếp loại',
    evaluationCriteriaSetting: 'Cài đặt tiêu chí',
    settingTimekeeping: 'Cài đặt ngày chốt công',
  },
  permissions: {
    user: {
      update: 'Chỉnh sửa hồ sơ',
      view: 'Xem hồ sơ',
      changePassword: 'Đổi mật khẩu',
    },
    role: {
      view: 'Xem',
      update: 'Chỉnh sửa',
      delete: 'Xóa',
      create: 'Tạo mới',
    },
    manager: {
      view: 'Xem',
      update: 'Chỉnh sửa',
      delete: 'Xóa',
      create: 'Tạo mới',
    },
    teacher: {
      view: 'Xem',
      update: 'Chỉnh sửa',
      delete: 'Xóa',
      create: 'Tạo mới',
      viewClassroomByTeacher: 'Xem danh sách thông tin lớp học',
    },
    student: {
      view: 'Xem',
      update: 'Chỉnh sửa',
      delete: 'Xóa',
      create: 'Tạo mới',
      viewClassroomByStudent: 'Xem danh sách thông tin lớp học',
    },
    schedule: {
      view: 'Xem tất cả buổi học',
      viewPersonal: 'Xem buổi học tham gia',
      createRequestLeave: 'Tạo đơn xin nghỉ',
      deleteLeaveRequest: 'Xóa đơn xin nghỉ',
      updateLesson: 'Chỉnh sửa',
      createLesson: 'Tạo mới buổi học',
      attendance: 'Điểm danh',
      updateTimeKeeping: 'Chấm công',
      delete: 'Xóa',
    },
    subject: {
      view: 'Xem',
      update: 'Chỉnh sửa',
      delete: 'Xóa',
      create: 'Tạo mới',
    },
    course: {
      view: 'Xem tất cả khóa học',
      viewPersonal: 'Xem danh sách khóa học tham gia',
      detailBasic: 'Xem chi tiết thông tin cơ bản khóa học',
      detailStatistics: 'Xem chi tiết tổng hợp thống kê khóa học',
      viewClassroomByCourse: 'Xem chi tiết danh sách tất cả lớp học của khóa học',
      viewPersonalClassroomByCourse:
        'Xem chi tiết danh sách lớp học tham gia của khóa học',
      viewTeacherByCourse: 'Xem chi tiết danh sách giảng viên',
      viewSubjectByCourse: 'Xem chi tiết danh sách học phần của khóa học',
      update: 'Chỉnh sửa',
      delete: 'Xóa',
      create: 'Tạo mới',
      viewExamsByCourse: 'Xem chi tiết danh sách bài kiểm tra',
    },
    classroom: {
      view: 'Xem danh sách tất cả lớp học',
      viewPersonal: 'Xem danh sách lớp học tham gia',
      detailBasic: 'Xem chi tiết thông tin cơ bản lớp học',
      detailStatistics: 'Xem chi tiết thông tin thống kê lớp học',
      create: 'Tạo mới',
      update: 'Chỉnh sửa',
      delete: 'Xóa',
      viewTimeKeeping: 'Xem chấm công giảng viên',
      viewAttendance: 'Xem điểm danh học viên',
      viewStudentClassroom: 'Xem chi tiết danh sách học phần',
      viewGeneralClassroom: 'Xem đánh giá chung',
      viewSyllabus: 'Xem giáo trình',
      download: 'Tải xuống bài giảng',
    },
    lesson: {
      view: 'Xem tất cả danh sách buổi học',
      viewPersonal: 'Xem danh sách buổi học tham gia',
      create: 'Tạo mới',
      update: 'Chỉnh sửa tất cả',
      delete: 'Xóa',
      updateDocument: 'Chỉnh sửa tài liệu',
      detail: 'Chi tiết buổi học',
      downloadVideo: 'Tải xuống video',
    },
    timekeeping: {
      view: 'Xem tất cả chấm công của giảng viên',
      update: 'Chỉnh sửa chấm công',
      delete: 'Xóa chấm công',
      create: 'Chấm công',
      viewPersonal: 'Xem chấm công giảng viên',
      detail: 'Chi tiết chấm công',
      setting: 'Cài đặt ngày chốt công',
    },
    syllabus: {
      view: 'Xem tất cả giáo trình',
      viewPersonal: 'Xem giáo trình tham gia',
      download: 'Tải xuống',
      update: 'Chỉnh sửa',
      delete: 'Xóa',
      create: 'Tạo mới',
    },
    courseFormSetting: {
      view: 'Xem',
      update: 'Chỉnh sửa',
      delete: 'Xóa',
      create: 'Tạo mới',
    },
    evaluationClassifiedSetting: {
      view: 'Xem',
      update: 'Chỉnh sửa',
      delete: 'Xóa',
      create: 'Tạo mới',
    },
    evaluationCriteriaSetting: {
      view: 'Xem',
      update: 'Chỉnh sửa',
      delete: 'Xóa',
      create: 'Tạo mới',
    },
    settingTimekeeping: {
      view: 'Xem',
      update: 'Chỉnh sửa',
      delete: 'Xóa',
      create: 'Tạo mới',
    },
    all: 'Tất cả',
  },
  info: {
    title: 'Thông tin chung',
    name: 'Tên vai trò',
    roleType: 'Loại người dùng: ',
    description: 'Mô tả',
  },
  form: {
    name: {
      label: 'Tên vai trò',
      placeholder: 'Nhập tên vai trò',
    },
    type: { label: 'Loại người dùng', placeholder: 'Chọn loại người dùng' },
    description: {
      label: 'Mô tả',
      placeholder: 'Nhập mô tả',
    },
  },
  roleType: {
    manager: 'Quản trị viên',
    teacher: 'Giảng viên',
    student: 'Học viên',
  },
  confirmation: {
    cancel: {
      title: 'Xác nhận hủy',
      changeText: 'Có thay đổi chưa được lưu',
      confirmText: 'Bạn có chắc chắn muốn hủy các thay đổi?',
      createText: 'Bạn có chắc chắn không lưu lại vai trò này?',
    },
    delete: {
      text: 'Bạn có chắc chắn muốn xóa vai trò này?',
    },
    save: {
      title: 'Xác nhận',
      changeText: 'Bạn có chắc chắn cập nhật vai trò không?',
    },
  },
  success: {
    delete: 'Xóa vai trò thành công',
    update: 'Cập nhật vai trò thành công',
    create: 'Thêm mới vai trò thành công',
  },
  error: {
    delete: 'Xóa Vai trò thành công',
    update: 'Cập nhật vai trò không thành công',
    create: 'Thêm mới vai trò không thành công',
  },
  deleteError: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      id: 'Xóa vai trò không thành công. Vì vai trò không tồn tại',
    },
    [ErrorCode.CONFLICT]: {
      id: 'Xóa vai trò không thành công. Vì đang có người dùng',
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
