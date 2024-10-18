// Function to get the user's current position
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => resolve(position),
                error => reject(error)
            );
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

// Function to get the nearest town or city based on latitude and longitude
async function getNearestTown(latitude, longitude) {
    const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    try {
        const response = await fetch(reverseGeocodeUrl);
        const data = await response.json();
        const nearestTown = data.address.town || data.address.city || data.address.village || 'Not found';
        document.getElementById("loc").innerHTML = `Weather forecast for:<b>\n${nearestTown}</b>`;
        return nearestTown;
    } catch (error) {
        console.error('Error fetching nearest town:', error);
        throw error;
    }
}

// Function to get weather data based on latitude and longitude
async function getWeatherData(latitude, longitude) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation,wind_speed_10m`;

    try {
        const response = await fetch(weatherUrl);
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

// Function to process the weather data and group it by date
function processWeatherData(weatherData) {
    let groupedData = {};

    for (let x in weatherData.hourly.time) {
        let datetime = new Date(weatherData.hourly.time[x]);
        if (datetime >= new Date(Date.now() - 60 * 60 * 1000)) {
            let rain = weatherData.hourly.precipitation[x];
            let temp = weatherData.hourly.temperature_2m[x];
            let wind = weatherData.hourly.wind_speed_10m[x];

            let rainDesc = rain < 0.1 ? "No Rain" : rain < 2.5 ? "Light Rain" : rain < 10 ? "Moderate Rain" : "Heavy Rain";
            let tempDesc = temp < 0 ? "Freezing" : temp < 10 ? "Cold" : temp < 18 ? "Mild" : "Hot";
            let windDesc = wind < 8 ? "Calm" : wind < 19 ? "Breezy" : wind < 47 ? "Windy" : "Stormy";

            let dayStr = datetime.toLocaleDateString('en-GB', {weekday: 'long'});
            let dateStr = datetime.toLocaleDateString('en-GB');
            let timeStr = datetime.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit', hour12: true});

            let timeData = {
                time: timeStr,
                rain: rain,
                rainDesc: rainDesc,
                temp: temp,
                tempDesc: tempDesc,
                wind: wind,
                windDesc: windDesc
            };

            if (!groupedData[dateStr]) {
                groupedData[dateStr] = {
                    date: dateStr,
                    day: dayStr,
                    data: []
                };
            }

            groupedData[dateStr].data.push(timeData);
        }
    }

    return Object.values(groupedData);
}

// Main function to get the latest weather report
async function get_latest_weather_report() {
    try {
        const position = await getCurrentLocation();
        const {latitude, longitude} = position.coords;

        await getNearestTown(latitude, longitude);

        const weatherData = await getWeatherData(latitude, longitude);
        return processWeatherData(weatherData);
    } catch (error) {
        console.error('Error in getting weather report:', error);
        document.getElementById("loc").innerText = 'Error in getting weather report:\n' + error.message;
    }
}


async function update() {
    let latest_weather_report = await get_latest_weather_report();
    console.log(latest_weather_report);

    // Get the container where you want to display the weather data
    let weatherContainer = document.getElementById('weather-forecast');

    latest_weather_report.forEach(report => {
        // Create a div for each report
        let reportDiv = document.createElement('div');
        reportDiv.className = 'card';

        // Add the day
        let day = document.createElement('h3');
        day.innerText = report.day;
        reportDiv.appendChild(day);

        // Add the date
        let date = document.createElement('small');
        date.innerText = report.date;
        reportDiv.appendChild(date);

        // Append the report div to the container
        weatherContainer.appendChild(reportDiv);


        let timesDiv = document.createElement('div');
        timesDiv.className = 'hstack';
        reportDiv.appendChild(timesDiv);

        report.data.forEach(timeData => {
            let timeDiv = document.createElement('div');
            timeDiv.className = 'card-body';

            // Add rain description
            let time = document.createElement('h5');
            time.innerText = timeData.time;
            timeDiv.appendChild(time);

            // Add rain description
            timeDiv.appendChild(getIconElement(timeData.rainDesc));
            let rain = document.createElement('p');
            rain.innerText = `${timeData.rainDesc} (${timeData.rain} mm)`;
            timeDiv.appendChild(rain);


            // Add temperature description
            timeDiv.appendChild(getIconElement(timeData.tempDesc));
            let temp = document.createElement('p');
            temp.innerText = `${timeData.tempDesc} (${timeData.temp}°C)`;
            timeDiv.appendChild(temp);

            // Add wind description
            timeDiv.appendChild(getIconElement(timeData.windDesc));
            let wind = document.createElement('p');
            wind.innerText = `${timeData.windDesc} (${timeData.wind} km/h)`;
            timeDiv.appendChild(wind);

            // Append the report div to the container
            timesDiv.appendChild(timeDiv);

        });
    });
}

function getIconElement(input) {
    let icon = document.createElement('i');
    let iconClass = "";
    let colourClass = "";
    switch (input) {
        case "No Rain":
            iconClass = "bi-cloud-sun";
            colourClass = "warn-0"
            break;
        case "Light Rain":
            iconClass = "bi-cloud-drizzle";
            colourClass = "warn-1"
            break;
        case "Moderate Rain":
            iconClass = "bi-cloud-rain";
            colourClass = "warn-2"
            break;
        case "Heavy Rain":
            iconClass = "bi-cloud-rain-heavy";
            colourClass = "warn-4"
            break;
        case "Freezing":
            iconClass = "bi-snow";
            colourClass = "warn-4"
            break;
        case "Cold":
            iconClass = "bi-cloud-snow";
            colourClass = "warn-2"
            break;
        case "Mild":
            iconClass = "bi-cloud-sun";
            colourClass = "warn-1"
            break;
        case "Hot":
            iconClass = "bi-sun";
            colourClass = "warn-0"
            break;
        case "Calm":
            iconClass = "bi-wind";
            colourClass = "warn-0"
            break;
        case "Breezy":
            iconClass = "bi-wind";
            colourClass = "warn-1"
            break;
        case "Windy":
            iconClass = "bi-wind";
            colourClass = "warn-2"
            break;
        case "Stormy":
            iconClass = "bi-wind";
            colourClass = "warn-4"
            break;
        default:
            iconClass = "bi-question";
            colourClass = "warn-4"
            break;
    }
    icon.classList.add("bi", "large-icon");
    if (colourClass !== "") {
        icon.classList.add(colourClass);
    }
    if (iconClass !== "") {
        icon.classList.add(iconClass);
    }
    return icon;

}