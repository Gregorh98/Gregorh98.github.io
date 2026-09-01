const SAFETY_THRESHOLDS = {
    minTemp: 4,
    maxRain: 0.1,
    maxWind: 60
};

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

            const isSafe = ({temp, rain, wind}) => (
                temp > SAFETY_THRESHOLDS.minTemp
                && rain < SAFETY_THRESHOLDS.maxRain
                && wind < SAFETY_THRESHOLDS.maxWind
            );

            result[date] = {
                am: {
                    temp: amData.temp > SAFETY_THRESHOLDS.minTemp,
                    rain: amData.rain < SAFETY_THRESHOLDS.maxRain,
                    wind: amData.wind < SAFETY_THRESHOLDS.maxWind
                },
                pm: {
                    temp: pmData.temp > SAFETY_THRESHOLDS.minTemp,
                    rain: pmData.rain < SAFETY_THRESHOLDS.maxRain,
                    wind: pmData.wind < SAFETY_THRESHOLDS.maxWind
                },
                verdict: isSafe(amData) && isSafe(pmData),
                certainty: calculateCertainty([amData, pmData])
            };
        }
    });

    return result;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function calculateMetricCertainty(margin, scale) {
    return clamp(50 + (Math.abs(margin) / scale) * 50, 50, 100);
}

function calculateCertainty(periods) {
    const scores = periods.flatMap(({temp, rain, wind}) => [
        calculateMetricCertainty(temp - SAFETY_THRESHOLDS.minTemp, 6),
        calculateMetricCertainty(SAFETY_THRESHOLDS.maxRain - rain, 1),
        calculateMetricCertainty(SAFETY_THRESHOLDS.maxWind - wind, 30)
    ]);

    return Math.round(Math.min(...scores));
}

function getSafetyClass(isSafe) {
    return isSafe ? "is-safe" : "is-unsafe";
}

function getCertaintyLabel(certainty) {
    if (certainty >= 80) {
        return "High";
    }

    if (certainty >= 65) {
        return "Medium";
    }

    return "Low";
}

function createWeatherIcons(periodData) {
    return `
        <span class="weather-icons">
            <i class="large-icon weekly-icon bi bi-thermometer-half ${getSafetyClass(periodData.temp)}"></i>
            <i class="large-icon weekly-icon bi bi-cloud-drizzle ${getSafetyClass(periodData.rain)}"></i>
            <i class="large-icon weekly-icon bi bi-wind ${getSafetyClass(periodData.wind)}"></i>
        </span>
    `;
}

function formatDateLabel(date, index) {
    if (index === 0) {
        return "Today";
    }

    if (index === 1) {
        return "Tomorrow";
    }

    return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
        weekday: "long"
    });
}

function formatShortDate(date) {
    return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short"
    });
}

function renderWeeklyForecast(processedWeatherData) {
    const tableBody = document.getElementById("weekly_forecast");
    tableBody.innerHTML = "";

    Object.entries(processedWeatherData).slice(0, 7).forEach(([date, dayData], index) => {
        const row = document.createElement("tr");
        const verdictClass = getSafetyClass(dayData.verdict);
        row.className = dayData.verdict ? "ride-row ride-row-safe" : "ride-row ride-row-unsafe";

        row.innerHTML = `
            <th scope="row">
                <span class="day-label">${formatDateLabel(date, index)}</span>
                <small class="d-block text-muted">${formatShortDate(date)}</small>
            </th>
            <td>${createWeatherIcons(dayData.am)}</td>
            <td>${createWeatherIcons(dayData.pm)}</td>
            <td class="verdict-cell ${verdictClass}">
                <span class="verdict-pill">${dayData.verdict ? "Yes" : "No"}</span>
                <span class="certainty-score">${dayData.certainty}%</span>
                <span class="certainty-bar" aria-label="${getCertaintyLabel(dayData.certainty)} certainty">
                    <span style="width: ${dayData.certainty}%"></span>
                </span>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

async function update() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=55.8575&longitude=-3.169&hourly=temperature_2m,precipitation,wind_speed_10m&forecast_days=7&timezone=auto";
    try {
        const response = await fetch(url);
        const data = await response.json();
        const processedWeatherData = getWeatherSafety(data);
        renderWeeklyForecast(processedWeatherData);
    } catch (error) {
        console.log(error);
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then((registration) => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
