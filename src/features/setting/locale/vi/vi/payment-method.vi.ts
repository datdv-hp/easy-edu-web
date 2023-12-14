import { ErrorCode } from '@/common/constants';

export const paymentMethodVi = {
    list: {
        title: 'Danh sách phương thức thanh toán',
        total: 'Tổng số {total} phương thức thanh toán',
        table: {
            name: 'Tên phương thức thanh toán',
            action: 'Hành động',
        },
    },
    form: {
        name: 'Tên phương thức thanh toán',
        placeholder: {
            name: 'Nhập tên phương thức thanh toán',
        },
        create: {
            title: 'Tạo phương thức thanh toán',
        },
        update: {
            title: 'Chỉnh sửa phương thức thanh toán',
        },
    },
    deleteConfirmMessageTotal:
        'Bạn có chắc chắn muốn xóa {total} phương thức thanh toán đã chọn?',
    success: {
        delete: 'Xóa phương thức thanh toán thành công',
        create: 'Thêm mới phương thức thanh toán thành công',
        update: 'Cập nhật phương thức thanh toán thành công',
    },
    error: {
        delete: 'Xóa phương thức thanh toán không thành công',
        create: 'Thêm mới phương thức thanh toán không thành công',
        update: 'Cập nhật phương thức thanh toán không thành công',
    },
    updateError: {
        [ErrorCode.ITEM_ALREADY_EXIST]: {
            name: 'Tên phương thức thanh toán đã tồn tại',
        },
        [ErrorCode.ITEM_NOT_FOUND]: {
            id: 'Cập nhật phương thức thanh toán không thành công. Vì phương thức thanh toán không tồn tại',
        },
    },
    createError: {
        [ErrorCode.ITEM_ALREADY_EXIST]: {
            name: 'Tên phương thức thanh toán đã tồn tại',
        },
    },
    deleteError: {
        [ErrorCode.ITEM_NOT_FOUND]: {
            id: 'Xóa phương thức thanh toán không thành công. Vì phương thức thanh toán không tồn tại',
        },
    },
    action: {
        edit: 'Chỉnh sửa phương thức thanh toán',
    },
};
export const paymentMethodFormVi = {
    name: 'Tên phương thức thanh toán',
};
