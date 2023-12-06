import { ErrorCode } from '@/common/constants';

export const syllabusForm = {
  syllabusName: 'Tên giáo trình',
  cover: 'Ảnh bìa',
  lectureName: 'Tên bài giảng',
  subject: 'Học phần',
  files: 'Tài liệu',
  editNote: 'Nội dung chỉnh sửa',
  links: 'Link tài liệu',
};
const syllabusVi = {
  list: {
    title: 'Danh sách giáo trình',
    totalSyllabuses: 'Tổng số %{total} giáo trình',
    table: {
      id: 'ID',
      name: 'Tên giáo trình',
      numberOfLectures: 'Số lượng bài giảng',
      createdAt: 'Ngày tạo',
      createdBy: 'Người tạo',
      updatedAt: 'Ngày chỉnh sửa',
      updatedBy: 'Người chỉnh sửa',
    },
    grid: {
      numberOfLectures: '{number} bài giảng',
    },
  },
  detail: {
    title: 'Chi tiết giáo trình',
    info: {
      createdAt: 'Ngày tạo',
      updatedAt: 'Ngày chỉnh sửa',
      createdBy: 'Người tạo',
      updatedBy: 'Người chỉnh sửa',
      subject: 'Học phần',
      upload: 'Tải ảnh lên',
    },
    lectureList: {
      title: 'Danh sách bài giảng',
      total: 'Tổng số {total} bài giảng',
      table: {
        index: 'STT',
        name: 'Tên bài giảng',
        subject: 'Học phần',
        file: 'Tài liệu',
      },
    },
    updateHistories: {
      title: 'Lịch sử chỉnh sửa',
      total: 'Tổng số {total} bản ghi',
      table: {
        index: 'STT',
        updatedAt: 'Thời gian chỉnh sửa',
        updatedBy: 'Người chỉnh sửa',
        note: 'Nội dung chỉnh sửa',
      },
    },
  },
  lectureDialog: {
    update: { title: 'Chỉnh sửa bài giảng' },
    create: { title: 'Tạo mới bài giảng' },
  },
  basicInfoDialog: {
    update: { title: 'Chỉnh sửa giáo trình' },
  },
  button: {
    create: 'Tạo',
    addMoreLecture: 'Thêm bài giảng',
    save: 'Lưu',
  },
  form: {
    title: {
      create: 'Tạo mới giáo trình',
      update: 'Chỉnh sửa giáo trình',
    },
    name: {
      label: 'Tên giáo trình',
      placeholder: 'Nhập tên giáo trình',
    },
    image: {
      label: 'Ảnh bìa',
      placeholder: 'Tải lên ảnh bìa',
      pressToUpload: 'Nhấn để tải ảnh lên',
      orDragAndDrop: ' hoặc kéo và thả',
      fileTypesAndSize: 'PNG hoặc JPG (Dung lượng tệp: < 1MB)',
    },
    note: {
      label: 'Nội dung chỉnh sửa',
      placeholder: 'Nhập nội dung chỉnh sửa',
    },
    lecture: {
      label: 'Bài giảng',
      subLabel: 'Bài giảng {index}',
    },
    lectureName: {
      label: 'Tên bài giảng',
      placeholder: 'Nhập tên bài giảng',
    },
    lectureSubject: {
      label: 'Học phần',
      placeholder: 'Chọn học phần',
    },
    lectureSyllabus: {
      label: 'Tài liệu',
    },
    lectureFile: {
      label: 'File',
      pressToUpload: 'Nhấn để tải tài liệu lên',
      placeholder: 'Tải lên tài liệu',
      fileTypesAndSize: 'PDF hoặc MP4, WMV, MOV (Dung lượng tệp: < 500MB)',
    },
    lectureLink: {
      label: 'Link',
      placeholder: 'Nhập link tài liệu',
    },
    message: {
      lectureEmpty: 'Tài liệu là bắt buộc',
      invalidLink: 'Đường dẫn không hợp lệ',
      duplicateLectureName: 'Tên bài giảng đang bị trùng nhau',
    },
  },
  delete: {
    syllabus: {
      confirmText: 'Bạn có chắc chắn muốn xóa {total} giáo trình đã chọn?',
      assignedToClassroom: 'Giáo trình đang được giao cho lớp học',
      confirmTextWithoutTotal: 'Bạn có chắc chắn muốn xóa giáo trình này?',
    },
    lecture: {
      confirmText: 'Bạn có chắc chắn muốn xóa {total} bài giảng đã chọn?',
    },
  },
  success: {
    create: 'Thêm mới giáo trình thành công',
    update: 'Cập nhật giáo trình thành công',
    delete: 'Xóa giáo trình thành công',
    createLecture: 'Thêm mới bài giảng thành công',
    updateLecture: 'Cập nhật bài giảng thành công',
    deleteLecture: 'Xóa bài giảng thành công',
  },
  error: {
    create: 'Thêm mới giáo trình không thành công',
    update: 'Cập nhật giáo trình không thành công',
    delete: 'Xóa giáo trình không thành công',
    createLecture: 'Thêm mới bài giảng không thành công',
    updateLecture: 'Cập nhật bài giảng không thành công',
    deleteLecture: 'Xóa bài giảng không thành công',
    upload: 'Lỗi tải lên',
    contentType: 'Định dạng tệp không hợp lệ',
    fileSize: 'Dung lượng tệp tải lên vượt quá dung lượng cho phép',
  },
  createError: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      subject:
        'Thêm mới giáo trình không thành công. Vì có học phần trong bài giảng không tồn tại',
    },
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      name: 'Tên giáo trình đã tồn tại',
    },
  },
  updateError: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      id: 'Cập nhật giáo trình không thành công. Vì giáo trình không tồn tại',
      subject:
        'Cập nhật giáo trình không thành công. Vì có học phần trong bài giảng không tồn tại',
      lecture: {
        id: 'Cập nhật giáo trình không thành công. Vì bài giảng không tồn tại',
        syllabusId: 'Cập nhật giáo trình không thành công. Vì giáo trình không tồn tại',
      },
    },
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      name: 'Tên giáo trình đã tồn tại',
      lecture: {
        name: 'Tên bài giảng đã tồn tại',
      },
    },
  },
};

export default syllabusVi;
