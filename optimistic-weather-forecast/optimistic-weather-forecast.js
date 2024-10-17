async function get_latest_weather_report() {
    let url = "https://api.open-meteo.com/v1/forecast?latitude=55.8575&longitude=-3.169&hourly=temperature_2m,precipitation,wind_speed_10m";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

                fetch(reverseGeocodeUrl)
                    .then(response => response.json())
                    .then(data => {
                        const nearestTown = data.address.town || data.address.city || data.address.village || 'Not found';
                        url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation,wind_speed_10m`;
                        console.log('Nearest Town:', nearestTown);
                        document.getElementById("loc").innerText = `Weather forecast for:\n${nearestTown}`;
                    })
                    .catch(error => {
                        console.error('Error fetching nearest town:', error);
                    });
            }
        );
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        let obj = []

        for (let x in data.hourly.time) {
            let time = new Date(data.hourly.time[x]);
            if (time >= new Date(Date.now() - 60 * 60 * 1000)) {

                let rain = data.hourly.precipitation[x];
                let temp = data.hourly.temperature_2m[x];
                let wind = data.hourly.wind_speed_10m[x];

                let rainDesc = rain < 0.1 ? "No Rain" : rain < 2.5 ? "Light Rain" : rain < 10 ? "Moderate Rain" : "Heavy Rain";
                let tempDesc = temp < 0 ? "Freezing" : temp < 10 ? "Cold" : temp < 18 ? "Mild" : "Hot";
                let windDesc = wind < 8 ? "Calm" : wind < 19 ? "Breezy" : wind < 47 ? "Windy" : "Stormy";

                obj.push({
                    time: time,
                    rain: rain,
                    temp: temp,
                    wind: wind,
                    rainDesc: rainDesc,
                    tempDesc: tempDesc,
                    windDesc: windDesc
                });
            }
        }
        return obj;

    } catch (error) {
        console.log(error);
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
        reportDiv.className = 'weather-report';

        // Add the time
        let time = document.createElement('p');
        time.innerText = `${new Date(report.time).toLocaleString()}`;
        reportDiv.appendChild(time);

        // Add rain description
        let rain = document.createElement('p');
        rain.innerText = `${report.rainDesc} (${report.rain} mm)`;
        reportDiv.appendChild(rain);

        // Add temperature description
        let temp = document.createElement('p');
        temp.innerText = `Temperature: ${report.tempDesc} (${report.temp}°C)`;
        reportDiv.appendChild(temp);

        // Add wind description
        let wind = document.createElement('p');
        wind.innerText = `Wind: ${report.windDesc} (${report.wind} km/h)`;
        reportDiv.appendChild(wind);

        // Append the report div to the container
        weatherContainer.appendChild(reportDiv);
    });
}

