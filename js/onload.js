window.addEventListener('load', async () => {
    const now = new Date();
    date_year = now.getFullYear();
    date_month = now.getMonth() + 1;
    date_day = now.getDate();
    time_hour = now.getHours();
    time_min = now.getMinutes();
    username = '用户名';
    keep_title = '户外跑步';
    humidity = 23;
    temperature = 19;
    km_min = 2.2;
    km_max = 3.9;
    speed_min = 4.3;
    speed_max = 5.2;
    miles = 2.04;
    speeds = 4.54;
    bs = true;
    bs_prob = 0.08;
    bs_range_min = 30;
    bs_range_max = 40;
    savePic_width = 1260;
    amap_key = '';
    document.getElementById('portrait').onload = () => render();
    initInputData();
    init_portrait();
    init_bgimg();
    render();

    if (!db) {
        if (request.readyState === 'done') return;
        await new Promise(resolve => {
            request.addEventListener('success', resolve, {once:true});
            request.addEventListener('error', resolve, {once:true});
        });
    }
    if (!db) return;
    const read = key => new Promise(resolve => retrieveData(key,(err,data) => resolve(data)));
    const [prefs, avatar, background] = await Promise.all(['user_info','user_portrait','user_bgimg'].map(read));
    if (prefs) {
        username = prefs.username ?? username;
        keep_title = prefs.keep_title ?? keep_title;
        km_min = Number(prefs.km_min ?? km_min);
        km_max = Number(prefs.km_max ?? km_max);
        speed_min = Number(prefs.speed_min ?? speed_min);
        speed_max = Number(prefs.speed_max ?? speed_max);
        bs = prefs.bs ?? bs;
        bs_prob = prefs.bs_prob ?? bs_prob;
        bs_range_min = prefs.bs_range_min ?? bs_range_min;
        bs_range_max = prefs.bs_range_max ?? bs_range_max;
        savePic_width = prefs.savePic_width || savePic_width;
        amap_key = prefs.amap_key || '';
        initInputData();
        set_km_and_speed();
        document.getElementById('inpt_colorchange_checkbox').checked = bs;
        inpt_colorchange_checkbox_onchange();
        document.getElementById('show-pb').checked = prefs.showPB ?? true;
        if (prefs.recordFields) {
            for (const input of document.querySelectorAll('[id^="record-"]')) {
                input.value = prefs.recordFields[input.id] ?? input.value;
            }
        }
        if (amap_key) updateWeatherFromAPI();
    }
    if (avatar?.portrait_data) {
        tmp_portrait_src = avatar.portrait_data;
        document.getElementById('portrait').src = tmp_portrait_src;
    }
    if (background?.bgimg_data) {
        tmp_bgimg_osrc = bgSRC = background.bgimg_data;
        await setbgImg(bgSRC);
    }
    render();
});
