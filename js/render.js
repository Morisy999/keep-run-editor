// All measurements use the reference screenshot's 943 × 2048 design grid.
const recordWidth = 943;
const recordHeight = 2048;
const frameImage = new Image();
const actionImage = new Image();
frameImage.onload = actionImage.onload = () => render();
frameImage.src = templateAssets.frame;
actionImage.src = templateAssets.actions;

function mapPlacement(width, height, targetWidth, targetHeight) {
    const scale = Math.max(targetWidth / width, targetHeight / height);
    const w = width * scale, h = height * scale;
    return {x: (targetWidth-w)/2, y: (targetHeight-h)/2, w, h};
}

function render(target = document.getElementById('new-Img')) {
    if (!frameImage.naturalWidth || !Number.isFinite(miles)) return;
    const ctx = target.getContext('2d');
    ctx.setTransform(target.width / recordWidth, 0, 0, target.height / recordHeight, 0, 0);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, recordWidth, recordHeight);
    const get = id => document.getElementById(id);
    const val = id => get(id).value.trim();
    const imageReady = img => img.complete && img.naturalWidth > 0;
    const map = get('bg-img');
    if (imageReady(map)) {
        const rect = mapPlacement(map.naturalWidth, map.naturalHeight, 943, 708);
        ctx.save();
        ctx.beginPath(); ctx.rect(0, 669, 943, 708); ctx.clip();
        ctx.drawImage(map, rect.x, 669 + rect.y, rect.w, rect.h);
        ctx.restore();
    }
    ctx.drawImage(frameImage, 0, 0, recordWidth, recordHeight);
    const text = (value, x, y, size, weight, color, limit) => {
        ctx.fillStyle = color;
        ctx.font = weight + ' ' + size + 'px Arial, "Microsoft YaHei", sans-serif';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(String(value), x, y, limit);
    };
    // Replace the clock embedded in the frame, keeping the adjacent sleep icon.
    ctx.fillStyle = '#fff';
    ctx.fillRect(80, 58, 130, 55);
    text(val('record-status-time'), 85, 101, 44, 650, '#000', 118);
    const portrait = get('portrait');
    if (imageReady(portrait)) {
        const side = Math.min(portrait.naturalWidth, portrait.naturalHeight);
        ctx.save(); ctx.beginPath(); ctx.arc(72, 306, 36, 0, 2*Math.PI); ctx.clip();
        ctx.drawImage(portrait, (portrait.naturalWidth-side)/2, (portrait.naturalHeight-side)/2, side, side, 36,270,72,72);
        ctx.restore();
    }
    const pad = n => String(n).padStart(2,'0');
    const formatDuration = seconds => [Math.floor(seconds/3600), Math.floor(seconds/60)%60, seconds%60].map(pad).join(':');
    function parseDuration(value, fallback) {
        if (!/^\d{1,3}:[0-5]\d:[0-5]\d$/.test(value)) return fallback;
        const [h,m,s] = value.split(':').map(Number);
        return h*3600+m*60+s;
    }
    const pace = Number.isFinite(speeds) ? Math.max(0,Math.floor(speeds)*60 + Math.round((speeds%1)*100)) : 0;
    const duration = parseDuration(val('record-duration'), Math.max(0,Math.round(miles * pace)));
    const elapsed = Math.max(duration,parseDuration(val('record-elapsed'),duration));
    const finish = (time_hour * 60 + time_min + Math.floor(elapsed / 60)) % 1440;
    const date = [date_year,pad(date_month),pad(date_day)].join('/');
    const time = pad(time_hour)+':'+pad(time_min)+' – '+pad(Math.floor(finish/60))+':'+pad(finish%60);
    text(username,126,306,32,650,'#282829',770);
    const weather = get('weather_Select').selectedOptions[0]?.textContent || '';
    text(date+' '+time+' '+[val('record-city'), weather, temperature+'°C'].filter(Boolean).join(' · '),126,340,28,400,'#999',787);
    text(keep_title,108,463,40,650,'#34313c',520);
    const distance = Math.max(0,miles).toFixed(2);
    ctx.save();
    ctx.translate(31,0);
    ctx.scale(0.85,1);
    text(distance,0,612,148,800,'#000',560);
    const distanceWidth=0.85*Math.min(560,ctx.measureText(distance).width);
    ctx.restore();
    text('公里',42+distanceWidth,614,36,600,'#181818',100);
    const best = val('record-best');
    if (get('show-pb').checked && best) {
        ctx.fillStyle='#d9af74'; ctx.fillRect(697,610,151,33);
        ctx.textAlign='center'; text('成绩 '+best,772,635,22,600,'#fff',144); ctx.textAlign='left';
    } else {
        ctx.fillStyle='#fff'; ctx.fillRect(632,441,283,211);
    }
    if (map.hasAttribute('src') && imageReady(map)) {
        text('慢',35,1355,22,500,'#ef6668',28);
        const legend=ctx.createLinearGradient(66,0,159,0);
        legend.addColorStop(0,'#ef5353'); legend.addColorStop(.25,'#e55c5b'); legend.addColorStop(.6,'#1dc68d'); legend.addColorStop(1,'#27d9fa');
        ctx.fillStyle=legend; ctx.beginPath(); ctx.roundRect(67,1340,90,10,5);ctx.fill();
        text('快',166,1355,22,500,'#26d8ee',28);
    }
    const paceText=pad(Math.floor(pace/60))+'′'+pad(pace%60)+'″';
    text(formatDuration(duration),44,1738,54,700,'#050505',287);
    text(paceText,390,1738,54,700,'#050505',245);
    const kcal=val('record-kcal') || Math.round(69*miles*1.036);
    text(kcal,718,1738,54,700,'#050505',133);
    text('千卡',728+Math.min(ctx.measureText(kcal).width,133),1738,28,500,'#111',65);
    text(formatDuration(elapsed),44,1877,50,700,'#aaa',286);
    text(val('record-load')||'—',390,1877,50,700,'#aaa',245);
    text(val('record-climb')||'—',718,1877,50,700,'#aaa',170);
    const fade=ctx.createLinearGradient(0,1823,0,1881);
    fade.addColorStop(0,'rgba(255,255,255,0)');fade.addColorStop(1,'white');
    ctx.fillStyle=fade;ctx.fillRect(0,1823,943,60);
    if (imageReady(actionImage)) ctx.drawImage(actionImage,64,1838,815,122);
    target.setAttribute('aria-label',keep_title+'，'+username+'，'+distance+' 公里，训练时长 '+formatDuration(duration)+'，平均配速 '+paceText);
}
