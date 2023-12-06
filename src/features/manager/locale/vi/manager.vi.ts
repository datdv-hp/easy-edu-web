import { ErrorCode } from '@/common/constants';

export default {
  list: 'Danh sách quản trị viên',
  form: {
    title: {
      create: 'Tạo mới quản trị viên',
      edit: 'Chỉnh sửa quản trị viên',
      infoTitle: 'Thông tin quản trị viên',
      position: 'Chức vụ',
    },
    isTeacher: 'Kiêm nhiệm giảng viên',
  },
  table: {
    name: 'Họ và tên',
    phone: 'Số điện thoại',
    email: 'Email',
    isTeacher: 'Kiêm giảng viên',
    state: 'Trạng thái',
  },
  total: 'Tổng số %{total} quản trị viên',
  notification: {
    error: {
      emailOrPhoneExisted: 'Email hoặc số điện thoại đã tồn tại',
      create: 'Thêm mới quản trị viên không thành công',
      update: 'Cập nhật quản trị viên không thành công',
      delete: 'Xóa quản trị viên không thành công',
    },
    success: {
      create: 'Thêm mới quản trị viên thành công',
      edit: 'Cập nhật quản trị viên thành công',
      delete: 'Xóa quản trị viên thành công',
    },
  },
  get: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      manager: 'Quản trị viên không tồn tại',
    },
  },
  create: {
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      email: 'Email đã tồn tại',
      phone: 'Số điện thoại đã tồn tại',
    },
  },
  update: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      manager: 'Cập nhật quản trị viên không thành công. Vì quản trị viên không tồn tại',
    },
    [ErrorCode.CONFLICT]: {
      lesson:
        'Cập nhật quản trị viên không thành công. Vì quản trị viên đang có lịch giảng dạy',
    },
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      phone: 'Số điện thoại đã tồn tại',
    },
    [ErrorCode.UNPROCESSABLE_ENTITY]: {
      email: 'Cập nhật quản trị viên không thành công. Vì không được thay đổi email',
    },
  },
  delete: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      manager: 'Xóa quản trị viên không thành công. Vì quản trị viên không tồn tại',
    },
    [ErrorCode.CONFLICT]: {
      lesson: 'Xóa quản trị viên không thành công. Vì quản trị viên có lịch giảng dạy',
    },
  },
  detail: {
    info: {
      basic: 'Thông tin cơ bản',
      course: 'Thông tin khóa học',
      rate: 'Kết quả đánh giá',
    },
    bar: {
      title: 'Chi tiết quản trị viên',
    },
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa quản trị viên này?',
  },
  deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa {total} quản trị viên đã chọn?',
  searchOptions: {
    all: 'Tất cả',
    isTeacher: 'Kiêm giảng viên',
    notTeacher: 'Không kiêm giảng viên',
  },
  dobRequired: 'Ngày sinh là bắt buộc',
};
