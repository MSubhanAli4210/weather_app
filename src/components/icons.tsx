import type { JSX } from 'react';
import { WiDaySunny, WiNightClear, WiCloud, WiCloudy, WiDayCloudy, WiNightAltCloudy, WiRain, WiDayRain, WiNightAltRain, WiThunderstorm, WiSnow, WiFog, WiWindy, WiDayHaze, WiHumidity, WiStrongWind, WiSunrise, WiSunset, } from "react-icons/wi";
import { VscGlobe } from "react-icons/vsc";
import { CiLocationOn } from "react-icons/ci";


export const weatherIcons: Record<string, JSX.Element> = {
  "lon": <VscGlobe />,
  "lat": <CiLocationOn />,
  "111": <WiWindy />,
  "112": <WiHumidity />,
  "01d": <WiDaySunny />,
  "01n": <WiNightClear />,
  "02d": <WiDayCloudy />,
  "02n": <WiNightAltCloudy />,
  "03d": <WiCloud />,
  "03n": <WiCloud />,
  "04d": <WiCloudy />,
  "04n": <WiCloudy />,
  "09d": <WiRain />,
  "09n": <WiRain />,
  "10d": <WiDayRain />,
  "10n": <WiNightAltRain />,
  "11d": <WiThunderstorm />,
  "11n": <WiThunderstorm />,
  "13d": <WiSnow />,
  "13n": <WiSnow />,
  "50d": <WiFog />,
  "50n": <WiFog />,
};