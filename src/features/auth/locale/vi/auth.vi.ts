const authVi = {
  form: {
    email: 'Email',
    password: 'Mật khẩu',
    placeholder: {
      email: 'Nhập email',
      password: 'Nhập mật khẩu',
    },
  },
  validate: {
    password: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
    confirmPassword: 'Mật khẩu không khớp',
    wrongPassword: 'Mật khẩu không đúng',
  },
  active: {
    success: 'Kích hoạt tài khoản thành công',
    loginInfoSent: 'Thông tin đăng nhập đã được gửi tới email: {email}',
    alreadyActivated: 'Tài khoản đã được kích hoạt',
    failed: 'Kích hoạt tài khoản không thành công',
    contactAdmin: 'Vui lòng liên hệ quản trị viên để được hỗ trợ qua email: {email}',
  },
  button: {
    login: 'Đăng nhập',
    loginWithGoogle: 'Đăng nhập với Google',
  },
  register: {
    contact: 'Đăng ký nhận tư vấn',
    noAccount: 'Chưa có tài khoản?',
  },
  success: {
    login: 'Đăng nhập thành công',
    updatePassword: 'Cập nhật mật khẩu thành công',
  },
  error: {
    login: 'Đăng nhập không thành công',
    updatePassword: 'Cập nhật mật khẩu không thành công',
  },
  userProfile: {
    profile: {
      title: 'Hồ sơ cá nhân',
    },
    edit: {
      title: 'Chỉnh sửa hồ sơ cá nhân',
    },
    notification: {
      success: 'Cập nhật hồ sơ thành công',
      error: 'Cập nhật hồ sơ không thành công',
    },
  },
};

export default authVi;
