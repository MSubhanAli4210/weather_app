import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { weatherIcons } from "./components/icons";
import "./App.css";
function App() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);
    useEffect(() => {
        fetchWeather("Lahore,Punjab,PK");
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);
    const fetchWeather = async (query = city) => {
        try {
            const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=b13d09f53601e9deab362375789d60d9`);
            const data = await res.json();
            if (data.length === 0) {
                alert("City not found");
                return;
            }
            let selectedCity = data[0];
            if (data.length > 1) {
                setSuggestions(data);
                setShowSuggestions(true);
                return;
            }
            await loadWeather(selectedCity);
        }
        catch (error) {
            console.error(error);
            alert("Cannot find weather");
        }
    };
    const loadWeather = async (selectedCity) => {
        setShowSuggestions(false);
        const { lat, lon, name, country } = selectedCity;
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=b13d09f53601e9deab362375789d60d9&units=metric`);
        const weatherData = await weatherRes.json();
        setWeather({
            name,
            country,
            temperature: weatherData.main.temp,
            feelsLike: weatherData.main.feels_like,
            humidity: weatherData.main.humidity,
            icon: weatherData.weather[0].icon,
            description: weatherData.weather[0].description,
            speed: weatherData.wind.speed,
        });
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=b13d09f53601e9deab362375789d60d9&units=metric`);
        const forecastData = await forecastRes.json();
        const grouped = {};
        forecastData.list.forEach((item) => {
            const date = item.dt_txt.split(" ")[0];
            if (!grouped[date])
                grouped[date] = [];
            grouped[date].push(item);
        });
        const dailyData = Object.values(grouped).map((items) => {
            const noonItem = items.find((i) => i.dt_txt.includes("12:00:00"));
            return noonItem || items[Math.floor(items.length / 2)];
        });
        setForecast(dailyData.slice(1, 5));
    };
    return (_jsxs("div", { className: "app w-[100%] flex flex-col items-center justify-center gap-10", children: [_jsxs("form", { className: "input-holder p-1 flex w-full gap-2", onSubmit: (e) => {
                    e.preventDefault();
                    fetchWeather();
                }, children: [_jsxs("div", { ref: wrapperRef, className: "relative w-full", children: [_jsx("input", { className: "input w-full px-2", type: "text", placeholder: "Search any location", value: city, onChange: (e) => setCity(e.target.value) }), showSuggestions && suggestions.length > 0 && (_jsx("ul", { className: "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-10 overflow-hidden", children: suggestions.map((c, i) => {
                                    const label = [c.name, c.state, c.country].filter(Boolean).join(", ");
                                    return (_jsxs("li", { className: "px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 border-gray-100", onMouseDown: () => {
                                            setCity(label);
                                            loadWeather(c);
                                        }, children: ["\uD83D\uDCCD ", label] }, i));
                                }) }))] }), _jsx("button", { type: "submit", className: "bg-green-500 px-5 py-1 text-white", children: "Search" })] }), _jsx("div", { className: "w-[100%] h-[100%]", children: weather && (_jsxs("div", { className: "weather-card mw-6000 bg-blue-500 flex flex-col p-5 rounded-lg", children: [_jsxs("div", { className: "details", children: [_jsx("div", { className: "self-center text-xl font-bold", children: weather.name }), _jsxs("h1", { className: "text-3xl text-center pl-1 m-0", children: [Math.trunc(weather.temperature), "\u00B0"] }), _jsxs("div", { className: "flex justify-center items-center pr-1 gap-2", children: [_jsx("div", { className: "self-center text-2xl", children: weatherIcons[weather.icon] }), _jsx("div", { className: "self-center capitalize", children: weather.description })] }), _jsxs("div", { className: "mt-2 flex justify-center gap-2 sm:text-sm text-xs", children: [_jsxs("div", { children: [_jsx("small", { className: "pl-5", children: "Humidity:" }), " ", Math.trunc(weather.humidity), "%"] }), _jsx("div", { children: "|" }), _jsxs("div", { children: [_jsx("small", { children: "Wind speed:" }), " ", weather.speed, " m/s"] })] }), _jsx("div", { className: "border-t-2 border-gray-300 mt-5 pt-2" })] }), _jsx("div", { className: "lower-data flex justify-between w-[80%] self-center overflow-hidden font-bold mt-4", children: forecast.map((day, index) => (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: "data", children: new Date(day.dt_txt).toLocaleDateString("en-US", {
                                            weekday: "short",
                                        }) }), _jsxs("div", { className: "text-2xl", children: [Math.trunc(day.main.temp), "\u00B0"] }), _jsx("div", { className: "capitalize text-sm", children: day.weather[0].description })] }, index))) })] })) })] }));
}
export default App;
