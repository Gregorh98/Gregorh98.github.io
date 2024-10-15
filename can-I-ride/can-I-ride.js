function getWeatherSafety(weatherData) {
    const result = {};

    // Iterate through the hourly data
    const times = weatherData.hourly.time;
    const tempData = weatherData.hourly.temperature_2m;
    const rainData = weatherData.hourly.precipitation;
    const windData = weatherData.hourly.wind_speed_10m;

    // Loop through the dates (the unique dates in the hourly time)
    const uniqueDates = [...new Set(times.map(time => time.split("T")[0]))];

    uniqueDates.forEach(date => {
        const amIndex = times.findIndex(time => time.startsWith(date) && time.endsWith("09:00"));
        const pmIndex = times.findIndex(time => time.startsWith(date) && time.endsWith("17:00"));

        if (amIndex !== -1 && pmIndex !== -1) {
            console.log(date)
            const amTemp = tempData[amIndex];
            const amRain = rainData[amIndex];
            const amWind = windData[amIndex];
            console.log(amTemp, amRain, amWind)

            const pmTemp = tempData[pmIndex];
            const pmRain = rainData[pmIndex];
            const pmWind = windData[pmIndex];
            console.log(pmTemp, pmRain, pmWind)
            console.log("\n")

            console.log(amTemp > 4 && amRain < 0.1 && amWind < 60 && pmTemp > 4 && pmRain < 0.1 && pmWind < 60)

            result[date] = {
                "am": {
                    "temp": amTemp > 4,
                    "rain": amRain < 0.1,
                    "wind": amWind < 60
                },
                "pm": {
                    "temp": pmTemp > 4,
                    "rain": pmRain < 0.1,
                    "wind": pmWind < 60
                },
                "verdict": amTemp > 4 && amRain < 0.1 && amWind < 60 && pmTemp > 4 && pmRain < 0.1 && pmWind < 60
            };
        }
    });

    return result;
}


async function update() {
    let url = "https://api.open-meteo.com/v1/forecast?latitude=55.8575&longitude=-3.169&hourly=temperature_2m,precipitation,wind_speed_10m,wind_gusts_10m&forecast_days=3"
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
        const processed_weather_data = getWeatherSafety(data)

        let todays_data = processed_weather_data[Object.keys(processed_weather_data)[0]]
        let am_data = todays_data["am"]
        let pm_data = todays_data["pm"]
        let verdict = todays_data["verdict"]

        document.getElementById("am_temp").style.color = am_data["temp"] ? "green" : "red"
        document.getElementById("am_rain").style.color = am_data["rain"] ? "green" : "red"
        document.getElementById("am_wind").style.color = am_data["wind"] ? "green" : "red"

        document.getElementById("pm_temp").style.color = pm_data["temp"] ? "green" : "red"
        document.getElementById("pm_rain").style.color = pm_data["rain"] ? "green" : "red"
        document.getElementById("pm_wind").style.color = pm_data["wind"] ? "green" : "red"

        document.getElementById("verdict").style.color = verdict ? "green" : "red"

        console.log(processed_weather_data)
    } catch (error) {
        console.log(error)
    }
}
