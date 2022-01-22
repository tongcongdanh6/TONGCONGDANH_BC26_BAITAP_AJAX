"use strict"
import { NhanVien } from '../models/NhanVien.js';
import { renderTable, 
    renderError, 
    showToastify, 
    clearContent,
    clearAllInput,
    focusInput
} from '../modules/ultils.js';
import { Validation } from '../modules/Validation.js';

const getDsNhanVienAndRenderTable = () => {
    let instance_NV = new NhanVien();
    // Lấy danh sách Nhân Viên
    instance_NV.getDanhSachNhanVien().then(result => {
        renderTable('#tblDsNVBody', result.data);
    }).catch(error => {
        showToastify('Lấy danh sách nhân viên THẤT BẠI', 'bg-danger');
        console.error(error.response);
    }).finally(() => {
        console.log("Lấy danh sách Nhân Viên đã xong!");
    });
}

const getInputFromUser = () => {
    // Lấy giá trị từ người dùng
    let arrTagUserInput = document.querySelectorAll('form input, form select');
    let objNhanVien = {};
    for(let tagInput of arrTagUserInput) {
        let {id, value} = tagInput;
        objNhanVien = {...objNhanVien, [id] : value}
    }

    // Thêm thuộc tính Chức vụ (string) vào trong objNhanVien
    objNhanVien = {...objNhanVien, 
        chucVu: document.querySelector('#heSoChucVu')[document.querySelector('#heSoChucVu').selectedIndex].innerText};

    return objNhanVien;
}

export const xoaNhanVien = (staffId) => {
    // Hiển thị confirm trước khi xóa
    $.confirm({
        title: 'Xác nhận xóa',
        content: `Xóa là đi luôn đó, có muốn xóa hông?<br><div class="alert alert-warning mt-3">Mã nhân viên = ${staffId}</div>`,
        type: 'red',
        typeAnimated: true,
        buttons: {
            yes: {
                text: 'Xóa',
                btnClass: 'btn-red',
                action: function(){
                    doXoaNhanVien();
                }
            },
            close: {
                text: 'Khoan đã!',
                btnClass: 'btn-primary',
                action: function() {
                }
            }
        }
    });
    
    const doXoaNhanVien = () => {
        let instance_NV = new NhanVien();
        instance_NV.deleteNhanVien(staffId)
        .then(result => {
            showToastify(`Xóa nhân viên có Mã Nhân Viên = ${staffId} thành công`, 'bg-success');
            getDsNhanVienAndRenderTable();
        }).catch(error => {
            showToastify(`Xóa nhân viên có Mã Nhân Viên = ${staffId} thất bại`, 'bg-danger');
            console.error(error.response);
        }).finally(() => {
            console.log("Request xóa nhân viên đã thực thi xong!");
        });
    }
}

export const suaNhanVien = (staffId) => {
    let instance_NV = new NhanVien();
    let objNhanVien = {};
    instance_NV.getDetailNhanVien(staffId).then(result => {
        objNhanVien = result.data;

        // Show ra UI
        for(let key in objNhanVien) {
            if(key === 'chucVu') continue;
            if(key === 'heSoChucVu') {
                document.querySelector('#'+key).selectedIndex = Number(objNhanVien[key]) - 1;
            }
            else {
                document.querySelector('#'+key).value = objNhanVien[key];
            }
        }

        // Disable input mã nhân viên
        document.querySelector('#maNhanVien').disabled = true;
    }).catch(error => {
        showToastify(`Lỗi lấy thông tin Mã Nhân Viên = ${staffId}`, 'bg-danger');
        console.error(error.response);
    }).finally(() => {
        console.log("Request lấy thông tin nhân viên đã thực thi xong!");
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Khi Document load xong thì thực hiện lấy danh sách Nhân Viên để hiển thị vào bảng
    try {
        let instance_NV = new NhanVien();
        // Load danh sách nhân viên và render
        getDsNhanVienAndRenderTable();
        document.querySelector('#maNhanVien').focus();

        // THÊM NHÂN VIÊN
        document.querySelector("#btnThemNhanVien").onclick = (event) => {
            // Chặn submit form
            event.preventDefault();

            // Lấy input từ user
            let objNhanVien = getInputFromUser();

            // Validate dữ liệu
            // Constructor của Validation nhận vào 2 params
            // 1. Mảng chứa thông tin các field cần validate và rules
            // 2. Object chứa dữ liệu nhập của người dùng
            let validator = new Validation([
                {
                    name: 'maNhanVien',
                    display: 'Mã nhân viên',
                    rules: 'empty|all_numeric|min_length[4]|max_length[6]'
                },
                {
                    name: 'tenNhanVien',
                    display: 'Tên nhân viên',
                    rules: 'empty|all_alphabet|min_length[8]|max_length[64]'
                },
                {
                    name: 'luongCoBan',
                    display: 'Lương cơ bản',
                    rules: 'empty|all_numeric|must_greater_than_or_equal[1000000]|must_less_than_or_equal[20000000]'
                },
                {
                    name: 'soGioLamTrongThang',
                    display: 'Số giờ làm trong tháng',
                    rules: 'empty|all_numeric|must_greater_than_or_equal[50]|must_less_than_or_equal[150]'
                }
            ], objNhanVien);


            let isValid = true; // Biến cờ để kiểm tra dữ liệu có hợp lệ hay không
            let errors = validator.formValidate();
            let arrErrorSelectors = [
                '#maNhanVien_errors',
                '#tenNhanVien_errors',
                '#luongCoBan_errors',
                '#soGioLamTrongThang_errors',
            ];

            // Nếu mảng errors có phần tử thì isValid = false
            isValid = (errors.length > 0) ? false : true;

            if(isValid) {
                // Dữ liệu hợp lệ
                // Clear nội dung container của errors nếu không còn lỗi
                clearContent(arrErrorSelectors);

                // Convert input cho đúng requirement của API
                objNhanVien = {
                    ...objNhanVien,
                    maNhanVien: Number(objNhanVien.maNhanVien), // ép kiểu sang số
                    luongCoBan: Number(objNhanVien.luongCoBan),
                    heSoChucVu: Number(objNhanVien.heSoChucVu), 
                    soGioLamTrongThang: Number(objNhanVien.soGioLamTrongThang),
                };

                // Gọi API
                instance_NV.addNewNhanVien(objNhanVien).then(result => {
                    showToastify('Thêm nhân viên thành công', 'bg-success');
                    // Lấy lại danh sách Nhân Viên rồi render lại table
                    getDsNhanVienAndRenderTable();
                    // Clear tất cả các giá trị của input để cho người dùng dễ thêm nhân viên mới
                    clearAllInput();
                }).catch(error => {
                    showToastify(`Thêm nhân viên thất bại - 
                    ${(!error.response.data.Message) ? 
                        error.response.data : 
                        error.response.data.Message}`, 'bg-danger');
                    console.error(error.response);
                }).finally(() => {
                    console.log("Thao tác Thêm Nhân Viên thực thi xong!");
                });

                document.querySelector('#maNhanVien').focus();
            }
            else {
                // Clear nội dung errors trước khi render lại
                clearContent(arrErrorSelectors);

                // Nếu có lỗi xảy ra
                renderError(errors);
            }
        }


        // Nút Reset trên UI
        document.querySelector('#btnClearAllInput').onclick = (event) => {
            event.preventDefault();
            clearAllInput();

            // Clear toàn bộ nội dung errors trên UI nếu có
            clearContent([
                '#maNhanVien_errors',
                '#tenNhanVien_errors',
                '#luongCoBan_errors',
                '#soGioLamTrongThang_errors'
            ]);

            focusInput('#maNhanVien');
        }

        // Nút Cập Nhật trên UI
        document.querySelector('#btnCapNhat').onclick = (event) => {
            event.preventDefault();
            let instance_NV = new NhanVien();

            // Lấy input từ user
            let objNhanVien = getInputFromUser();

            // Validate dữ liệu
            let validator = new Validation([
                {
                    name: 'tenNhanVien',
                    display: 'Tên nhân viên',
                    rules: 'empty|all_alphabet|min_length[8]|max_length[64]'
                },
                {
                    name: 'luongCoBan',
                    display: 'Lương cơ bản',
                    rules: 'empty|all_numeric|must_greater_than_or_equal[1000000]|must_less_than_or_equal[20000000]'
                },
                {
                    name: 'soGioLamTrongThang',
                    display: 'Số giờ làm trong tháng',
                    rules: 'empty|all_numeric|must_greater_than_or_equal[50]|must_less_than_or_equal[150]'
                }
            ], objNhanVien);


            let isValid = true; // Biến cờ để kiểm tra dữ liệu có hợp lệ hay không
            let errors = validator.formValidate();
            let arrErrorSelectors = [
                '#tenNhanVien_errors',
                '#luongCoBan_errors',
                '#soGioLamTrongThang_errors'
            ];

            // Nếu mảng errors có phần tử thì isValid = false
            isValid = (errors.length > 0) ? false : true;

            if(isValid) {
                clearContent(arrErrorSelectors);

                // Convert input cho đúng requirement của API
                objNhanVien = {
                    ...objNhanVien,
                    luongCoBan: Number(objNhanVien.luongCoBan), // ép kiểu sang số
                    heSoChucVu: Number(objNhanVien.heSoChucVu), 
                    soGioLamTrongThang: Number(objNhanVien.soGioLamTrongThang),
                };

                // Gọi API
                instance_NV.updateNhanVien(objNhanVien.maNhanVien, objNhanVien)
                .then(result => {
                    showToastify(`Cập nhật nhân viên có Mã Nhân Viên = ${objNhanVien.maNhanVien} thành công`, 'bg-success');
                    getDsNhanVienAndRenderTable();
                    clearAllInput();
                }).catch(error => {
                    showToastify(`Cập nhật nhân viên thất bại - 
                    ${(!error.response.data.Message) ? 
                        error.response.data : 
                        error.response.data.Message}`, 'bg-danger');
                        
                    console.error(error.response);
                }).finally(() => {
                    console.log('Thực thi Cập nhật đã xong!');
                });
            }
            else {
                // Clear nội dung errors trước khi render lại
                clearContent(arrErrorSelectors);

                // Render lỗi validate ra UI
                renderError(errors);
            }

        }
    } catch(e) {
        console.error(e);
    }
});



