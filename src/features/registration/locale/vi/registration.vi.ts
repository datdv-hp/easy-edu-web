import { RegistrationStatus } from '../../constants';

export const registrationVi = {
  list: 'Danh sách đăng ký tư vấn',
  form: {
    name: 'Họ và tên',
    email: 'Email',
    phone: 'Số điện thoại',
    placeholder: {
      name: 'Họ và tên',
      email: 'Email',
      phone: 'Số điện thoại',
    },
  },
  table: {
    name: 'Họ và tên',
    email: 'Email',
    phone: 'Số điện thoại',
    createdAt: 'Ngày đăng ký',
    status: 'Trạng thái',
    action: 'Hành động',
  },
  action: {
    addStudent: 'Thêm học viên',
    switchStatus: 'Chuyển trạng thái',
  },
  status: {
    [RegistrationStatus.PENDING]: 'Chờ xử lý',
    [RegistrationStatus.APPROVED]: 'Đã chấp nhận',
    [RegistrationStatus.REJECTED]: 'Từ chối',
  },
  filter: {
    status: 'Trạng thái',
  },
  button: {
    submit: 'Tư vấn ngay',
    backToLogin: 'Quay lại trang đăng nhập',
  },
  success: {
    create: 'Đăng ký tư vấn thành công',
    switchStatus: 'Chuyển trạng thái thành công',
  },
  error: {
    create: 'Đăng ký tư vấn không thành công',
    switchStatus: 'Chuyển trạng thái không thành công',
  },
};
