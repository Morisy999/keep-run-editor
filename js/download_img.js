async function Download(save = Download1) {
    const width = Math.round(Number(document.getElementById('inpt_savePic_width').value));
    if (!Number.isFinite(width) || width < 120 || width > 4096) {
        showMessage('请输入 120 到 4096 之间的导出宽度。');
        return;
    }
    const viewer = save === Download2 ? window.open('about:blank','keepPreview') : null;
    if (save === Download2 && !viewer) {
        showMessage('浏览器拦截了预览窗口，可点击“下载 PNG”。');
        return;
    }
    try {
        await Promise.all([frameImage,actionImage,document.getElementById('bg-img'),document.getElementById('portrait')].filter(img => img.hasAttribute('src')).map(img => img.decode()));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = Math.round(width * 2736 / 1260);
        render(canvas);
        await save(canvas,viewer);
    } catch (error) {
        viewer?.close();
        showMessage('导出失败，请确认头像和地图已加载后重试。');
        console.error(error);
    }
}

function downloadLink(src) {
    const link = document.createElement('a');
    link.download = 'Keep-'+date_year+'-'+addZero(date_month)+'-'+addZero(date_day)+'.png';
    link.href = src;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function Download1(canvas) {
    return new Promise((resolve,reject) => canvas.toBlob(blob => {
        if (!blob) { reject(new Error('PNG encoding failed')); return; }
        const url = URL.createObjectURL(blob);
        downloadLink(url);
        setTimeout(() => URL.revokeObjectURL(url),30000);
        resolve();
    },'image/png'));
}

function Download2(canvas,viewer) {
    viewer.document.title = '运动记录预览';
    const img = viewer.document.createElement('img');
    img.alt = canvas.getAttribute('aria-label');
    img.src = canvas.toDataURL();
    img.style.cssText = 'display:block;max-width:100%;height:auto;margin:auto';
    viewer.document.body.replaceChildren(img);
}

function Download3(canvas) { downloadLink(canvas.toDataURL()); }
function Download4(canvas) { downloadLink(canvas.toDataURL().replace('image/png','application/octet-stream')); }
