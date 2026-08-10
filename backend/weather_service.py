import requests


OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


def weather_code_is_storm(weather_code: int) -> int:
    """
    Convert Open-Meteo WMO weather codes into
    the binary storm feature expected by the ML model.

    Thunderstorm codes:
        95 = Thunderstorm
        96 = Thunderstorm with slight hail
        99 = Thunderstorm with heavy hail

    Returns:
        1 = storm
        0 = no storm
    """

    thunderstorm_codes = {95, 96, 99}

    return 1 if weather_code in thunderstorm_codes else 0


def get_current_weather(latitude: float, longitude: float):
    """
    Fetch current weather conditions from Open-Meteo.
    """

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "precipitation,"
            "wind_speed_10m,"
            "weather_code"
        ),
        "wind_speed_unit": "kmh",
        "timezone": "auto"
    }

    response = requests.get(
        OPEN_METEO_URL,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    return data


def prepare_model_features(weather_data: dict):
    """
    Convert Open-Meteo weather data into the
    five features expected by the ML model.
    """

    current = weather_data["current"]

    weather_code = current["weather_code"]

    storm = weather_code_is_storm(weather_code)

    features = {
        "wind_speed_kmh": current["wind_speed_10m"],
        "rainfall_mm": current["precipitation"],
        "temperature_c": current["temperature_2m"],
        "humidity_percent": current["relative_humidity_2m"],
        "storm": storm
    }

    return features