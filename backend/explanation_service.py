def generate_explanation(
    wind_speed_kmh: float,
    rainfall_mm: float,
    temperature_c: float,
    humidity_percent: float,
    storm: int,
    risk_level: str
):
    """
    Generate a human-readable explanation
    based on environmental conditions and
    the model's predicted risk level.
    """

    factors = []

    # Wind
    if wind_speed_kmh >= 50:
        factors.append(
            "Very high wind speed may increase "
            "environmental motion and sensor disturbances."
        )
    elif wind_speed_kmh >= 30:
        factors.append(
            "Elevated wind speed may contribute "
            "to environmental disturbances."
        )
    else:
        factors.append(
            "Wind speed is within a relatively "
            "moderate range."
        )

    # Rainfall
    if rainfall_mm >= 20:
        factors.append(
            "Heavy rainfall may create additional "
            "environmental sensor disturbances."
        )
    elif rainfall_mm >= 5:
        factors.append(
            "Rainfall is present and may contribute "
            "to environmental noise."
        )
    else:
        factors.append(
            "Rainfall is currently minimal."
        )

    # Humidity
    if humidity_percent >= 85:
        factors.append(
            "High humidity indicates significantly "
            "moist environmental conditions."
        )
    elif humidity_percent >= 70:
        factors.append(
            "Humidity is relatively high."
        )

    # Temperature
    if temperature_c >= 40:
        factors.append(
            "Very high temperature is present."
        )
    elif temperature_c <= 10:
        factors.append(
            "Low temperature conditions are present."
        )

    # Storm
    if storm == 1:
        factors.append(
            "Thunderstorm conditions are detected."
        )
    else:
        factors.append(
            "No thunderstorm condition is detected."
        )

    # Summary
    if risk_level == "HIGH_RISK":
        summary = (
            "High environmental risk detected. "
            "Reduced sensor sensitivity is recommended "
            "to compensate for increased weather-related "
            "disturbances."
        )

    elif risk_level == "MEDIUM_RISK":
        summary = (
            "Moderate environmental risk detected. "
            "Medium sensor sensitivity is recommended."
        )

    else:
        summary = (
            "Low environmental risk detected. "
            "Normal high sensor sensitivity can be maintained."
        )

    return {
        "summary": summary,
        "factors": factors
    }