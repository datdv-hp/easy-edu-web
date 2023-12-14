import { ErrorCode } from '@/common/constants';
import { LessonStatus } from '../../constants';

export default {
  list: 'Danh sách buổi học',
  form: {
    title: {
      create: 'Tạo mới buổi học',
      edit: 'Chỉnh sửa buổi học',
      infoTitle: 'Thông tin buổi học',
      timeTitle: 'Thời gian học',
    },
    course: 'Khóa học',
    classroom: 'Lớp học',
    subject: 'Học phần',
    name: 'Tên buổi học',
    teacher: 'Giảng viên',
    room: 'Phòng học',
    totalStudents: 'Tổng số học viên',
    document: 'Link tài liệu',
    date: 'Ngày bắt đầu',
    repeat: 'Lặp lại',
    repeatDesc: 'Lặp lại vào',
    recordings: 'File ghi hình buổi học',
    student: 'Thêm học viên',
    syllabus: 'Giáo trình',
    lecture: 'Bài giảng',
    placeholder: {
      course: 'Khóa học',
      classroom: 'Chọn lớp học',
      subject: 'Chọn học phần',
      name: 'Nhập tên buổi học',
      teacher: 'Chọn giảng viên',
      room: 'Nhập phòng học',
      totalStudents: '0',
      document: 'Nhập link tài liệu',
      date: 'Ngày bắt đầu',
      repeat: 'Lặp lại',
      repeatDesc: 'Lặp lại vào',
      time: 'HH:MM',
      meetUrl: 'Nhập link buổi học',
      recordings: 'Nhập file ghi hình buổi học',
      student: 'Chọn học viên',
      syllabus: 'Chọn giáo trình',
      lecture: 'Chọn bài giảng',
    },
    preview: 'Xem trước',
    noData: {
      teacher: 'Hiện chưa có giảng viên nào',
      subject: 'Hiện chưa có học phần nào',
      classroom: 'Hiện chưa có lớp học nào',
    },
    useGoogleMeet: 'Sử dụng Google Meet',
    meetUrl: 'Link buổi học',
    repeatOption: {
      no_repeat: 'Không lặp lại',
      every_day: 'Lặp lại hàng ngày',
      even_day: 'Lặp lại thứ 2, thứ 4, thứ 6',
      odd_day: 'Lặp lại thứ 3, thứ 5, thứ 7',
      other_repeat: 'Tùy chọn',
      placeholder: 'Chọn lặp lại',
    },
    to: 'đến',
    remove: 'Loại bỏ',
    undo: 'Quay lại',
    message: {
      overlapTimeError: 'Thời gian học bị trùng',
    },
  },
  table: {
    index: 'STT',
    id: 'ID',
    name: 'Tên buổi học',
    time: 'Thời gian',
    remove: 'Xóa',
    classroom: 'Lớp',
    course: 'Khóa học',
    room: 'Phòng học',
    subject: 'Tên học phần',
    teacher: 'Giảng viên',
    status: 'Trạng thái',
  },
  detail: {
    info: {
      title: 'Thông tin buổi học',
      id: 'ID',
      course: 'Khóa học',
      classroom: 'Lớp học',
      subject: 'Học phần',
      teacher: 'Giảng viên',
      room: 'Phòng học',
      date: 'Ngày học',
      time: 'Giờ học',
      totalStudents: 'Số lượng học viên',
      totalParticipants: 'Số lượng học viên tham gia',
      document: 'Tài liệu',
      recordFile: 'File ghi màn hình buổi học',
      recordings: 'File ghi màn hình buổi học',
      lessonName: 'Tên buổi học',
    },
    attendance: {
      title: 'Danh sách điểm danh',
      table: {
        index: 'STT',
        id: 'ID',
        studentName: 'Tên học viên',
        status: 'Trạng thái',
        reason: 'Lý do',
      },
      status: {
        absence: 'Vắng mặt có phép',
        leave: 'Vắng mặt',
        attended: 'Có mặt',
        undefined: '',
      },
    },
    status: {
      upcoming: ' (Chưa diễn ra)',
      ongoing: ' (Đang diễn ra)',
      completed: ' (Đã kết thúc)',
    },
    messages: {
      deleteConfirm: 'Bạn có chắc chắn muốn xóa buổi học này?',
    },
  },
  total: 'Tổng số %{total} buổi học',
  notification: {
    error: {
      create: 'Thêm mới buổi học không thành công',
      delete: 'Xóa buổi học không thành công',
      createInThePast: 'Không được tạo buổi học trong quá khứ',
      update: 'Cập nhật buổi học không thành công',
      notCreateOverNightLesson: 'Không thể tạo buổi học diễn ra quá 1 ngày',
    },
    success: {
      create: 'Thêm mới buổi học thành công',
      edit: 'Cập nhật buổi học thành công',
      delete: 'Xóa buổi học thành công',
    },
  },
  get: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      id: 'Buổi học không tồn tại',
    },
  },
  update: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      id: 'Buổi học không tồn tại',
    },
    [ErrorCode.GROUP_MAX_QUANTITY]: {
      subject:
        'Học phần này đã tạo đủ buổi so với thời lượng',
    },
    [ErrorCode.ITEM_INVALID]: {
      time: 'Chỉ được cập nhật tài liêu và file ghi hình buổi học',
      updateTime:
        'Thời gian diễn ra buổi học là quá khứ',
    },
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      teacher:
        'Giảng viên đã có lịch dạy vào khoảng thời gian diễn ra buổi học',
      classroom:
        'Thời gian buổi học bị trùng với một buổi học khác đang có trong lớp học',
    },
  },
  create: {
    [ErrorCode.ITEM_INVALID]: {
      time: 'Không được tạo buổi học trong quá khứ',
      student: 'Học viên {students} không tồn tại',
    },
    [ErrorCode.ITEM_NOT_FOUND]: {
      classroom: 'Lớp học không tồn tại',
      teacher: 'Giảng viên không tồn tại',
      subject: 'Học phần không tồn tại',
    },
    [ErrorCode.GROUP_MAX_QUANTITY]: {
      subject:
        'Học phần này đã tạo đủ buổi so với thời lượng',
    },
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      teacher: 'Giảng viên đã có lịch dạy vào khoảng thời gian này',
      students: 'Học viên {students} có buổi học diễn ra trong thời gian này',
      classroom:
        'Thời gian buổi học bị trùng với một buổi học khác đang có trong lớp học',
    },
  },
  delete: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      id: 'Buổi học không tồn tại',
    },
    [ErrorCode.ITEM_INVALID]: {
      lessonHappening: 'Buổi học đang diễn ra',
      lessonPast: 'Buổi học đã kết thúc',
      lessonUpcoming:
        'Buổi học có thời gian sắp diễn ra nhỏ hơn 8 tiếng',
    },
  },
  validate: {
    coincidedLesson:
      'Thời gian buổi học bị trùng với một buổi học khác đang có trong lớp học',
    studentInOtherLesson: 'Học viên {students} có buổi học diễn ra trong thời gian này',
    teacherInOtherLesson: 'Giảng viên đã có lịch dạy vào khoảng thời gian này',
    classroomNotFound: 'Lớp học không tồn tại',
    subjectNotFound: 'Học phần không tồn tại',
    teacherNotFound: 'Giảng viên không tồn tại',
  },
  status: {
    [LessonStatus.UPCOMING]: 'Chưa diễn ra',
    [LessonStatus.ONGOING]: 'Đang diễn ra',
    [LessonStatus.COMPLETED]: 'Đã kết thúc',
  },
  filter: {
    course: 'Khóa học',
    status: 'Trạng thái',
    classroom: 'Lớp học',
    subject: 'Khóa học',
    noData: {
      course: 'Hiện chưa có khóa học nào',
      classroom: 'Hiện chưa có lớp học nào',
    },
  },
  deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa {total} buổi học đã chọn?',
  previewTitle: 'Xem thông tin các buổi học',
  linkRoomOnlineType: {
    google_meet: 'Google Meet',
    zoom: 'Zoom',
    undefined: '',
  },
};
