"use strict"
import { NhanVien } from '../models/NhanVien.js';
import { DanhSachNhanVien } from '../models/DanhSachNhanVien.js';
import { renderTable, renderError } from '../modules/ultils.js';
import { Validation } from '../modules/Validation.js';


document.addEventListener('DOMContentLoaded', function() {
    // Khi Document load xong thì thực hiện lấy danh sách Nhân Viên để hiển thị vào bảng
    try {
        let dsNhanVien = new DanhSachNhanVien();
        // Lấy danh sách Nhân Viên
        dsNhanVien.getDanhSachNhanVien().then(result => {
            renderTable('#tblDsNVBody',result.data);
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            console.log("Lấy danh sách Nhân Viên đã xong!");
        });


        // THÊM NHÂN VIÊN
        document.querySelector("#btnThemNhanVien").onclick = (event) => {
            // Chặn submit form
            event.preventDefault();

            // Lấy giá trị từ người dùng
            let arrTagUserInput = document.querySelectorAll('form input, form select');
            let objNhanVien = {};
            for(let tagInput of arrTagUserInput) {
                let {id, value} = tagInput;
                objNhanVien = {...objNhanVien, [id] : value}
            }

            // Validate dữ liệu
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

            let isValid = true;
            
            // Không được rỗng
            // for(let key in objNhanVien) {
            //     // Không validate heSoChucVu
            //     if(['heSoChucVu'].includes(key)) continue;
            //     isValid &= validator.checkEmpty(`#validate_${key}_empty`, objNhanVien[key]);
            // }

            let errors = validator.formValidate();

            // Nếu mảng errors có phần tử thì isValid = false
            isValid = (errors.length > 0) ? false : true;

            if(isValid) {
                // Dữ liệu hợp lệ
                // Clear nội dung container của errors nếu không còn lỗi
                document.querySelector('#errors_container').innerHTML = '';
                document.querySelector('#errors_container').className = '';

                // Thêm nhân viên mới

            }
            else {
                renderError('#errors_container', errors, 'Lỗi nhập dữ liệu');
            }
        }
    } catch(e) {
        console.log(e);
    }
    
});



