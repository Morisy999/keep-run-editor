//选择天气
function weather_Select_onChange() {

    render(); // 手动选择天气后也更新渲染
}

//更新天气数据
async function updateWeatherFromAPI() {
    // 先更新amap_key变量为当前输入框的值
    amap_key = document.getElementById("inpt_amap_key").value;
    
    // 检查是否有API key
    if (!amap_key || amap_key.trim() === '') {
        showMessage('请先输入高德地图API Key');
        return;
    }
    
    try {
        console.log('正在获取天气数据...');
        const weatherData = await loadAMapWeather(amap_key);
        
        // 更新温度
        document.getElementById("record-city").value = weatherData.city;
        temperature = parseInt(weatherData.temperature);
        document.getElementById("inpt_temperature").value = temperature;
        
        // 更新湿度
        humidity = parseInt(weatherData.humidity);
        document.getElementById("inpt_humidity").value = humidity;
        
        // 更新天气图标（双向绑定）
        document.getElementById("weather_Select").value = weatherData.weatherImage;
        
        console.log("天气数据更新成功:", weatherData.weather, temperature + "℃", humidity + "%");
        showMessage('天气数据更新成功！\n天气：' + weatherData.weather + '\n温度：' + temperature + '℃\n湿度：' + humidity + '%');
        
        // 更新完后调用render刷新显示
        render();
    } catch (err) {
        console.error("获取天气数据失败:", err);
        showMessage('天气数据获取失败：' + err.message + '\n请检查API Key是否正确');
    }
}
