# VIGIL PIDS

### Weather-Aware Predictive Intelligence for Environmental Risk & Sensor Sensitivity

VIGIL PIDS is an end-to-end machine learning and full-stack predictive intelligence system that analyzes environmental weather conditions and estimates environmental disturbance risk.

The system combines a trained Gradient Boosting classifier, live weather data, explainable predictions, PostgreSQL persistence, FastAPI services, and an interactive React dashboard.

VIGIL translates environmental conditions into an actionable sensor sensitivity recommendation:

> **LOW RISK → HIGH SENSOR SENSITIVITY**  
> **MEDIUM RISK → MEDIUM SENSOR SENSITIVITY**  
> **HIGH RISK → LOW SENSOR SENSITIVITY**

---

## 🚀 Project Overview

Environmental conditions such as wind, rainfall, humidity, and storms can introduce disturbances that affect sensor measurements.

VIGIL PIDS addresses this by creating a predictive layer between environmental conditions and sensor configuration.

Instead of simply displaying weather information, VIGIL:

1. Collects environmental conditions
2. Converts weather information into model features
3. Predicts environmental risk
4. Calculates prediction confidence
5. Recommends sensor sensitivity
6. Generates a human-readable explanation
7. Stores predictions in PostgreSQL
8. Visualizes the results through an interactive dashboard

---

## 🎯 Key Features

### 🤖 Machine Learning

- Gradient Boosting Classification
- Three-class risk prediction
- `LOW_RISK`
- `MEDIUM_RISK`
- `HIGH_RISK`
- Model confidence estimation
- Feature importance analysis
- Scenario-based validation

### 🌦️ Live Weather Intelligence

- Live weather retrieval
- Temperature
- Wind speed
- Rainfall
- Humidity
- Storm detection
- Location-based prediction
- Map-based location selection

### 🧠 Explainable Predictions

Every prediction provides:

- Risk level
- Confidence percentage
- Recommended sensor sensitivity
- Explanation summary
- Contributing environmental factors

### 🗄️ PostgreSQL Persistence

Predictions are stored with:

- Timestamp
- Latitude
- Longitude
- Weather features
- Risk classification
- Model confidence
- Recommended sensitivity
- Explanation

### 📊 Analytics Dashboard

The dashboard provides:

- Total predictions
- Risk distribution
- Risk percentages
- Average model confidence
- Prediction timeline
- Latest prediction
- Latest location
- System-level insights

### 🧪 Scenario Simulator

VIGIL includes four predefined environmental scenarios:

| Scenario | Wind | Rainfall | Temperature | Humidity | Storm |
|---|---:|---:|---:|---:|---:|
| Normal Weather | 8 km/h | 0 mm | 27°C | 55% | No |
| Heavy Rain | 18 km/h | 20 mm | 25°C | 88% | No |
| High Wind | 55 km/h | 5 mm | 26°C | 72% | No |
| Severe Storm | 60 km/h | 35 mm | 24°C | 95% | Yes |

The simulator demonstrates how changing environmental conditions affect the predicted risk and recommended sensor sensitivity.

---

# 🧠 Machine Learning Model

VIGIL was trained using five environmental features:

```text
wind_speed_kmh
rainfall_mm
temperature_c
humidity_percent
storm
```

### Target

```text
risk_level
```

### Dataset

```text
6,000 samples
5 features
3 risk classes
```

### Dataset Distribution

| Risk Level | Percentage |
|---|---:|
| LOW_RISK | 58.42% |
| MEDIUM_RISK | 30.92% |
| HIGH_RISK | 10.67% |

### Train-Test Split

```text
Training samples: 4,800
Testing samples: 1,200
```

---

# 📈 Model Evaluation

Three classification models were evaluated:

| Model | Accuracy | Precision | Recall | F1 Score |
|---|---:|---:|---:|---:|
| Gradient Boosting | **89.08%** | **88.95%** | **89.08%** | **88.95%** |
| Random Forest | 88.50% | 88.58% | 88.50% | 88.53% |
| Logistic Regression | 83.00% | 82.63% | 83.00% | 82.71% |

### Selected Model

**Gradient Boosting Classifier**

Test accuracy:

```text
89.08%
```

Weighted F1 score:

```text
88.95%
```

---

# 🔍 Gradient Boosting Classification Report

| Risk Level | Precision | Recall | F1 Score | Support |
|---|---:|---:|---:|---:|
| HIGH_RISK | 89.66% | 81.25% | 85.25% | 128 |
| LOW_RISK | 91.39% | 95.44% | 93.37% | 701 |
| MEDIUM_RISK | 84.09% | 79.78% | 81.88% | 371 |

Overall accuracy:

```text
89.08%
```

---

# 🎯 Feature Importance

The trained Gradient Boosting model identified the following feature importance:

| Feature | Importance |
|---|---:|
| Wind Speed | **39.93%** |
| Storm | **22.73%** |
| Rainfall | **22.02%** |
| Humidity | **12.62%** |
| Temperature | **2.70%** |

### Interpretation

Wind speed is the strongest contributor to the model's environmental risk prediction.

Storm conditions and rainfall are also significant contributors, while temperature has comparatively lower influence in the trained model.

---

# 🧪 Scenario Validation

VIGIL was tested using four representative environmental scenarios.

| Scenario | Predicted Risk | Confidence | Recommended Sensitivity |
|---|---|---:|---|
| Normal Weather | **LOW_RISK** | **99.84%** | **HIGH** |
| Heavy Rain | **MEDIUM_RISK** | **96.55%** | **MEDIUM** |
| High Wind | **MEDIUM_RISK** | **96.13%** | **MEDIUM** |
| Severe Storm | **HIGH_RISK** | **99.90%** | **LOW** |

### Risk Progression

```text
Normal Weather
      ↓
LOW RISK
      ↓
HIGH SENSOR SENSITIVITY
```

```text
Heavy Rain / High Wind
      ↓
MEDIUM RISK
      ↓
MEDIUM SENSOR SENSITIVITY
```

```text
Severe Storm
      ↓
HIGH RISK
      ↓
LOW SENSOR SENSITIVITY
```

---

# 🏗️ System Architecture

```text
                     ┌──────────────────────┐
                     │    Live Weather API  │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ Weather Processing   │
                     │ & Feature Preparation│
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ Gradient Boosting    │
                     │ Classifier           │
                     └──────────┬───────────┘
                                │
                     ┌──────────┴───────────┐
                     │                      │
                     ▼                      ▼
              Risk Prediction        Confidence Score
                     │
                     ▼
              Sensitivity Mapping
                     │
                     ▼
              Explanation Service
                     │
                     ▼
              ┌───────────────┐
              │  PostgreSQL   │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   FastAPI     │
              │   Backend     │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ React + Vite  │
              │ Dashboard     │
              └───────────────┘
```

---

# 🛠️ Technology Stack

### Machine Learning

- Python
- Pandas
- NumPy
- Scikit-learn
- Joblib
- Jupyter Notebook

### Backend

- FastAPI
- Python
- Pydantic
- SQLAlchemy
- PostgreSQL
- Psycopg

### Frontend

- React
- Vite
- Axios
- Recharts
- Lucide React
- Tailwind CSS

### Data & Infrastructure

- PostgreSQL
- REST APIs
- JSON
- Environment variables

### Development

- Git
- GitHub
- VS Code
- PowerShell

---

# 📁 Project Structure

```text
Vigil-PIDS/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── prediction_model.py
│   ├── weather_service.py
│   ├── explanation_service.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Analytics.jsx
│   │   │   ├── LiveMonitor.jsx
│   │   │   ├── LocationMap.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── PredictionHistory.jsx
│   │   │   ├── ScenarioSimulator.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Topbar.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── geocoding.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── data/
│   └── weather_calibration.csv
│
├── model/
│   ├── vigil_calibration_model.joblib
│   ├── model_metadata.json
│   └── README.md
│
├── notebooks/
│   └── README.md
│
├── Vigil_PIDS_Model_Training.ipynb
│
├── .gitignore
└── README.md
```

---

# ⚙️ Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/ghawatesiddharth/Vigil-PIDS.git
cd Vigil-PIDS
```

---

# 🔧 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 🔐 Environment Configuration

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/vigil_pids

WEATHER_API_URL=https://api.open-meteo.com/v1/forecast

FRONTEND_URL=http://localhost:5173
```

> **Important:** Never commit the real `.env` file.

A safe configuration template is provided as:

```text
backend/.env.example
```

---

# 🗄️ PostgreSQL Setup

Create the database:

```sql
CREATE DATABASE vigil_pids;
```

Verify PostgreSQL is running on Windows:

```powershell
Get-Service *postgres*
```

The backend database layer handles the prediction storage used by the application.

---

# ▶️ Run the Backend

From:

```text
Vigil-PIDS/backend
```

run:

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

FastAPI interactive documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

Open another terminal.

Navigate to:

```bash
cd Vigil-PIDS/frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The dashboard will be available at:

```text
http://localhost:5173
```

---

# 🔌 API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/` | GET | API status |
| `/health` | GET | Backend and model health |
| `/model` | GET | Model information |
| `/predict` | POST | Predict risk from weather input |
| `/weather/predict` | GET | Live weather prediction |
| `/history` | GET | Prediction history |
| `/analytics` | GET | Prediction analytics |

---

# 📡 Example Live Prediction

### Request

```text
GET /weather/predict?latitude=18.5204&longitude=73.8567
```

### Example Response

```json
{
  "location": {
    "latitude": 18.5204,
    "longitude": 73.8567
  },
  "weather": {
    "wind_speed_kmh": 21.8,
    "rainfall_mm": 0.1,
    "temperature_c": 26.1,
    "humidity_percent": 74,
    "storm": 0
  },
  "prediction": {
    "risk_level": "LOW_RISK",
    "confidence_percent": 99.27,
    "recommended_sensitivity": "HIGH"
  }
}
```

The response also includes a model explanation describing the environmental factors contributing to the prediction.

---

# 📊 Dashboard

The React dashboard contains six primary sections.

### Overview

Provides a real-time summary of:

- Current weather
- Environmental risk
- Model confidence
- Recommended sensitivity
- Recent prediction information

### Live Monitor

Allows the user to:

- Select a location using the map
- View latitude and longitude
- Retrieve live weather
- Generate a new prediction
- View environmental conditions
- View model results

### Prediction History

Displays predictions persisted in PostgreSQL.

### Analytics

Provides:

- Prediction volume
- Risk distribution
- Risk percentages
- Average confidence
- Confidence timeline
- Latest prediction
- Latest location

### Scenario Simulator

Allows controlled testing of:

- Normal Weather
- Heavy Rain
- High Wind
- Severe Storm

### About VIGIL

Provides information about the system, model and project purpose.

---

# 🧠 Risk-to-Sensitivity Logic

VIGIL converts predicted environmental risk into a sensor sensitivity recommendation.

```python
sensitivity_mapping = {
    "LOW_RISK": "HIGH",
    "MEDIUM_RISK": "MEDIUM",
    "HIGH_RISK": "LOW"
}
```

The purpose is to provide an operational recommendation rather than only returning a classification label.

---

# 🔬 Explainability

VIGIL provides a natural-language explanation for every prediction.

Example:

```text
Low environmental risk detected.
Normal high sensor sensitivity can be maintained.
```

Environmental factors can also be returned, such as:

```text
Wind speed is within a relatively moderate range.
Rainfall is currently minimal.
Humidity is relatively high.
No thunderstorm condition is detected.
```

For severe conditions, the explanation highlights factors such as:

- High wind
- Heavy rainfall
- High humidity
- Thunderstorm conditions

---

# 🧪 Model Development

The complete model development workflow is available in:

```text
Vigil_PIDS_Model_Training.ipynb
```

The workflow includes:

```text
Data Loading
     ↓
Data Inspection
     ↓
Preprocessing
     ↓
Feature / Target Separation
     ↓
Train-Test Split
     ↓
Model Training
     ↓
Model Comparison
     ↓
Evaluation
     ↓
Feature Importance
     ↓
Confusion Matrix
     ↓
Scenario Testing
     ↓
Model Serialization
```

The final model is stored at:

```text
model/vigil_calibration_model.joblib
```

---

# 📌 Current Validation Results

The trained model achieved:

```text
Accuracy: 89.08%
Weighted F1: 88.95%
```

Scenario validation demonstrated:

```text
Normal Weather → LOW_RISK
Heavy Rain     → MEDIUM_RISK
High Wind      → MEDIUM_RISK
Severe Storm   → HIGH_RISK
```

This demonstrates that the model responds to increasing environmental disturbance in the intended direction.

---

# 🏆 Why VIGIL?

Traditional weather dashboards primarily answer:

> **"What is the weather?"**

VIGIL attempts to answer:

> **"What does the current environment mean for sensor operation?"**

This makes VIGIL an example of an **action-oriented predictive intelligence layer** rather than a simple weather visualization application.

---

# 🔮 Future Improvements

Potential future improvements include:

- Real-time automated monitoring
- Scheduled prediction jobs
- Historical weather trend analysis
- Additional environmental features
- Sensor-specific calibration profiles
- Model retraining pipeline
- Cloud-hosted PostgreSQL
- Authentication and role-based access
- Alert and notification system
- Containerized deployment
- Model monitoring and drift detection
- Additional ML models
- Automated CI/CD

---

# ⚠️ Limitations

VIGIL is a predictive prototype and should not be treated as a safety-critical environmental control system.

The current model is trained on the available calibration dataset and its predictions depend on the quality and distribution of that data.

The sensor sensitivity mapping is an operational recommendation layer built on top of the predicted risk classes.

Further real-world sensor validation would be required before deployment in safety-critical environments.

---

# 👨‍💻 Project

**VIGIL PIDS**

Weather-Aware Predictive Intelligence System

Built using:

```text
Python
Scikit-learn
FastAPI
PostgreSQL
React
Vite
Tailwind CSS
Recharts
Axios
```

---

## ⭐ Repository

[View VIGIL PIDS on GitHub](https://github.com/ghawatesiddharth/Vigil-PIDS)

---

## 📄 License

This project is intended for educational, research and portfolio purposes.
