import { useState, useRef, useEffect } from "react";
import { weatherIcons } from "./components/icons";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchWeather("Lahore,Punjab,PK");

    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchWeather = async (query = city) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=b13d09f53601e9deab362375789d60d9`
      );
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
    } catch (error) {
      console.error(error);
      alert("Cannot find weather");
    }
  };

  const loadWeather = async (selectedCity: any) => {
    setShowSuggestions(false);
    const { lat, lon, name, country } = selectedCity;

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=b13d09f53601e9deab362375789d60d9&units=metric`
    );
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

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=b13d09f53601e9deab362375789d60d9&units=metric`
    );
    const forecastData = await forecastRes.json();

    const grouped: { [date: string]: any[] } = {};
    forecastData.list.forEach((item: any) => {
      const date = item.dt_txt.split(" ")[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });

    const dailyData = Object.values(grouped).map((items: any[]) => {
      const noonItem = items.find((i) => i.dt_txt.includes("12:00:00"));
      return noonItem || items[Math.floor(items.length / 2)];
    });

    setForecast(dailyData.slice(1, 5));
  };

  return (
    <div className="app w-[100%] flex flex-col items-center justify-center gap-10">
      {/* Form handles Enter key */}
      <form
        className="input-holder p-1 flex w-full gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          fetchWeather();
        }}
      >
        <div ref={wrapperRef} className="relative w-full">
          <input
            className="input w-full px-2"
            type="text"
            placeholder="Search any location"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-10 overflow-hidden">
              {suggestions.map((c, i) => {
                const label = [c.name, c.state, c.country].filter(Boolean).join(", ");
                return (
                  <li
                    key={i}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 border-gray-100"
                    onMouseDown={() => {
                      setCity(label);
                      loadWeather(c);
                    }}
                  >
                    📍 {label}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <button type="submit" className="bg-green-500 px-5 py-1 text-white">
          Search
        </button>
      </form>

      <div className="w-[100%] h-[100%]">
        {weather && (
          <div className="weather-card mw-6000 bg-blue-500 flex flex-col p-5 rounded-lg">
            <div className="details">
              <div className="self-center text-xl font-bold">
                {weather.name}
              </div>
              <h1 className="text-3xl text-center pl-1 m-0">
                {Math.trunc(weather.temperature)}°
              </h1>

              <div className="flex justify-center items-center pr-1 gap-2">
                <div className="self-center text-2xl">
                  {weatherIcons[weather.icon]}
                </div>
                <div className="self-center capitalize">
                  {weather.description}
                </div>
              </div>

              <div className="mt-2 flex justify-center gap-2 sm:text-sm text-xs">
                <div>
                  <small className="pl-5">Humidity:</small>{" "}
                  {Math.trunc(weather.humidity)}%
                </div>
                <div>|</div>
                <div>
                  <small>Wind speed:</small> {weather.speed} m/s
                </div>
              </div>

              <div className="border-t-2 border-gray-300 mt-5 pt-2"></div>
            </div>

            <div className="lower-data flex justify-between w-[80%] self-center overflow-hidden font-bold mt-4">
              {forecast.map((day: any, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="data">
                    {new Date(day.dt_txt).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </div>
                  <div className="text-2xl">{Math.trunc(day.main.temp)}°</div>
                  <div className="capitalize text-sm">
                    {day.weather[0].description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;