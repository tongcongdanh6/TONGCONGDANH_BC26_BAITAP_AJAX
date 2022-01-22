export class NhanVien {
    getDanhSachNhanVien() {
        return axios({
            url: 'http://svcy.myclass.vn/api/QuanLyNhanVienApi/LayDanhSachNhanVien',
            method: 'GET',
            reponseType: 'json'
        });
    }

    addNewNhanVien(newStaff) {
        return axios({
            url: 'http://svcy.myclass.vn/api/QuanLyNhanVienApi/ThemNhanVien',
            data: newStaff,
            method: 'POST',
            reponseType: 'json'
        });
    }

    deleteNhanVien(staffId) {
        return axios({
            url: `http://svcy.myclass.vn/api/QuanLyNhanVienApi/XoaNhanVien?maSinhVien=${staffId}`,
            method: 'DELETE',
            reponseType: 'json'
        }); 
    }

    updateNhanVien(staffId, objStaff) {
        return axios({
            url: `http://svcy.myclass.vn/api/QuanLyNhanVienApi/CapNhatThongTinNhanVien?maNhanVien=${staffId}`,
            data: objStaff,
            method: 'PUT',
            reponseType: 'json'
        });
    }

    getDetailNhanVien(staffId) {
        return axios({
            url: `http://svcy.myclass.vn/api/QuanLyNhanVienApi/LayThongTinNhanVien?maNhanVien=${staffId}`,
            method: 'GET',
            reponseType: 'json'
        });  
    }
}