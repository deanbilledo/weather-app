// Storm Glass API service
const WeatherAPI = {
    API_KEY: 'put your api heres', 
    BASE_URL: 'https://api.stormglass.io/v2',
    
    // Get current weather by coordinates
    async getCurrentWeather(lat, lon) {
        try {
            console.log(`Fetching current weather for lat: ${lat}, lon: ${lon}`);
            const response = await fetch(`${this.BASE_URL}/weather/point?lat=${lat}&lng=${lon}&params=airTemperature,humidity,windSpeed,precipitation,cloudCover,visibility&source=noaa`, {
                headers: {
                    'Authorization': this.API_KEY
                }
            });
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Convert Storm Glass format to a format compatible with our app
            return this.convertCurrentWeatherFormat(data);
        } catch (error) {
            console.error('Error fetching current weather:', error);
            return null;
        }
    },
    
    // Get forecast by coordinates
    async getForecast(lat, lon) {
        try {
            console.log(`Fetching forecast for lat: ${lat}, lon: ${lon}`);
            const response = await fetch(`${this.BASE_URL}/weather/point?lat=${lat}&lng=${lon}&params=airTemperature,humidity,windSpeed,precipitation,cloudCover&source=noaa`, {
                headers: {
                    'Authorization': this.API_KEY
                }
            });
            
            if (!response.ok) {
                throw new Error(`Forecast API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Convert Storm Glass format to a format compatible with our app
            return this.convertForecastFormat(data);
        } catch (error) {
            console.error('Error fetching forecast:', error);
            return null;
        }
    },
    
    // Convert Storm Glass data format to match what our app expects
    convertCurrentWeatherFormat(data) {
        // Extract first hour data point
        const current = data.hours[0];
        
        return {
            main: {
                temp: current.airTemperature?.noaa || 0,
                feels_like: current.airTemperature?.noaa || 0, // Storm Glass doesn't provide feels like
                humidity: current.humidity?.noaa || 0
            },
            wind: {
                speed: current.windSpeed?.noaa || 0
            },
            weather: [{
                main: this.getWeatherCondition(current),
                description: this.getWeatherDescription(current),
                icon: this.getWeatherIcon(current)
            }],
            dt: new Date(current.time).getTime() / 1000,
            sys: {
                sunrise: new Date().setHours(6, 0, 0, 0) / 1000, // Default sunrise time
                sunset: new Date().setHours(18, 0, 0, 0) / 1000  // Default sunset time
            }
        };
    },
    
    // Convert Storm Glass forecast format to match what our app expects
    convertForecastFormat(data) {
        const hourly = data.hours.map(hour => ({
            dt: new Date(hour.time).getTime() / 1000,
            temp: hour.airTemperature?.noaa || 0,
            weather: [{
                main: this.getWeatherCondition(hour),
                description: this.getWeatherDescription(hour),
                icon: this.getWeatherIcon(hour)
            }],
            pop: hour.precipitation?.noaa ? hour.precipitation.noaa / 10 : 0 // Approximate precipitation probability
        }));
        
        // Create daily forecast from hourly data
        const daily = [];
        const days = 7;
        const now = new Date();
        
        for (let i = 0; i < days; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() + i);
            const dayStart = new Date(date.setHours(0, 0, 0, 0)).getTime();
            const dayEnd = new Date(date.setHours(23, 59, 59, 999)).getTime();
            
            const dayHours = data.hours.filter(hour => {
                const time = new Date(hour.time).getTime();
                return time >= dayStart && time <= dayEnd;
            });
            
            if (dayHours.length > 0) {
                const temps = dayHours.map(h => h.airTemperature?.noaa || 0).filter(t => t);
                const precips = dayHours.map(h => h.precipitation?.noaa || 0).filter(p => p);
                
                daily.push({
                    dt: dayStart / 1000,
                    temp: {
                        min: Math.min(...temps),
                        max: Math.max(...temps)
                    },
                    weather: [{
                        main: this.getWeatherCondition(dayHours[Math.floor(dayHours.length / 2)]),
                        description: this.getWeatherDescription(dayHours[Math.floor(dayHours.length / 2)]),
                        icon: this.getWeatherIcon(dayHours[Math.floor(dayHours.length / 2)])
                    }],
                    pop: precips.length > 0 ? Math.max(...precips) / 10 : 0
                });
            }
        }
        
        return {
            hourly,
            daily
        };
    },
    
    // Helper functions to determine weather conditions from Storm Glass data
    getWeatherCondition(data) {
        const cloudCover = data.cloudCover?.noaa || 0;
        const precip = data.precipitation?.noaa || 0;
        
        if (precip > 0.5) return 'Rain';
        if (cloudCover > 80) return 'Clouds';
        if (cloudCover > 50) return 'Clouds';
        return 'Clear';
    },
    
    getWeatherDescription(data) {
        const cloudCover = data.cloudCover?.noaa || 0;
        const precip = data.precipitation?.noaa || 0;
        
        if (precip > 0.5) return 'light rain';
        if (cloudCover > 80) return 'overcast clouds';
        if (cloudCover > 50) return 'scattered clouds';
        return 'clear sky';
    },
    
    getWeatherIcon(data) {
        const cloudCover = data.cloudCover?.noaa || 0;
        const precip = data.precipitation?.noaa || 0;
        const isDay = this.isDaytime(new Date(data.time));
        
        if (precip > 0.5) return '10d';
        if (cloudCover > 80) return isDay ? '04d' : '04n';
        if (cloudCover > 50) return isDay ? '03d' : '03n';
        if (cloudCover > 10) return isDay ? '02d' : '02n';
        return isDay ? '01d' : '01n';
    },
    
    isDaytime(date) {
        const hours = date.getHours();
        return hours >= 6 && hours < 18;
    }
};