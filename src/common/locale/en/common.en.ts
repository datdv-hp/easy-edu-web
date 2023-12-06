const commonEn = {
  error: {
    systemError: 'Có lỗi xảy ra, vui lòng thử lại sau ít phút',
    emailExist: 'Email đã tồn tại',
    phoneExist: 'Số điện thoại đã tồn tại',
    sendEmail: 'Gửi email không thành công',
    limitFiles: 'Chỉ cho phép tải lên tối đa {maxFiles} files',
    invalidLink: 'Đường dẫn không hợp lệ',
  },
  success: {
    sendEmail: 'Gửi email thành công',
  },
  button: {
    save: 'Lưu',
    cancel: 'Hủy',
    crop: 'Lưu',
    create: 'Tạo mới',
    edit: 'Chỉnh sửa',
    delete: 'Xóa',
    uploadAvatar: 'Tải ảnh lên',
    choose: 'Chọn',
    view: 'Xem',
    setting: 'Cài đặt',
    revert: 'Khôi phục',
    download: 'Tải xuống',
  },
  search: 'Tìm kiếm',
  deleteConfirm: 'Xác nhận xóa',
  form: {
    name: {
      label: 'Họ tên',
      placeholder: 'Nhập họ tên',
    },
    email: {
      label: 'Email',
      placeholder: 'Nhập email',
    },
    dob: {
      label: 'Ngày sinh',
      placeholder: 'Chọn ngày sinh',
    },
    gender: {
      label: 'Giới tính',
      placeholder: 'Chọn giới tính',
    },
    phone: {
      label: 'Số điện thoại',
      placeholder: 'Nhập số điện thoại',
    },
    signingDate: {
      label: 'Ngày ký hợp đồng',
      placeholder: 'Ngày ký hợp đồng',
    },
    courses: {
      label: 'Khóa học',
      placeholder: 'Chọn khóa học',
    },
    subject: {
      label: 'Học phần',
      placeholder: 'Chọn học phần',
    },
    skill: {
      label: 'Kỹ năng',
      placeholder: 'Kỹ năng',
    },
    role: {
      label: 'Vai trò',
      placeholder: 'Chọn vai trò',
    },
  },
  avatarCropper: {
    title: 'Chỉnh sửa ảnh đại diện',
  },
  degree: {
    label: 'Trình độ học vấn',
    placeholder: 'Trình độ học vấn',
    elementary: 'Cấp 1',
    secondary_school: 'Cấp 2',
    high_school: 'Cấp 3',
    college: 'Đại học',
    master: 'Thạc sĩ',
    phd: 'Tiến sĩ',
    engineer: 'Kỹ sư',
    bachelor: 'Cử nhân',
    expert: 'Chuyên gia',
    other: 'Khác',
  },
  multiselectOther: '(+{length})',
  profile: {
    code: {
      student: 'ID',
      teacher: 'ID',
    },
    name: 'Họ tên',
    title: 'Thông tin cá nhân',
    email: 'Email',
    dob: 'Ngày sinh',
    gender: 'Giới tính',
    phone: 'Số điện thoại',
    signingDate: 'Ngày kí hợp đồng',
    course: 'Khóa học',
    resend: 'Gửi lại',
    resent: 'Đã gửi lại',
    unverified: ' (Chưa xác nhận)',
    managerIsTeacher: 'Quản trị viên kiêm giảng viên',
  },
  setting: {
    title: 'Cài đặt',
    evaluation: {
      title: 'Đánh giá theo',
      options: {
        course: 'Khóa học',
        subject: 'Học phần',
      },
    },
    option: {
      title: 'Thêm điểm đồ án',
      value: 'Tạo điểm đồ án tốt nghiệp',
    },
  },
  daysOfWeek: {
    monday: 'Thứ 2',
    tuesday: 'Thứ 3',
    wednesday: 'Thứ 4',
    thursday: 'Thứ 5',
    friday: 'Thứ 6',
    saturday: 'Thứ 7',
    sunday: 'Chủ nhật',
  },
  linkVerifyState: {
    expired: 'Đã hết hạn',
    active: 'Đang hoạt động',
    sent: 'Đã gửi mail',
  },
  noDataText: 'Không có dữ liệu',
  userStatus: {
    active: 'Đang hoạt động',
    confirming: 'Đã gửi email',
    invite_expired: 'Gửi lại',
  },
  toggle: {
    show: 'Hiển thị tất cả',
    collapse: 'Thu gọn',
    more: 'Xem thêm',
  },
  validate: {
    name: 'Hãy nhập chữ cái thường, chữ cái in hoa, ký tự số',
    userName: 'Hãy nhập chữ cái thường hoặc chữ cái in hoa có dấu',
    phoneLength: 'Số điện thoại phải đúng 10 ký tự',
    password:
      'Hãy nhập tối thiểu 8 ký tự, bao gồm chữ cái thường, chữ cái in hoa, ký tự số ',
  },
};

export default commonEn;
