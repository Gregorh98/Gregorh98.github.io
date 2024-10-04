async function update() {
    let url = "https://api.open-meteo.com/v1/forecast?latitude=55.8575&longitude=-3.169&hourly=temperature_2m,precipitation,wind_speed_10m,wind_gusts_10m&forecast_days=3"
    try
    {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
    }
    catch(error)
    {
        console.log(error)
    }
}