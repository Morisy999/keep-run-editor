let tmp_bgimg_osrc, tmp_portrait_src;

function readImageFile(input, apply) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => apply(reader.result);
    reader.onerror = () => showMessage('图片读取失败，请重新选择。');
    reader.readAsDataURL(file);
}

function setbgImg(src) {
    const img = document.getElementById('bg-img');
    const url = src;
    img.src = url;
    return img.decode().then(() => {
        getNaturalSize();
        render();
    }).catch(() => {
        if (img.src === url && img.complete && !img.naturalWidth) {
            showMessage('地图读取失败，请重新选择图片。');
        }
    });
}

function bgimg_inpt() {
    readImageFile(document.getElementById('inpt_bgimg'), data => {
        tmp_bgimg_osrc = bgSRC = data;
        setbgImg(data);
    });
}

function portrait_inpt() {
    readImageFile(document.getElementById('inpt_portrait'), data => {
        tmp_portrait_src = data;
        document.getElementById('portrait').src = data;
    });
}

function init_bgimg() {
    tmp_bgimg_osrc = bgSRC = '';
    document.getElementById('inpt_bgimg').value = '';
    document.getElementById('bg-img').removeAttribute('src');
    current_img_width = 1260;
    current_img_height = 945;
    render();
}

function init_portrait() {
    tmp_portrait_src = '';
    document.getElementById('inpt_portrait').value = '';
    document.getElementById('portrait').removeAttribute('src');
    render();
}
