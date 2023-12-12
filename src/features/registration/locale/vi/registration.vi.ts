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
  },
  status: {
    [RegistrationStatus.PENDING]: 'Chờ xử lý',
    [RegistrationStatus.APPROVED]: 'Đã xử lý',
    [RegistrationStatus.REJECTED]: 'Từ chối',
  },
  filter: {
    status: 'Trạng thái',
  },
  button: {
    submit: 'Tư vấn ngay',
    backToLogin: 'Quay lại trang đăng nhập',
  },
  success: 'Đăng ký tư vấn thành công',
};
