import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';


import {
  WiThunderstorm, WiLightning, WiStormShowers, WiSprinkle, WiShowers, WiRain,
  WiSleet, WiRainMix, WiSnow, WiFog, WiSmoke, WiDayHaze, WiDust, WiSandstorm,
  WiVolcano, WiStrongWind, WiTornado, WiHurricane, WiSnowflakeCold, WiHot,
  WiWindy, WiHail, WiDaySunny, WiCloudy, WiNightClear, WiNightAltCloudy,
  WiDayCloudy, WiDayCloudyGusts, WiNightAltCloudyGusts, WiNightAltRain,
  WiNightAltThunderstorm, WiNightAltSprinkle, WiNightAltSnow, WiHumidity
} from 'react-icons/wi';

const Weather = () => {
  const chartRef = useRef(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  
  const [apiKey, setApiKey] = useState(localStorage.getItem('openWeatherApiKey'));

  const UNITS = 'metric';
  const CACHE_DURATION_MS = 15 * 60 * 1000;

  const weatherIdToIconComponent = {
    // Group 2xx: Thunderstorm
    200: WiThunderstorm, 201: WiThunderstorm, 202: WiThunderstorm, 210: WiLightning,
    211: WiLightning, 212: WiLightning, 221: WiLightning, 230: WiStormShowers,
    231: WiStormShowers, 232: WiStormShowers,
    // Group 3xx: Drizzle
    300: WiSprinkle, 301: WiSprinkle, 302: WiSprinkle, 310: WiSprinkle,
    311: WiSprinkle, 312: WiSprinkle, 313: WiShowers, 314: WiShowers,
    321: WiSprinkle,
    // Group 5xx: Rain
    500: WiRain, 501: WiRain, 502: WiRain, 503: WiRain,
    504: WiRain, 511: WiSleet, 520: WiShowers, 521: WiShowers,
    522: WiShowers, 531: WiShowers,
    // Group 6xx: Snow
    600: WiSnow, 601: WiSnow, 602: WiSnow, 611: WiSleet,
    612: WiSleet, 613: WiSleet, 615: WiRainMix, 616: WiRainMix,
    620: WiSnow, 621: WiSnow, 622: WiSnow,
    // Group 7xx: Atmosphere
    701: WiFog, 711: WiSmoke, 721: WiDayHaze, 731: WiDust,
    741: WiFog, 751: WiSandstorm, 761: WiDust, 762: WiVolcano,
    771: WiStrongWind, 781: WiTornado,
    // Group 800: Clear
    800: WiDaySunny,
    // Group 80x: Clouds
    801: WiCloudy, 802: WiCloudy, 803: WiCloudy, 804: WiCloudy,
    // Group 90x: Extreme
    900: WiTornado, 901: WiHurricane, 902: WiHurricane, 903: WiSnowflakeCold,
    904: WiHot, 905: WiWindy, 906: WiHail,
    // Group 95x: Additional
    951: WiDaySunny, 952: WiDayCloudyGusts, 953: WiDayCloudyGusts, 954: WiDayCloudyGusts,
    955: WiDayCloudyGusts, 956: WiStormShowers, 957: WiStormShowers,
    958: WiThunderstorm, 959: WiThunderstorm, 960: WiStormShowers,
    961: WiStormShowers, 962: WiHurricane
  };
  
  const getLatestCachedData = (lat, lon) => {
    try {
      const cachedData = localStorage.getItem('weatherData');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const now = new Date().getTime();
        if (
          now - parsedData.timestamp < CACHE_DURATION_MS &&
          parsedData.lat === lat &&
          parsedData.lon === lon &&
          parsedData.apiKey === apiKey
        ) {
          return parsedData;
        }
      }
    } catch (e) {
      console.error("Error retrieving or parsing cached data:", e);
      localStorage.removeItem('weatherData');
    }
    return null;
  };

  const fetchAndCacheWeatherData = async (lat, lon) => {
    if (!apiKey) {
      console.error('API Key not set. Cannot fetch weather data.');
      return;
    }
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${UNITS}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${UNITS}&appid=${apiKey}`;

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(currentWeatherUrl),
        fetch(forecastUrl),
      ]);

      if (!currentResponse.ok || !forecastResponse.ok) {
        const errorData = await currentResponse.json();
        throw new Error(errorData.message || 'Failed to fetch weather data');
      }

      const [currentData, forecastData] = await Promise.all([
        currentResponse.json(),
        forecastResponse.json(),
      ]);

      const newCachedData = {
        currentData,
        forecastData,
        lat,
        lon,
        apiKey,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem('weatherData', JSON.stringify(newCachedData));

      setCurrentWeather(currentData);
      setForecastData(forecastData);
    } catch (e) {
      console.error('Failed to fetch one or more weather data:', e);
      setLocationError(`API Error: ${e.message}. Please check your API key.`);
    }
  };

  useEffect(() => {
    if (!apiKey) {
      const userKey = prompt("Please enter your OpenWeatherMap API key:");
      if (userKey) {
        setApiKey(userKey);
        localStorage.setItem('openWeatherApiKey', userKey);
      } else {
        setLocationError("API Key required.");
      }
      return;
    }
    if (navigator.geolocation) {
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          // Store the successful location
          localStorage.setItem('lastKnownLocation', JSON.stringify({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            timestamp: new Date().getTime()
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError(error.message);

          // Fallback to last known location if available
          const lastKnown = localStorage.getItem('lastKnownLocation');
          if (lastKnown) {
            setUserLocation(JSON.parse(lastKnown));
            setLocationError("Position acquisition timed out. Using last known location.");
          } else {
            setLocationError(error.message);
          }
        },
        { timeout: 10000 }
      );
    } else {
      setLocationError('Geolocation not supported by your browser.');
    }
    
  }, [apiKey]);

  useEffect(() => {
    if (userLocation && apiKey) {
      const { lat, lon } = userLocation;
      const cachedData = getLatestCachedData(lat, lon);
      if (cachedData) {
        setCurrentWeather(cachedData.currentData);
        setForecastData(cachedData.forecastData);
      } else {
        fetchAndCacheWeatherData(lat, lon);
      }

      const intervalId = setInterval(() => fetchAndCacheWeatherData(lat, lon), CACHE_DURATION_MS);
      return () => clearInterval(intervalId);
    }
  }, [userLocation, apiKey]);

  useEffect(() => {
    if (forecastData) {
      createChart(forecastData);
    }
  }, [forecastData]);

  const getThemeColors = () => {
    const style = getComputedStyle(document.documentElement);
    return {
      chartBorderColor: style.getPropertyValue('--chart-border-color'),
      chartFillColor1: style.getPropertyValue('--chart-fill-color-1'),
      chartFillColor2: style.getPropertyValue('--chart-fill-color-2'),
      axisTicksColor: style.getPropertyValue('--chart-axis-ticks-color'),
      tooltipBackgroundColor: style.getPropertyValue('--tooltip-background-color'),
      tooltipTextColor: style.getPropertyValue('--tooltip-text-color'),
      tooltipBorderColor: style.getPropertyValue('--tooltip-border-color')
    };
  };

  const createChart = (data) => {
    const forecastList = data.list.slice(0, 24);
    const formattedData = forecastList.map(item => ({
      date: new Date(item.dt * 1000),
      temp: item.main.temp
    }));

    if (!chartRef.current) return;
    const container = d3.select(chartRef.current);
    container.select("svg").remove();

    const colors = getThemeColors();

    const margin = { top: 20, right: 0, bottom: 30, left: 0 };
    const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
    const height = container.node().getBoundingClientRect().height - margin.top - margin.bottom;

    const svg = container.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(formattedData, d => d.date))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain(d3.extent(formattedData, d => d.temp))
      .range([height, 0]);

    const areaGradient = svg.append("linearGradient")
      .attr("id", "temperature-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    areaGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(255, 117, 181, 0.4)");
    areaGradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "rgba(255, 170, 102, 0.2)");
    areaGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(102, 188, 255, 0)");

    svg.append("path")
      .datum(formattedData)
      .attr("fill", "url(#temperature-gradient)")
      .attr("d", d3.area()
        .x(d => x(d.date))
        .y0(height)
        .y1(d => y(d.temp))
        .curve(d3.curveCardinal));

    const lineGradient = svg.append("linearGradient")
      .attr("id", "temperature-line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", 0)
      .attr("x2", width).attr("y2", 0);
    const tempRange = d3.extent(formattedData, d => d.temp);
    const tempMid = (tempRange[0] + tempRange[1]) / 2;
    const colorScale = d3.scaleLinear()
      .domain([tempRange[0], tempMid, tempRange[1]])
      .range(["#66BCFF", "#FFAA66", "#FF75B5"]);
    lineGradient.selectAll("stop")
      .data(formattedData)
      .enter().append("stop")
      .attr("offset", d => x(d.date) / width)
      .attr("stop-color", d => colorScale(d.temp));

    svg.append("path")
      .datum(formattedData)
      .attr("fill", "none")
      .attr("stroke", "url(#temperature-line-gradient)")
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(d => x(d.date))
        .y(d => y(d.temp))
        .curve(d3.curveCardinal));

    const tempMin = d3.min(formattedData, d => d.temp);
    const tempMax = d3.max(formattedData, d => d.temp);
    const allTickValues = [-10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40];
    const relevantTickValues = allTickValues.filter(
      (value) => value >= tempMin && value <= tempMax
    );

    const yAxisGroup = svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y).tickValues(relevantTickValues));
    yAxisGroup.select(".domain").style("stroke", "none");
    yAxisGroup.selectAll(".tick line").style("stroke", "transparent");
    yAxisGroup.selectAll("text")
      .style("font-size", "14px")
      .style("font-family", "var(--primary-font)")
      .style("font-weight", "500")
      .style("color", "rgba(0, 0, 0, 0.5)")
      .style("text-shadow", "0 0 7px rgba(255, 255, 255, 0.5)");

    const tooltip = d3.select(chartRef.current.closest(".weather-card"))
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("background-color", colors.tooltipBackgroundColor)
      .style("border", `1px solid ${colors.tooltipBorderColor}`)
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("visibility", "hidden")
      .style("color", colors.tooltipTextColor)
      .style("pointer-events", "none");

    svg.selectAll("circle")
      .data(formattedData)
      .enter().append("circle")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.temp))
      .attr("r", 5)
      .attr("fill", "transparent")
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible")
          .html(`Time: ${d.date.getHours()}:00<br>Temp: ${Math.round(d.temp)}°C`);
      })
      .on("mousemove", (event) => {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });
  };

  const getWeatherIconComponent = () => {
    if (!currentWeather) return null;

    const { id: weatherId, icon: iconCode } = currentWeather.weather[0];

    const isNight = iconCode.endsWith('n');

    // Default to a sensible component for atmospheric conditions
    if (weatherId >= 700 && weatherId < 800) {
      return weatherIdToIconComponent[weatherId];
    } else if (weatherId === 800) {
      return isNight ? WiNightClear : WiDaySunny;
    } else if (weatherId > 800 && weatherId < 804) {
      return isNight ? WiNightAltCloudy : WiDayCloudy;
    } else if (weatherId === 804) {
      return WiCloudy;
    } else if (weatherId >= 500 && weatherId < 600) {
      return isNight ? WiNightAltRain : WiRain;
    } else if (weatherId >= 200 && weatherId < 300) {
      return isNight ? WiNightAltThunderstorm : WiThunderstorm;
    } else if (weatherId >= 300 && weatherId < 400) {
      return isNight ? WiNightAltSprinkle : WiSprinkle;
    } else if (weatherId >= 600 && weatherId < 700) {
      return isNight ? WiNightAltSnow : WiSnow;
    } else {
      return weatherIdToIconComponent[weatherId];
    }
  };

  const getTemperature = () => currentWeather ? Math.round(currentWeather.main.temp) : '--';
  const getHumidity = () => currentWeather ? currentWeather.main.humidity : '--';
  const getWindSpeed = () => currentWeather ? currentWeather.wind.speed : '--';

  const WeatherIconComponent = getWeatherIconComponent();

  return (
    <section className="weather-card">
      
      <div id="current-weather-container">
        <div className="weather-icon-temp">
          <div className="weather-icon-container">
            {WeatherIconComponent && <WeatherIconComponent />}
          </div>
          <span className="current-temp-text">{getTemperature()}°C</span>
        </div>
        <div className="details">
          <div><WiHumidity /> {getHumidity()}%</div>
          <div><WiStrongWind /> {getWindSpeed()} m/s</div>
          {locationError && <p className="error-message">Error: {locationError}</p>}
          {!apiKey && <p className="error-message">API Key required. Please refresh to enter it.</p>}
        </div>
      </div>
      <div id="forecast-chart-container" className="card" ref={chartRef}></div>
    </section>
  );
};

export default Weather;