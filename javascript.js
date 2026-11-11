
// Store your OpenWeatherMap API key.
const apiKey = "d0efa99fcf6fe856c59c79a5ce7c6cdc";

// Find the HTML element where we display the weather data.
const weatherData = document.getElementById("weatherdata");

// Run this function when the user clicks the button.
async function fetchWeather(city = "Helsinki") {

    // Display a loading message.
    weatherData.innerHTML = "Haetaan säätietoja...";

    // Try to fetch and process the weather data.
    try {

        // Send a GET request to the weather API.
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&mode=xml&APPID=${apiKey}`
        );

        // Check whether the API returned a successful HTTP status.
        if (!response.ok) {
            throw new Error("Säätietojen hakeminen epäonnistui. Tarkista kaupunki ja API-avain.");
        }

        // Read the response body as text.
        const xmlText = await response.text();

        // Display and parse the XML data.
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        // Check for XML parsing errors.
        if (xmlDoc.querySelector("parsererror")) {
            throw new Error("XML-datan parsiminen epäonnistui.");
        }

        // Get weather information from XML.
        const cityName = xmlDoc.querySelector("city")?.getAttribute("name");
        const temperature = xmlDoc.querySelector("temperature")?.getAttribute("value");
        const weatherDescription = xmlDoc.querySelector("weather")?.getAttribute("value");
        const humidity = xmlDoc.querySelector("humidity")?.getAttribute("value");
        const clouds = xmlDoc.querySelector("clouds")?.getAttribute("value");
        const windSpeed = xmlDoc.querySelector("speed")?.getAttribute("value");

        // Display the weather information on the page.
        weatherData.innerHTML = `
            <h2>Säätiedot: ${cityName}</h2>
            <p><strong>Lämpötila:</strong> ${temperature} °C</p>
            <p><strong>Säätila:</strong> ${weatherDescription}</p>
            <p><strong>Ilmankosteus:</strong> ${humidity} %</p>
            <p><strong>Pilvisyys:</strong> ${clouds} %</p>
            <p><strong>Tuulen nopeus:</strong> ${windSpeed} m/s</p>
        `;

    }

    // Handle errors from the request or the code above.
    catch (error) {

        // Choose an error message in the page's language.
        const errorMessage = "Säätietojen hakeminen epäonnistui.";

        // Display the message and details of the error.
        weatherData.innerHTML = `
            <p>${errorMessage}</p>
            <p>${error.message}</p>
        `;

        console.error("Weather API error:", error);
    }
}

// Add event listener to the Fetch data button.
document.getElementById("fetchWeather").addEventListener("click", function () {
    fetchWeather(document.getElementById("city").value);
});

// Add event listener to the city selection.
document.getElementById("city").addEventListener("change", function () {
    fetchWeather(this.value);
});

// Add event listener to the search button.
document.getElementById("search").addEventListener("click", function () {

    const city = document.getElementById("citysearch").value.trim();

    if (city !== "") {
        fetchWeather(city);
    } else {
        weatherData.innerHTML = "Kirjoita ensin kaupungin nimi.";
    }
});

// Allow searching by pressing Enter.
document.getElementById("citysearch").addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        document.getElementById("search").click();
    }
});
