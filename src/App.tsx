import { useState } from "react";
import { weatherIcons } from "./components/icons";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);

  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=b13d09f53601e9deab362375789d60d9`
      );
      const data = await res.json();

      if (data.length === 0) {
        alert("City not found");
        return;
      }

      // ✅ Let user pick city if multiple matches
      let selectedCity = data[0];
      if (data.length > 1) {
        const choice = prompt(
          `Multiple cities found:\n${data
            .map(
              (c: any, i: number) =>
                `${i + 1}: ${c.name}, ${c.state || ""}, ${c.country}`
            )
            .join("\n")}\nEnter number of your city:`
        );
        const index = parseInt(choice!) - 1;
        if (!isNaN(index) && index >= 0 && index < data.length) {
          selectedCity = data[index];
        }
      }

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
    } catch (error) {
      console.error(error);
      alert("Cannot find weather");
    }
  };

  return (
    <div className="app w-[100%] flex flex-col items-center justify-center gap-10">
      {/* Form handles Enter key */}
      <form
        className="input-holder p-1 flex w-full gap-2"
        onSubmit={(e) => {
          e.preventDefault(); // prevent page reload
          fetchWeather();
        }}
      >
        <input
          className="input w-full px-2"
          type="text"
          placeholder="Search any location"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
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
