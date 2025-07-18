const apiKey = "a36b74f62912e305c8f415b129c51ec2";
const apiUrl ="https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const loadingElement = document.querySelector(".loading");
const errorElement = document.querySelector(".error");
const errorMessageElement = document.querySelector(".error-message");
const weatherElement = document.querySelector(".weather");

// Hide all status elements initially
function resetDisplay() {
    weatherElement.style.display = "none";
    errorElement.style.display = "none";
    loadingElement.style.display = "none";
}

// Show loading spinner
function showLoading() {
    resetDisplay();
    loadingElement.style.display = "flex";
}

// Show error message
function showError(message) {
    resetDisplay();
    errorMessageElement.textContent = message || "Invalid city name";
    errorElement.style.display = "block";
    errorElement.classList.add("shake");
    
    // Remove shake animation after it completes
    setTimeout(() => {
        errorElement.classList.remove("shake");
    }, 500);
}

// Show weather data
function showWeather() {
    resetDisplay();
    weatherElement.style.display = "block";
    weatherElement.classList.add("fade-in");
    
    // Remove animation class after it completes
    setTimeout(() => {
        weatherElement.classList.remove("fade-in");
    }, 1000);
}

async function checkWeather(city) {
    if (!city.trim()) {
        showError("Please enter a city name");
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        
        if (response.status === 404) {
            showError("City not found. Please check the spelling.");
            return;
        }
        
        if (!response.ok) {
            showError(`Error: ${response.status} - ${response.statusText}`);
            return;
        }
        
        const data = await response.json();
        
        // Update weather information
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        
        // Update weather icon
        const weatherMain = data.weather[0].main;
        const weatherIcons = {
            "Clouds": "clouds.png",
            "Clear": "clear.png",
            "Drizzle": "drizzle.png",
            "Mist": "mist.png",
            "Rain": "rain.png",
            "Snow": "snow.png"
        };
        
        weatherIcon.src = `images/${weatherIcons[weatherMain] || "clouds.png"}`;
        
        // Show weather with animation
        showWeather();
    } catch (error) {
        console.error("Error fetching weather data:", error);
        showError("Failed to fetch weather data. Please try again.");
    }
}

// Event listeners
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// Add keyboard support (Enter key)
searchBox.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

// Add focus to search box on page load
window.addEventListener("load", () => {
    searchBox.focus();
    resetDisplay();
});