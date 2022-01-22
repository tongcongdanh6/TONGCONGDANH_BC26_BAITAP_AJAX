export const formatCurrency = (countryCode, currencyCode, number) => {
    // Create our number formatter.
    let formatter = new Intl.NumberFormat(countryCode, {
        style: 'currency',
        currency: currencyCode,
    });

    return formatter.format(number);
}

export const renderTable = (tableSelector, arrData) => {
    let htmlStr = '';

    for(let item of arrData) {
        htmlStr += `
            <tr scope = "row">
                <td>${item.maNhanVien}</td>
                <td>${item.tenNhanVien}</td>
                <td>${item.chucVu}</td>
                <td>${item.heSoChucVu}</td>
                <td>${formatCurrency('vi-VN', 'VND', item.luongCoBan)}</td>
                <td>${item.soGioLamTrongThang}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="import('../controllers/index.js').then(o => o.xoaNhanVien('${item.maNhanVien}'));">Xóa</button>
                    <button class="btn btn-sm btn-info" onclick="import('../controllers/index.js').then(o => o.suaNhanVien('${item.maNhanVien}'));">Sửa</button>
                </td>
            </tr>
        `;
    }

    document.querySelector(tableSelector).innerHTML = htmlStr;
    // console.log('table', arrData);
}

export const renderError = (arrErrors) => {
    // Render lỗi
    for(let error of arrErrors) {
        let errorItem = document.createElement('p');
        errorItem.className = 'text-danger m-0';
        errorItem.innerHTML = `<span class="badge badge-info">${error.elementLabel}</span> ${error.message}`;
        document.querySelector(error.errorSelector).appendChild(errorItem);
    }
}

export const removeVietnameseTones = (str) => {
    // Hàm remove các dầu tiếng Việt
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g," ");
    str = str.trim();
    return str;
}

export const showToastify = (message, styleClass) => {
    Toastify({
        text: message,
        className: styleClass,
        duration: 2500,
        position: 'left',
        gravity: 'top'
    }).showToast();
}

export const clearContent = arrSelector => {
    for(let item of arrSelector) {
        document.querySelector(item).innerHTML = '';
    }
}

export const clearAllInput = () => {
    let arrInput = document.querySelectorAll('form input');
    for(let input of arrInput) {
        input.value = '';
        // Xóa state disabled (nếu có)
        input.disabled = false;
    }

    let arrSelection = document.querySelectorAll('form select');
    for(let select of arrSelection) {
        // Trả về vị trí chọn mặc định của các selection
        select.selectedIndex = 0;
    }
}

export const focusInput = selector => {
    document.querySelector(selector).focus();
}