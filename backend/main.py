from pathlib import Path
import json

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import desc

from database import SessionLocal
from prediction_model import Prediction

from weather_service import (
    get_current_weather,
    prepare_model_features
)

from explanation_service import (
    generate_explanation
)
# ============================================
# PATHS
# ============================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = (
    BASE_DIR
    / "model"
    / "vigil_calibration_model.joblib"
)


# ============================================
# LOAD ML MODEL
# ============================================

try:
    model = joblib.load(MODEL_PATH)
    MODEL_LOADED = True
    MODEL_ERROR = None

except Exception as e:
    model = None
    MODEL_LOADED = False
    MODEL_ERROR = str(e)


# ============================================
# FASTAPI APPLICATION
# ============================================

app = FastAPI(
    title="VIGIL PIDS API",
    description="Weather-Based Sensor Calibration Recommendation System",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# WEATHER INPUT
# ============================================

class WeatherInput(BaseModel):
    wind_speed_kmh: float
    rainfall_mm: float
    temperature_c: float
    humidity_percent: float
    storm: int


# ============================================
# ROOT
# ============================================

@app.get("/")
def root():
    return {
        "application": "VIGIL PIDS",
        "status": "online",
        "version": "1.0.0"
    }


# ============================================
# HEALTH CHECK
# ============================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model_loaded": MODEL_LOADED
    }


# ============================================
# MODEL INFORMATION
# ============================================

@app.get("/model")
def model_info():

    if not MODEL_LOADED:

        raise HTTPException(
            status_code=500,
            detail=f"Model could not be loaded: {MODEL_ERROR}"
        )

    return {
        "model": "Gradient Boosting Classifier",
        "status": "loaded",
        "features": [
            "wind_speed_kmh",
            "rainfall_mm",
            "temperature_c",
            "humidity_percent",
            "storm"
        ]
    }


# ============================================
# WEATHER PREDICTION
# ============================================

@app.post("/predict")
def predict(weather: WeatherInput):

    if not MODEL_LOADED:

        raise HTTPException(
            status_code=500,
            detail="ML model is not loaded."
        )

    # ------------------------------------------------
    # Validate weather values
    # ------------------------------------------------

    if weather.wind_speed_kmh < 0:
        raise HTTPException(
            status_code=400,
            detail="Wind speed cannot be negative."
        )

    if weather.rainfall_mm < 0:
        raise HTTPException(
            status_code=400,
            detail="Rainfall cannot be negative."
        )

    if not 0 <= weather.humidity_percent <= 100:
        raise HTTPException(
            status_code=400,
            detail="Humidity must be between 0 and 100."
        )

    if weather.storm not in [0, 1]:
        raise HTTPException(
            status_code=400,
            detail="Storm must be 0 or 1."
        )

    # ------------------------------------------------
    # Prepare model input
    # ------------------------------------------------

    features = np.array([[
        weather.wind_speed_kmh,
        weather.rainfall_mm,
        weather.temperature_c,
        weather.humidity_percent,
        weather.storm
    ]])

    # ------------------------------------------------
    # Prediction
    # ------------------------------------------------

    prediction = model.predict(features)[0]

    # ------------------------------------------------
    # Prediction confidence
    # ------------------------------------------------

    probabilities = model.predict_proba(features)[0]

    confidence = float(
        np.max(probabilities) * 100
    )

    # ------------------------------------------------
    # Sensor sensitivity recommendation
    # ------------------------------------------------

    sensitivity_mapping = {
        "LOW_RISK": "HIGH",
        "MEDIUM_RISK": "MEDIUM",
        "HIGH_RISK": "LOW"
    }

    recommended_sensitivity = sensitivity_mapping.get(
        prediction
    )

    # ------------------------------------------------
    # Response
    # ------------------------------------------------

    return {
        "risk_level": prediction,
        "confidence_percent": round(
            confidence,
            2
        ),
        "recommended_sensitivity": recommended_sensitivity,
        "weather": {
            "wind_speed_kmh": weather.wind_speed_kmh,
            "rainfall_mm": weather.rainfall_mm,
            "temperature_c": weather.temperature_c,
            "humidity_percent": weather.humidity_percent,
            "storm": weather.storm
        }
    }
# ============================================
# LIVE WEATHER PREDICTION
# ============================================

@app.get("/weather/predict")
def predict_live_weather(
    latitude: float,
    longitude: float
):

    if not MODEL_LOADED:
        raise HTTPException(
            status_code=500,
            detail="ML model is not loaded."
        )

    # ------------------------------------------------
    # Get live weather
    # ------------------------------------------------

    try:

        weather_data = get_current_weather(
            latitude,
            longitude
        )

    except Exception as e:

        raise HTTPException(
            status_code=502,
            detail=f"Weather service error: {str(e)}"
        )

    # ------------------------------------------------
    # Convert weather to model features
    # ------------------------------------------------

    try:

        features = prepare_model_features(
            weather_data
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Weather processing error: {str(e)}"
        )

    # ------------------------------------------------
    # Prepare model input
    # ------------------------------------------------

    model_input = np.array([[
        features["wind_speed_kmh"],
        features["rainfall_mm"],
        features["temperature_c"],
        features["humidity_percent"],
        features["storm"]
    ]])

    # ------------------------------------------------
    # Predict
    # ------------------------------------------------

    prediction = model.predict(
        model_input
    )[0]

    probabilities = model.predict_proba(
        model_input
    )[0]

    confidence = float(
        np.max(probabilities) * 100
    )

    # ------------------------------------------------
    # Sensitivity recommendation
    # ------------------------------------------------

    sensitivity_mapping = {
        "LOW_RISK": "HIGH",
        "MEDIUM_RISK": "MEDIUM",
        "HIGH_RISK": "LOW"
    }

    recommended_sensitivity = sensitivity_mapping[
        prediction
    ]

    # ------------------------------------------------
    # Return result
    # ------------------------------------------------

    # ------------------------------------------------
# Generate explanation
# ------------------------------------------------

    # ----------------------------------------
# Generate explanation
# ----------------------------------------

    explanation = generate_explanation(
        wind_speed_kmh=features["wind_speed_kmh"],
        rainfall_mm=features["rainfall_mm"],
        temperature_c=features["temperature_c"],
        humidity_percent=features["humidity_percent"],
        storm=features["storm"],
        risk_level=prediction
    )


    # ----------------------------------------
    # Save prediction to PostgreSQL
    # ----------------------------------------

    db = SessionLocal()

    try:

        prediction_record = Prediction(
            latitude=latitude,
            longitude=longitude,

            wind_speed_kmh=features["wind_speed_kmh"],
            rainfall_mm=features["rainfall_mm"],
            temperature_c=features["temperature_c"],
            humidity_percent=features["humidity_percent"],
            storm=features["storm"],

            risk_level=prediction,
            confidence_percent=round(
                confidence,
                2
            ),

            recommended_sensitivity=
                recommended_sensitivity,

            explanation_summary=
                explanation["summary"],

            explanation_factors=
                json.dumps(
                    explanation["factors"]
                )
        )

        db.add(prediction_record)
        db.commit()

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

    finally:

        db.close()


    # ----------------------------------------
    # Return response
    # ----------------------------------------

    return {
        "location": {
            "latitude": latitude,
            "longitude": longitude
        },

        "weather": features,

        "prediction": {
            "risk_level": prediction,
            "confidence_percent": round(
                confidence,
                2
            ),
            "recommended_sensitivity":
                recommended_sensitivity
        },

        "explanation": explanation
    }
# ============================================
# PREDICTION HISTORY
# ============================================

@app.get("/history")
def get_prediction_history(limit: int = 20):

    # ----------------------------------------
    # Validate limit
    # ----------------------------------------

    if limit < 1 or limit > 100:

        raise HTTPException(
            status_code=400,
            detail="Limit must be between 1 and 100."
        )

    # ----------------------------------------
    # Open database session
    # ----------------------------------------

    db = SessionLocal()

    try:

        records = (
            db.query(Prediction)
            .order_by(desc(Prediction.created_at))
            .limit(limit)
            .all()
        )

        history = []

        for record in records:

            history.append({
                "id": record.id,

                "created_at":
                    record.created_at.isoformat(),

                "location": {
                    "latitude":
                        record.latitude,

                    "longitude":
                        record.longitude
                },

                "weather": {
                    "wind_speed_kmh":
                        record.wind_speed_kmh,

                    "rainfall_mm":
                        record.rainfall_mm,

                    "temperature_c":
                        record.temperature_c,

                    "humidity_percent":
                        record.humidity_percent,

                    "storm":
                        record.storm
                },

                "prediction": {
                    "risk_level":
                        record.risk_level,

                    "confidence_percent":
                        record.confidence_percent,

                    "recommended_sensitivity":
                        record.recommended_sensitivity
                },

                "explanation": {
                    "summary":
                        record.explanation_summary,

                    "factors":
                        json.loads(
                            record.explanation_factors
                        )
                }
            })

        return {
            "count": len(history),
            "records": history
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

    finally:

        db.close()

# ============================================
# ANALYTICS
# ============================================

@app.get("/analytics")
def get_analytics():

    db = SessionLocal()

    try:

        records = (
            db.query(Prediction)
            .order_by(Prediction.created_at.asc())
            .all()
        )

        total_predictions = len(records)

        # ----------------------------------------
        # Empty database
        # ----------------------------------------

        if total_predictions == 0:

            return {
                "total_predictions": 0,
                "risk_distribution": {
                    "LOW_RISK": 0,
                    "MEDIUM_RISK": 0,
                    "HIGH_RISK": 0
                },
                "risk_percentages": {
                    "LOW_RISK": 0,
                    "MEDIUM_RISK": 0,
                    "HIGH_RISK": 0
                },
                "average_confidence_percent": 0,
                "latest_prediction": None,
                "timeline": []
            }

        # ----------------------------------------
        # Risk counts
        # ----------------------------------------

        risk_counts = {
            "LOW_RISK": 0,
            "MEDIUM_RISK": 0,
            "HIGH_RISK": 0
        }

        confidence_values = []

        timeline = []

        for record in records:

            risk_counts[record.risk_level] += 1

            confidence_values.append(
                record.confidence_percent
            )

            timeline.append({
                "timestamp":
                    record.created_at.isoformat(),

                "risk_level":
                    record.risk_level,

                "confidence_percent":
                    record.confidence_percent,

                "recommended_sensitivity":
                    record.recommended_sensitivity
            })

        # ----------------------------------------
        # Risk percentages
        # ----------------------------------------

        risk_percentages = {
            risk: round(
                (count / total_predictions) * 100,
                2
            )
            for risk, count in risk_counts.items()
        }

        # ----------------------------------------
        # Average confidence
        # ----------------------------------------

        average_confidence = round(
            sum(confidence_values)
            / len(confidence_values),
            2
        )

        # ----------------------------------------
        # Latest prediction
        # ----------------------------------------

        latest = records[-1]

        latest_prediction = {
            "timestamp":
                latest.created_at.isoformat(),

            "location": {
                "latitude":
                    latest.latitude,

                "longitude":
                    latest.longitude
            },

            "risk_level":
                latest.risk_level,

            "confidence_percent":
                latest.confidence_percent,

            "recommended_sensitivity":
                latest.recommended_sensitivity
        }

        # ----------------------------------------
        # Final response
        # ----------------------------------------

        return {
            "total_predictions":
                total_predictions,

            "risk_distribution":
                risk_counts,

            "risk_percentages":
                risk_percentages,

            "average_confidence_percent":
                average_confidence,

            "latest_prediction":
                latest_prediction,

            "timeline":
                timeline
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

    finally:

        db.close()