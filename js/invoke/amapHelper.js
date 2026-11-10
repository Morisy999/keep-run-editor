// amapHelper.js

function loadAMapWeather(apiKey) {
    return new Promise((resolve, reject) => {
        // 如果没有提供API key，拒绝请求
        if (!apiKey || apiKey.trim() === '') {
            reject(new Error('请提供高德地图API Key'));
            return;
        }

        // 使用新的REST API
        const city = '230100'; // 哈尔滨城市编码
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=${apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('天气API请求失败');
                }
                return response.json();
            })
            .then(data => {
                if (data.status !== '1' || !data.lives || data.lives.length === 0) {
                    throw new Error('天气数据格式错误');
                }

                const weatherInfo = data.lives[0];
                
                // 处理天气类型映射
                let weatherType = weatherInfo.weather;
                let weatherImage = 'images/weather3.png'; // 默认阴天
                
                if (weatherType === '晴') {
                    weatherImage = 'images/weather1.png';
                } else if (weatherType === '多云') {
                    weatherImage = 'images/weather2.png';
                }
                // 其他所有天气都使用阴天图标
                
                // 返回标准化的数据格式
                resolve({
                    city: weatherInfo.city,
                    temperature: weatherInfo.temperature,
                    humidity: weatherInfo.humidity,
                    weather: weatherType,
                    weatherImage: weatherImage
                });
            })
            .catch(error => {
                reject(error);
            });
    });
}
