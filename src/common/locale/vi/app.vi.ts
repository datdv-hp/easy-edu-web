const appVi = {
  appName: 'EasyEdu',
  sidebar: {
    userManagement: {
      groupName: 'Quản lý nhân sự',
      teacher: {
        name: 'Giảng viên',
        schedule: 'Lịch giảng dạy',
        timekeeping: 'Chấm công',
        list: 'Danh sách giảng viên',
      },
      manager: {
        name: 'Quản trị viên',
        list: 'Danh sách quản trị viên',
        schedule: 'Bảng theo dõi lịch học',
      },
      student: {
        name: 'Học viên',
        attendance: 'Điểm danh',
        list: 'Danh sách học viên',
      },
      registration: {
        name: 'Đăng ký tư vấn',
      },
    },
    trainingManagement: {
      groupName: 'Quản lý chương trình đào tạo',
      course: {
        name: 'Khóa học',
        list: 'Danh sách khóa học',
      },
      subject: {
        name: 'Học phần',
        list: 'Danh sách học phần',
      },
      syllabus: {
        name: 'Giáo trình',
        list: 'Danh sách giáo trình',
      },
    },
    teaching: {
      groupName: 'Quản lý giảng dạy',
      classroom: {
        name: 'Lớp học',
        list: 'Danh sách lớp học',
        checkin: 'Điểm danh',
        studentAndSubject: 'Học viên và học phần đăng ký',
        commonRating: 'Đánh giá chung',
      },
      lesson: {
        name: 'Buổi học',
        list: 'Danh sách buổi học',
      },
    },
    schedule: {
      groupName: 'Vận hành giảng dạy',
    },
    finance: {
      groupName: 'Quản lý tài chính',
      tuition: 'Học phí',
    },
    setting: {
      groupName: 'Cài đặt',
      userRole: {
        name: 'Vai trò',
      },
      course: {
        name: 'Hình thức khóa học',
      },
      evaluation: {
        name: 'Đánh giá khóa học',
      },
      timekeeping: {
        name: 'Chấm công',
      },
      promotionProgramme: {
        name: 'Chương trình khuyến mại',
      },
      paymentMethod: {
        name: 'Phương thức thanh toán',
      },
    },
    system: {
      groupName: 'Hệ thống',
      notification: {
        name: 'Thông báo',
      },
      setting: {
        name: 'Cài đặt',
      },
    },
    menu: {
      profile: 'Hồ sơ của tôi',
      resetPassword: 'Đổi mật khẩu',
      logout: 'Đăng xuất',
    },
    collapse: 'Thu gọn',
  },
  header: {
    languages: {
      en: 'Tiếng Anh',
      vi: 'Tiếng Việt',
    },
    title: {
      logout: 'Đăng xuất',
      profile: 'Hồ sơ người dùng',
    },
  },
  gender: {
    label: 'Giới tính',
    placeholder: 'Chọn giới tính',
    male: 'Nam',
    female: 'Nữ',
    other: 'Khác',
  },
  page: 'Trang',
  cancel: 'Hủy',
  ok: 'Xác nhận',
};

export default appVi;
