import { ErrorCode } from '@/common/constants';

const teacherVi = {
  list: 'Danh sách giảng viên',
  search: 'Tìm kiếm',
  course: 'Học phần',
  addTeacher: 'Tạo mới',
  total: 'Tổng số %{total} giảng viên',
  totalClasses: 'Tổng số %{total} lớp học',
  totalReviews: 'Tổng số %{total} nhận xét',
  page: 'Trang',
  subject: 'Học phần',
  table: {
    id: 'ID',
    name: 'Họ và tên',
    terms: 'Học phần giảng dạy',
    skill: 'Kỹ năng',
    phone: 'Số điện thoại',
    email: 'Email',
    state: 'Trạng thái',
    isManager: 'Kiêm quản trị viên',
  },
  form: {
    title: {
      create: 'Tạo mới giảng viên',
      edit: 'Chỉnh sửa giảng viên',
      infoTitle: 'Thông tin giảng viên',
    },
    roles: {
      title: 'Chức vụ',
      cumTeacher: 'Kiêm nhiệm Giảng viên',
      teacher: 'Giảng viên',
      manager: 'Quản trị viên',
    },
    teacherId: {
      label: 'ID',
    },
    teachingSubjects: {
      label: 'Học phần giảng dạy',
      placeholder: 'Chọn học phần giảng dạy',
    },
    skill: {
      label: 'Kỹ năng',
      placeholder: 'Nhập kỹ năng',
    },
    note: {
      label: 'Mô tả',
      placeholder: 'Nhập mô tả',
    },
    identity: {
      label: 'CCCD/CMT/Hộ chiếu',
      placeholder: 'Nhập CCCD/CMT/Hộ chiếu',
    },
    nationality: {
      label: 'Quốc tịch',
      placeholder: 'Nhập quốc tịch',
    },
    degree: {
      label: 'Bằng cấp / chứng chỉ',
      placeholder: 'Nhập bằng cấp / chứng chỉ',
    },
  },
  avatarCropper: {
    title: 'Chỉnh sửa ảnh đại diện',
    buttons: {
      crop: 'Cắt ảnh',
      cancel: 'Hủy',
      new: 'Tải ảnh lên',
    },
  },
  detail: {
    bar: {
      title: 'Chi tiết giảng viên',
    },
    info: {
      basic: {
        title: 'Thông tin cơ bản',
        academicLevel: 'Trình độ học vấn',
        workingUnit: 'Đơn vị công tác',
        teachingSubjects: 'Học phần giảng dạy',
        note: 'Mô tả',
        code: 'ID',
        role: 'Vai trò',
      },
      courses: {
        id: 'ID',
        title: 'Thông tin lớp học',
        name: 'Khóa học giảng dạy',
        class: 'Lớp học',
        state: 'Trạng thái',
      },
      rating: {
        title: 'Kết quả đánh giá',
        save: 'Lưu',
        edit: 'Sửa',
        add: 'Tạo mới nhận xét',
        class: 'Lớp học',
        subject: {
          title: 'Học phần',
          placeholder: 'Chọn học phần',
        },
        role: {
          title: 'Người đánh giá',
          placeholder: 'Vai trò',
          student: 'Học viên',
          manager: 'Quản trị viên',
        },
        reviewer: {
          title: 'Tên người đánh giá',
          placeholder: 'Chọn người đánh giá',
        },
        comment: {
          title: 'Nội dung nhận xét',
          placeholder: 'Chọn nội dung đánh giá',
        },
        action: 'Hành động',
      },
    },
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa giảng viên này?',
  },
  notification: {
    error: {
      create: 'Thêm mới giảng viên không thành công',
      deleteReview: 'Xóa đánh giá không thành công',
      editReview: 'Cập nhật đánh giá không thành công',
      createReview: 'Tạo mới đánh giá không thành công',
      setting: 'Cài đặt không thành công',
      delete: 'Xóa giảng viên không thành công',
      reviewExisted: 'Người này đã đánh giá',
      update: 'Cập nhật giảng viên không thành công',
    },
    success: {
      create: 'Thêm mới giảng viên thành công',
      edit: 'Cập nhật giảng viên thành công',
      deleteReview: 'Xóa đánh giá thành công',
      delete: 'Xóa giảng viên thành công',
      editReview: 'Cập nhật đánh giá thành công',
      createReview: 'Tạo mới đánh giá thành công',
    },
  },
  // message from API
  create: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      'teacherDetail.subjectIds': 'Học phần phần không tồn tại',
    },
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      email: 'Email đã tồn tại',
      phone: 'Số điện thoại đã tồn tại',
    },
  },
  get: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      teacher: 'Giảng viên không tồn tại',
    },
  },
  update: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      teacher: 'Cập nhật giảng viên không thành công. Vì giảng viên không tồn tại',
      teacherDetail: { subjectIds: 'Học phần phần không tồn tại' },
    },
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      phone: 'Số điện thoại đã tồn tại',
    },
    [ErrorCode.CONFLICT]: {
      lesson:
        'Cập nhật giảng viên không thành công. Quản trị vi này hiện đang có buổi học',
    },
  },
  delete: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      teacher: 'Xóa giảng viên không thành công. Vì giảng viên không tồn tại',
    },
    [ErrorCode.CONFLICT]: {
      lesson: 'Xóa giảng viên không thành công. Vì giảng viên đang có buổi học',
    },
  },
  //
  deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa {total} giảng viên đã chọn?',
  deleteReviewConfirmMessage: 'Bạn có chắc chắn muốn xóa đánh giá này không?',
  setting: 'cài đặt thành công',
  validate: {
    haveAtLeastOne: 'có ít nhất 1',
    studentOrManager: 'là bắt buộc',
    required: 'là bắt buộc',
    notExistedSubjects: 'Học phần phần không tồn tại',
  },
  timekeeping: {
    search: {
      teacherDropdown: 'Giảng viên',
      searchButton: 'Tìm kiếm',
      month: 'Chọn tháng',
    },
    setting: {
      label: 'Ngày chốt công hàng tháng',
      options: {
        finishdateofmonth: 'Ngày cuối trong tháng',
        other: 'Ngày khác',
      },
    },
    table: {
      header: {
        presence: 'Có mặt',
        absence: 'Vắng mặt',
        confirmDate: 'Ngày chốt công',
      },
      code: 'Mã giảng viên',
      name: 'Tên giảng viên',
      classroom: 'Tên lớp học',
      lesson: 'ID buổi học',
      attendance: 'Số buổi',
      month: 'Tháng {month}',
      idTeacher: 'ID',
      noData: 'Không có dữ liệu',
      teacherList: 'Danh sách giảng viên',
    },
  },
  classStatus: {
    no_start: 'Chưa khai giảng',
    started: 'Đang hoạt động',
    finished: 'Đã kết thúc',
  },
};
export default teacherVi;
