import { ErrorCode } from '@/common/constants';
import { MAX_TIMES, MIN_TIMES } from '../../contants';

const coursesVi = {
  create: {
    title: 'Tạo mới khóa học',
    name: {
      label: 'Tên khóa học',
      placeholder: 'Nhập tên khóa học',
    },
    state: {
      label: 'Hình thức',
      placeholder: 'Chọn hình thức',
    },
    description: {
      label: 'Mô tả',
      placeholder: 'Nhập nội dung mô tả khóa học',
    },
    subjects: {
      label: 'Gồm các học phần',
      placeholder: 'Chọn học phần',
      noDataText: 'Không có dữ liệu',
    },
    time: {
      label: 'Thời lượng (giờ)',
      placeholder: 'Nhập thời lượng (giờ)',
    },
  },
  update: {
    title: 'Chỉnh sửa khóa học',
  },
  delete: {
    title: 'Xác nhận xóa',
    text: 'Bạn chắc chắn muốn xóa %{totalSelectedCourses} khóa học đã chọn ?',
    btn: {
      cancel: 'Hủy',
      delete: 'Xóa',
    },
  },
  detail: {
    info: {
      title: 'Thông tin khóa học',
      id: 'ID',
      name: 'Tên khóa học',
      typeCourse: 'Hình thức',
      time: 'Thời lượng (giờ)',
      numberOfStudents: 'Số lượng học viên',
      numberOfClassrooms: 'Số lượng lớp học',
      numberOfOngoingClassrooms: 'Số lượng lớp học đang hoạt động',
      numberOfCompletedClassrooms: 'Số lượng lớp học đã kết thúc',
      description: 'Mô tả',
    },
    evaluation: {
      tabTitle: 'Bảng đánh giá',
      title: 'Bảng đánh giá xếp loại',
    },
    classroom: {
      tabTitle: 'Danh sách lớp học',
      index: 'STT',
      id: 'ID',
      name: 'Tên lớp học',
      startDate: 'Ngày khai giảng',
      endDate: 'Ngày bế giảng',
      numberOfStudents: 'Số lượng học viên',
      status: 'Trạng thái',
      statusText: {
        ongoing: 'Đang hoạt động',
        upcoming: 'Chưa khai giảng',
        completed: 'Đã kết thúc',
      },
    },
    subject: {
      tabTitle: 'Danh sách học phần',
      index: 'STT',
      id: 'ID',
      code: 'Mã học phần',
      name: 'Tên học phần',
      duration: 'Thời lượng (giờ)',
    },
    teacher: {
      tabTitle: 'Danh sách giảng viên',
      index: 'STT',
      id: 'ID',
      name: 'Tên giảng viên',
      email: 'Email',
      phone: 'Số điện thoại',
      degree: 'Bằng cấp / Chứng chỉ',
    },
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa khóa học này?',
  },
  notification: {
    error: {
      errorCreate: 'Thêm mới khóa học không thành công',
      errorEdit: 'Cập nhật khóa học không thành công',
      delete: 'Xóa khóa học không thành công',
      update: 'Cập nhật khóa học không thành công',
    },
    success: {
      create: 'Thêm mới khóa học thành công',
      update: 'Cập nhật khóa học thành công',
      delete: 'Xóa khóa học thành công',
    },
  },
  getError: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      id: 'Khóa học không tồn tại',
    },
  },
  createError: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      subjects: 'Học phần không tồn tại',
    },
  },
  updateError: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      id: 'Cập nhật khóa học không thành công. Vì khóa học không tồn tại',
      subjects: 'Học phần không tồn tại',
    },
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      subjects:
        'Cập nhật khóa học không thành công. Vì học phần đang có học viên đăng ký',
    },
  },
  deleteError: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      id: 'Xóa khóa học không thành công vì khóa học không tồn tại',
    },
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      student: 'Xóa khóa học không thành công. Vì khóa học đang có học viên',
      classroom: 'Xóa khóa học không thành công. Vì khóa học đang có lớp học',
    },
    [ErrorCode.ITEM_INVALID]: {
      lessonPast: 'Xóa buổi học không thành công vì buổi học đã kết thúc',
    },
  },
  list: {
    title: 'Danh sách khóa học',
    search: 'Tìm kiếm',
    state: 'Hình thức',
    addBtn: 'Tạo mới',
    totalCourses: 'Tổng số %{totalCourses} khóa học',
    page: 'Trang',
    table: {
      id: 'ID',
      name: 'Tên khóa học',
      times: 'Thời lượng (giờ)',
      state: 'Hình thức',
    },
  },
  coursesType: {
    online: 'Online',
    offline: 'Offline',
  },
  evaluation: {
    excellent: 'Xuất sắc',
    good: 'Giỏi',
    satisfactory: 'Khá',
    pass: 'Trung bình',
    fail: 'Không đạt',
    unevaluated: 'Chưa thể xếp loại',
  },
  evaluationInfo: {
    title: 'Hãy nhập các thang bậc đánh giá vào các ô trống dưới đây',
    subTitle: 'Thang bậc đánh giá bao gồm:',
  },
  result: {
    pass: 'Đỗ',
    fail: 'Trượt',
    unevaluated: '-',
    none: 'Chưa đánh giá',
  },
  deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa {total} khóa học đã chọn?',
  validate: {
    regexCourseName: 'Hãy nhập chữ cái thường, chữ cái in hoa, ký tự số',
    minimumTypeCourse: 'Hình thức là bắt buộc',
    minTimes: `Thời lượng phải tối thiểu là ${MIN_TIMES} giờ`,
    maxTimes: `Thời lượng không được vượt quá ${MAX_TIMES} giờ`,
  },
};

export default coursesVi;
