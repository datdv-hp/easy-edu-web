import { ErrorCode } from '@/common/constants';

const subjectsVi = {
  create: {
    title: 'Tạo mới học phần',
    infoTitle: 'Thông tin học phần',
    documentTitle: 'Thêm tài liệu',
    btn: {
      cancel: 'Hủy',
      save: 'Lưu',
    },
    name: {
      label: 'Tên học phần',
      placeholder: 'Nhập tên học phần',
    },
    code: {
      label: 'Mã học phần',
      placeholder: 'Nhập mã học phần',
    },
    time: {
      label: 'Thời lượng (giờ)',
      placeholder: 'Nhập thời lượng (giờ)',
    },
    description: {
      label: 'Mô tả',
      placeholder: 'Nhập nội dung mô tả học phần',
    },
    document: {
      title: 'Tài liệu',
      name: {
        label: 'Tên tài liệu',
        placeholder: 'Nhập tên tài liệu',
      },
      link: {
        label: 'Link',
        placeholder: 'Nhập link',
      },
    },
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      subjectCode: 'Mã học phần đã tồn tại',
    },
  },
  get: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      id: 'Học phần không tồn tại',
    },
  },
  update: {
    title: 'Chỉnh sửa học phần',
    [ErrorCode.ITEM_NOT_FOUND]: {
      id: 'Học phần không tồn tại',
    },
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      subjectCode: 'Mã học phần đã tồn tại',
    },
  },
  delete: {
    title: 'Xác nhận xóa',
    text: 'Bạn chắc chắn muốn xóa %{totalSelectedCourses} học phần đã chọn ?',
    [ErrorCode.ITEM_NOT_FOUND]: {
      id: 'Học phần không tồn tại',
    },
    [ErrorCode.CONFLICT]: {
      course: 'Học phần đang có trong một khóa học',
    },
  },
  notification: {
    error: {
      create: 'Thêm mới học phần không thành công',
      update: 'Cập nhật học phần không thành công',
      delete: 'Xóa học phần không thành công',
    },
    success: {
      create: 'Thêm mới học phần thành công',
      update: 'Cập nhật học phần thành công',
      delete: 'Xóa học phần thành công',
    },
  },
  list: {
    title: 'Danh sách học phần',
    search: 'Tìm kiếm',
    state: 'Trạng thái',
    addBtn: 'Tạo mới',
    totalCourses: 'Tổng số %{totalCourses} học phần',
    page: 'Trang',
    table: {
      id: 'ID',
      name: 'Tên học phần',
      code: 'Mã học phần',
      time: 'Thời lượng (giờ)',
    },
  },
  buttons: {
    cancel: 'Hủy',
    save: 'Lưu',
    delete: 'Xóa',
  },
  deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa {total} học phần đã chọn?',
  validate: {
    regexSubjectName: 'Hãy nhập chữ cái thường, chữ cái in hoa, ký tự số',
    regexSubjectCode: 'Hãy nhập chữ cái thường, chữ cái in hoa, ký tự số',
  },
};

export default subjectsVi;
