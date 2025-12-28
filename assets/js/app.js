const container = document.querySelector('.container');
const searchButton = document.querySelector('#search-btn');
const locationButton = document.querySelector('#location-btn');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const cityInput = document.querySelector('#city-input');
const forecastContainer = document.querySelector('#forecast-container');
const loader = document.querySelector('.loader');
const themeToggle = document.querySelector('#theme-toggle');

// IMPORTANT: Replace this with your actual OpenWeatherMap API Key
const API_KEY = '5b4e3e90de93047ba597259d6fe0f770';

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (city === '') return;
    getWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value;
        if (city === '') return;
        getWeather(city);
    }
});

locationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        // Request high accuracy to avoid IP-based "Makassar" result
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    } else {
        alert("Browser Anda tidak mendukung Geolocation api");
    }
});

// Auto-populate Cities
const datalist = document.getElementById('city-suggestions');
if (typeof idCities !== 'undefined' && datalist) {
    idCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        datalist.appendChild(option);
    });
}

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    // Call API with coordinates
    getWeatherByCoords(latitude, longitude);
}

function onError(error) {
    console.error(error);
    alert("Gagal mendapatkan lokasi. Pastikan Anda mengizinkan akses lokasi.");
}

async function getWeather(city) {
    if (API_KEY === 'YOUR_API_KEY') {
        alert("Harap masukkan API KY OpenWeatherMap yang valid di file assets/js/app.js");
        return;
    }

    loader.style.display = 'flex';
    weatherBox.style.display = 'none';
    weatherDetails.style.display = 'none';
    error404.style.display = 'none';
    forecastContainer.innerHTML = ''; // Clear forecast

    // Pre-processing: Fix common local spelling differences
    const lowerCity = city.toLowerCase();

    // 0. LOCAL DICTIONARY (Override for specific small villages to guarantee success)
    const sidrapLocations = {
        // Watang Pulu District - Full Coverage
        "arawa": { lat: -3.9209, lon: 119.7471, name: "Arawa" },
        "batu lappa": { lat: -3.9378, lon: 119.7580, name: "Batu Lappa" },
        "buae": { lat: -4.0001, lon: 119.7493, name: "Buae" },
        "bangkai": { lat: -3.8806, lon: 119.7369, name: "Bangkai" },
        "lawawoi": { lat: -3.9425, lon: 119.7816, name: "Lawawoi" },
        "uluale": { lat: -3.9083, lon: 119.7727, name: "Uluale" },
        "carawali": { lat: -3.8755, lon: 119.7727, name: "Carawali" },
        "ciro-ciroe": { lat: -3.8669, lon: 119.7838, name: "Ciro-Ciroe" },
        "lainungan": { lat: -3.9425, lon: 119.6877, name: "Lainungan" },
        "mattirotasi": { lat: -3.9836, lon: 119.6894, name: "Mattirotasi" },

        // Other Sidrap Locations
        "amparita": { lat: -3.9833, lon: 119.8167, name: "Amparita" },
        "tellu limpoe": { lat: -3.9833, lon: 119.8167, name: "Tellu Limpoe" },
        "massepe": { lat: -4.0167, lon: 119.8000, name: "Massepe" },
        "panreng": { lat: -3.9269, lon: 119.7964, name: "Panreng" },
        "watang pulu": { lat: -3.9667, lon: 119.7500, name: "Watang Pulu" },
        "baranti": { lat: -3.9167, lon: 119.8333, name: "Baranti" },
        "panca rijang": { lat: -3.8667, lon: 119.8500, name: "Panca Rijang" },
        "rappang": { lat: -3.8667, lon: 119.8500, name: "Rappang" },
        "kulo": { lat: -3.8333, lon: 119.8833, name: "Kulo" },
        "tanru tedong": { lat: -3.9667, lon: 120.0000, name: "Tanru Tedong" },
        "duapitue": { lat: -3.9667, lon: 120.0000, name: "Dua Pitue" },
        "lancirang": { lat: -3.9000, lon: 119.9333, name: "Lancirang" },
        "allakuang": { lat: -3.9500, lon: 119.8000, name: "Allakuang" },
        "manisa": { lat: -3.9167, lon: 119.8167, name: "Manisa" },
        "batu": { lat: -3.8833, lon: 120.0167, name: "Batu" },
        "bilokka": { lat: -3.9000, lon: 119.8667, name: "Bilokka" },

        // Final 5 Districts to Ensure 11/11 Coverage
        "maritengngae": { lat: -3.9667, lon: 119.7667, name: "Maritengngae" },
        "panca lautang": { lat: -4.0167, lon: 119.8333, name: "Panca Lautang" },
        "pitu riase": { lat: -3.7667, lon: 120.0333, name: "Pitu Riase" },
        "pitu riawa": { lat: -3.8333, lon: 119.9500, name: "Pitu Riawa" },
        "watang sidenreng": { lat: -3.9667, lon: 119.8000, name: "Watang Sidenreng" }
    };

    if (sidrapLocations[lowerCity]) {
        console.log("Lokasi ditemukan di kamus lokal!");
        const loc = sidrapLocations[lowerCity];
        await getWeatherByCoords(loc.lat, loc.lon, loc.name);
        return;
    }

    if (lowerCity === 'wattangpulu' || lowerCity === 'watangpulu') city = 'Watang Pulu';
    if (lowerCity === 'tellulimpoe') city = 'Tellu Limpoe';
    if (lowerCity === 'pancarijang') city = 'Panca Rijang';
    if (lowerCity === 'maritengngae') city = 'Maritengngae';
    if (lowerCity === 'baranti') city = 'Baranti';
    if (lowerCity === 'duapitue') city = 'Dua Pitue';
    if (lowerCity === 'pitu riase') city = 'Pitu Riase';
    if (lowerCity === 'pitu riawa') city = 'Pitu Riawa';
    if (lowerCity === 'kulo') city = 'Kulo';
    if (lowerCity === 'watang sidenreng') city = 'Watang Sidenreng';

    try {
        // STRATEGY 1: Direct Geocoding (high precision)
        // Try precise search first: "City, ID"
        let geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},ID&limit=5&appid=${API_KEY}`);
        let geoJson = await geoResponse.json();

        // Check for 401 error early
        if (geoJson.cod === 401 || geoJson.cod === '401') {
            alert("API Key belum aktif. Mohon tunggu 10-30 menit setelah aktivasi email.");
            loader.style.display = 'none';
            return;
        }

        // STRATEGY 2: If finding village fails, try adding "Kelurahan" or "Desa" or removing ID restriction
        // Example: "Amparita" might need "Kelurahan Amparita"
        if (geoJson.length === 0) {
            console.log("Strategi 1 gagal, mencoba strategi 2...");
            // Try explicit admin level terms commonly used in Indo maps
            // 1. Try explicit admin level terms commonly used in Indo maps
            let attempts = [
                `Kecamatan ${city}`,
                `Gampong ${city}`, // Aceh specific
                `Kelurahan ${city}`,
                `Desa ${city}`,
                `Kabupaten ${city}`,
                `Kota ${city}`,
                `${city}, Indonesia`,
                city
            ];

            // 2. Special Case: Aceh Regencies often need English names in OWM
            // e.g. "Aceh Barat" -> "West Aceh"
            if (city.toLowerCase().includes('aceh')) {
                const acehTranslations = {
                    'aceh barat': 'West Aceh',
                    'aceh timur': 'East Aceh',
                    'aceh utara': 'North Aceh',
                    'aceh selatan': 'South Aceh',
                    'aceh tengah': 'Central Aceh',
                    'aceh tenggara': 'Southeast Aceh',
                    'aceh barat daya': 'Southwest Aceh',
                    'aceh besar': 'Aceh Besar', // Sometimes simpler
                    'aceh jaya': 'Aceh Jaya',
                    'aceh singkil': 'Aceh Singkil',
                    'aceh tamiang': 'Aceh Tamiang',
                    'banda aceh': 'Banda Aceh',
                    'langsa': 'Langsa',
                    'lhokseumawe': 'Lhokseumawe',
                    'sabang': 'Sabang',
                    'subulussalam': 'Subulussalam',
                    'pidie': 'Pidie',
                    'pidie jaya': 'Pidie Jaya',
                    'simeulue': 'Simeulue',
                    'nagan raya': 'Nagan Raya',
                    'gayo lues': 'Gayo Lues',
                    'bener meriah': 'Bener Meriah'
                };

                const lower = city.toLowerCase().replace('kabupaten ', '').replace('kota ', '').trim();
                if (acehTranslations[lower]) {
                    attempts.unshift(acehTranslations[lower]); // Try English name FIRST
                }
            }

            for (const attempt of attempts) {
                if (geoJson.length > 0) break; // If found, stop trying
                console.log(`Mencoba cari: ${attempt}`);
                geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${attempt}&limit=1&appid=${API_KEY}`);
                geoJson = await geoResponse.json();
            }
        }

        // Final Check
        if (geoJson.length === 0) {
            showError();
            return;
        }

        const { lat, lon, name, country } = geoJson[0];

        // Ensure it is Indonesia if possible to avoid duplicates in other countries, 
        // unless user specifically searched for abroad
        if (country !== 'ID' && !city.toLowerCase().includes('luar negeri')) {
            // Optional warning or logic, but for now we accept it to be safe
        }

        // FORMAT NAME FOR UI:
        // Instead of using 'name' from API (which might be "Kabupaten Sidenreng Rappang"),
        // We prefer the User's term if it's specific, OR the Geocoding name if it's clean.
        // The safest for "Village Experience" is to capitalize the User's input so they see what they searched.
        const capitalizeWords = (str) => {
            return str
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };

        // We use the 'name' from Geocoding if matches, but if user searched "Kadidi", 
        // and API returned "Sidenreng Rappang", we want "Kadidi".
        // Let's ALWAYS prefer the user's search intent for the header, 
        // as long as we found a valid coordinate.
        // We clean up "Desa" or "Kelurahan" prefixes if user added them for clarity.
        let displayOverride = name; // Default to API name

        // If the user's input is contained in the API name (fuzzy match), use API name (it's official).
        // e.g. user "sidrap", API "Sidenreng Rappang" -> Use API.
        // But if drastic difference: user "Kadidi", API "Sidenreng Rappang" -> Use User's Input.
        if (!name.toLowerCase().includes(city.toLowerCase().replace('desa ', '').replace('kelurahan ', ''))) {
            // Locations differ in name, so likely a village mapped to a city station.
            // Use User's input name proper cased
            displayOverride = capitalizeWords(city).replace(', Id', '');
        }

        // STEP 2: GET WEATHER BY COORDS
        // This is always accurate because it uses the found lat/lon
        await getWeatherByCoords(lat, lon, displayOverride);

    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat mencari lokasi.');
        loader.style.display = 'none';
    }
}

async function getWeatherByCoords(lat, lon, overrideName = null) {
    if (API_KEY === 'YOUR_API_KEY') {
        // ... (redundant check but safe)
        return;
    }

    loader.style.display = 'flex';
    // Don't hide everything yet if we are chained from getWeather, but safe to do so
    weatherBox.style.display = 'none';
    weatherDetails.style.display = 'none';
    error404.style.display = 'none';
    forecastContainer.innerHTML = '';

    try {
        // STEP 1: Reverse Geocoding to get the Real Location Name (Village/District)
        // This fixes the issue where Weather API returns "Makassar" for coordinates near Sidrap
        let displayName = overrideName;

        if (!displayName) {
            try {
                const reverseGeoReq = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);
                const reverseGeoData = await reverseGeoReq.json();

                if (reverseGeoData.length > 0) {
                    // Use the specific local name found
                    displayName = reverseGeoData[0].name;
                    // If we have a local_names.id (Indonesian name), prefer that
                    if (reverseGeoData[0].local_names && reverseGeoData[0].local_names.id) {
                        displayName = reverseGeoData[0].local_names.id;
                    }
                    console.log(`Reverse Geocoding found: ${displayName}`);
                }
            } catch (err) {
                console.log("Reverse geocoding failed, falling back to weather station name.");
            }
        }

        // STEP 2: Fetch Weather Data
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=id`);
        const json = await response.json();

        if (json.cod === 401 || json.cod === '401') {
            alert("API Key belum aktif. Mohon tunggu 10-30 menit setelah aktivasi email.");
            loader.style.display = 'none';
            return;
        }

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=id`);
        const forecastJson = await forecastResponse.json();

        // Use our discovered display name if available, otherwise API's name
        if (displayName) {
            json.name = displayName;
            cityInput.value = displayName;
        } else {
            // Keep original logic if override/reverse failed
            cityInput.value = json.name;
        }

        updateUI(json, forecastJson);

    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat mengambil data lokasi.');
        loader.style.display = 'none';
    }
}

function updateUI(weatherData, forecastData) {
    const image = document.querySelector('.weather-box img');
    const temperature = document.querySelector('.weather-box .temperature');
    const description = document.querySelector('.weather-box .description');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');
    const cityName = document.querySelector('.weather-box .city-name');

    // Update Current Weather
    // Using OWM icons - high resolution
    image.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`;

    temperature.innerHTML = `${parseInt(weatherData.main.temp)}<span>°C</span>`;
    description.innerText = weatherData.weather[0].description; // Should be in Indonesian
    humidity.innerText = `${weatherData.main.humidity}%`;
    wind.innerText = `${parseInt(weatherData.wind.speed)} Km/h`;
    cityName.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${weatherData.name}, ${weatherData.sys.country}`;

    // Update Forecast
    // Filter forecast to get aprox one per day (every 24h, or close to noon)
    // The API returns every 3 hours. We will pick index 0, 8, 16, 24, 32
    // Or better, filter for a specific time like "12:00:00"

    // Sometimes 12:00:00 is not available in the first day if we are late
    // So we pick simply every 8th item (24h)
    const forecastList = [];
    for (let i = 0; i < forecastData.list.length; i += 8) {
        if (forecastList.length < 5) {
            forecastList.push(forecastData.list[i]);
        }
    }

    forecastList.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(date);

        const forecastEl = document.createElement('div');
        forecastEl.classList.add('forecast-item');

        forecastEl.innerHTML = `
            <p class="day">${dayName}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="icon">
            <p class="temp">${parseInt(day.main.temp)}°C</p>
        `;

        forecastContainer.appendChild(forecastEl);
    });

    // Show UI
    loader.style.display = 'none';
    error404.style.display = 'none';
    weatherBox.style.display = 'block';
    weatherDetails.style.display = 'flex';
    container.style.height = 'auto';

    // Add fade in animation
    weatherBox.classList.add('active');
    weatherDetails.classList.add('active');
}

function showError() {
    loader.style.display = 'none';
    weatherBox.style.display = 'none';
    weatherDetails.style.display = 'none';
    error404.style.display = 'block';
    error404.classList.add('fadeIn');
    container.style.height = '400px';
}
