function getWeatherSafety(weatherData) {
    const result = {};

    // Extract hourly data
    const {
        time: times,
        temperature_2m: tempData,
        precipitation: rainData,
        wind_speed_10m: windData
    } = weatherData.hourly;

    // Get unique dates from the time
    const uniqueDates = [...new Set(times.map(time => time.split("T")[0]))];

    uniqueDates.forEach(date => {
        const amIndex = times.findIndex(time => time.startsWith(date) && time.endsWith("08:00"));
        const pmIndex = times.findIndex(time => time.startsWith(date) && time.endsWith("17:00"));

        if (amIndex !== -1 && pmIndex !== -1) {
            const amData = {
                temp: tempData[amIndex],
                rain: rainData[amIndex],
                wind: windData[amIndex]
            };
            const pmData = {
                temp: tempData[pmIndex],
                rain: rainData[pmIndex],
                wind: windData[pmIndex]
            };

            // Determine weather safety
            const isSafe = ({temp, rain, wind}) => (temp > 4 && rain < 0.1 && wind < 60);
            result[date] = {
                am: {
                    temp: amData.temp > 4,
                    rain: amData.rain < 0.1,
                    wind: amData.wind < 60
                },
                pm: {
                    temp: pmData.temp > 4,
                    rain: pmData.rain < 0.1,
                    wind: pmData.wind < 60
                },
                verdict: isSafe(amData) && isSafe(pmData)
            };
        }
    });

    return result;
}

async function update(index = 1) {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=55.8575&longitude=-3.169&hourly=temperature_2m,precipitation,wind_speed_10m&forecast_days=3";
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
        const processedWeatherData = getWeatherSafety(data);

        // Today = 0; Tomorrow = 1; Next again day = 2
        const todaysData = processedWeatherData[Object.keys(processedWeatherData)[index]];

        // Update UI
        ['am', 'pm'].forEach(period => {
            const periodData = todaysData[period];
            document.getElementById(`${period}_temp`).style.color = periodData.temp ? "green" : "red";
            document.getElementById(`${period}_rain`).style.color = periodData.rain ? "green" : "red";
            document.getElementById(`${period}_wind`).style.color = periodData.wind ? "green" : "red";
        });

        const verdict = todaysData.verdict;
        document.getElementById("verdict").style.color = verdict ? "green" : "red";
        document.getElementById("verdict").innerText = verdict ? "Yes" : "No";
        
        document.getElementById("date").innerText = Object.keys(processedWeatherData)[index];

        console.log(processedWeatherData);
    } catch (error) {
        console.log(error);
    }
}
