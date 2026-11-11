//tähän tulee oma OpenWeatherMap API-avain
const apiKey = "APIKEY TÄHÄN";


const weatherData = document.getElementById("weatherdata");

//suoritetaan heti kun sivu on ladattu
async function fetchWeather(city = "Helsinki") {

    // Display a loading message.
    weatherData.innerHTML = "Haetaan säätietoja...";

    
    try {

        // Send a GET request to the weather API.
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&mode=xml&APPID=${apiKey}`
        );

        
        if (!response.ok) {
            throw new Error("Säätietojen hakeminen epäonnistui. Tarkista kaupunki ja API-avain.");
        }

        
        const xmlText = await response.text();

        // xml data parsing
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

       //parsing error handling
        if (xmlDoc.querySelector("parsererror")) {
            throw new Error("XML-datan parsiminen epäonnistui.");
        }

        //get information from the XML data
        const cityName = xmlDoc.querySelector("city")?.getAttribute("name");
        const temperature = xmlDoc.querySelector("temperature")?.getAttribute("value");
        const weatherDescription = xmlDoc.querySelector("weather")?.getAttribute("value");
        const humidity = xmlDoc.querySelector("humidity")?.getAttribute("value");
        const clouds = xmlDoc.querySelector("clouds")?.getAttribute("value");
        const windSpeed = xmlDoc.querySelector("speed")?.getAttribute("value");

       
        weatherData.innerHTML = `
            <h2>Säätiedot: ${cityName}</h2>
            <p><strong>Lämpötila:</strong> ${temperature} °C</p>
            <p><strong>Säätila:</strong> ${weatherDescription}</p>
            <p><strong>Ilmankosteus:</strong> ${humidity} %</p>
            <p><strong>Pilvisyys:</strong> ${clouds} %</p>
            <p><strong>Tuulen nopeus:</strong> ${windSpeed} m/s</p>
        `;

    }

   //handle any errors that occur during the fetch or parsing process
    catch (error) {

        // Choose an error message in the page's language.
        const errorMessage = "Säätietojen hakeminen epäonnistui.";

        display the error message in the weather data section.
        weatherData.innerHTML = `
            <p>${errorMessage}</p>
            <p>${error.message}</p>
        `;

        console.error("Weather API error:", error);
    }
}


document.getElementById("fetchWeather").addEventListener("click", function () {
    fetchWeather(document.getElementById("city").value);
});


document.getElementById("city").addEventListener("change", function () {
    fetchWeather(this.value);
});


document.getElementById("search").addEventListener("click", function () {

    const city = document.getElementById("citysearch").value.trim();

    if (city !== "") {
        fetchWeather(city);
    } else {
        weatherData.innerHTML = "Kirjoita ensin kaupungin nimi.";
    }
});

//käyttäjän painaessa Enter-näppäintä haetaan säätiedot
document.getElementById("citysearch").addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        document.getElementById("search").click();
    }
});
