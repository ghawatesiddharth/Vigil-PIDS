import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export async function getLiveWeatherPrediction(
  latitude,
  longitude
) {
  const response = await api.get("/weather/predict", {
    params: {
      latitude,
      longitude,
    },
  });

  return response.data;
}

export async function getAnalytics() {
  const response = await api.get("/analytics");

  return response.data;
}

export async function getPredictionHistory() {
  const response = await api.get("/history");

  return response.data;
}
export async function predictWeather(weather) {
  const response = await api.post(
    "/predict",
    weather
  );

  return response.data;
}
export default api;