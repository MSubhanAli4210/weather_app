import { jsx as _jsx } from "react/jsx-runtime";
import { WiDaySunny, WiNightClear, WiCloud, WiCloudy, WiDayCloudy, WiNightAltCloudy, WiRain, WiDayRain, WiNightAltRain, WiThunderstorm, WiSnow, WiFog, WiWindy, WiHumidity, } from "react-icons/wi";
import { VscGlobe } from "react-icons/vsc";
import { CiLocationOn } from "react-icons/ci";
export const weatherIcons = {
    lon: _jsx(VscGlobe, {}),
    lat: _jsx(CiLocationOn, {}),
    "111": _jsx(WiWindy, {}),
    "112": _jsx(WiHumidity, {}),
    "01d": _jsx(WiDaySunny, {}),
    "01n": _jsx(WiNightClear, {}),
    "02d": _jsx(WiDayCloudy, {}),
    "02n": _jsx(WiNightAltCloudy, {}),
    "03d": _jsx(WiCloud, {}),
    "03n": _jsx(WiCloud, {}),
    "04d": _jsx(WiCloudy, {}),
    "04n": _jsx(WiCloudy, {}),
    "09d": _jsx(WiRain, {}),
    "09n": _jsx(WiRain, {}),
    "10d": _jsx(WiDayRain, {}),
    "10n": _jsx(WiNightAltRain, {}),
    "11d": _jsx(WiThunderstorm, {}),
    "11n": _jsx(WiThunderstorm, {}),
    "13d": _jsx(WiSnow, {}),
    "13n": _jsx(WiSnow, {}),
    "50d": _jsx(WiFog, {}),
    "50n": _jsx(WiFog, {}),
};
