export class DanhSachNhanVien {
    constructor() {
        this.danhSachNhanVien = [];
    }

    getDanhSachNhanVien() {
        return axios({
            url: 'http://svcy.myclass.vn/api/QuanLyNhanVienApi/LayDanhSachNhanVien',
            method: 'GET',
            reponseType: 'json'
        });
    }
}