import { useEffect, useState } from "react";

import {
  Wind,
  CloudRain,
  Thermometer,
  Droplets,
  ShieldAlert,
  Gauge,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import MetricCard from "./components/MetricCard";
import LiveMonitor from "./components/LiveMonitor";
import ScenarioSimulator from "./components/ScenarioSimulator";
import PredictionHistory from "./components/PredictionHistory";
import Analytics from "./components/Analytics";
import {
  getLiveWeatherPrediction,
  getAnalytics,
} from "./services/api";


function App() {

  const [activePage, setActivePage] = useState("overview");

  const [prediction, setPrediction] = useState(null);

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);


  const latitude = 18.5204;
  const longitude = 73.8567;


  async function loadDashboard() {

    try {

      setLoading(true);
      setError(null);

      const [liveData, analyticsData] =
        await Promise.all([
          getLiveWeatherPrediction(
            latitude,
            longitude
          ),

          getAnalytics(),
        ]);

      setPrediction(liveData);
      setAnalytics(analyticsData);

    } catch (err) {

      console.error(err);

      setError(
        "Unable to connect to the VIGIL backend."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {
    loadDashboard();
  }, []);


  const riskLevel =
    prediction?.prediction?.risk_level;


  const riskColor =
    riskLevel === "HIGH_RISK"
      ? "text-red-400"
      : riskLevel === "MEDIUM_RISK"
        ? "text-amber-400"
        : "text-emerald-400";


  const riskBorder =
    riskLevel === "HIGH_RISK"
      ? "border-red-400/20 bg-red-400/5"
      : riskLevel === "MEDIUM_RISK"
        ? "border-amber-400/20 bg-amber-400/5"
        : "border-emerald-400/20 bg-emerald-400/5";


  function renderOverview() {

    if (loading) {

      return (
        <div className="flex min-h-[500px] items-center justify-center">

          <div className="text-center">

            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-cyan-400" />

            <p className="mt-4 text-sm text-slate-400">
              Fetching live environmental conditions...
            </p>

          </div>

        </div>
      );

    }


    if (error) {

      return (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6">

          <div className="flex items-center gap-3">

            <AlertTriangle className="h-5 w-5 text-red-400" />

            <div>

              <p className="font-medium text-red-300">
                Backend connection failed
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Make sure FastAPI is running on port 8000.
              </p>

            </div>

          </div>


          <button
            onClick={loadDashboard}
            className="mt-5 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300 transition hover:bg-white/[0.08]"
          >
            Retry
          </button>

        </div>
      );

    }


    const weather = prediction.weather;

    const result = prediction.prediction;

    const explanation = prediction.explanation;


    return (
      <div className="space-y-6">

        {/* Header */}

        <div>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-xs uppercase tracking-[0.2em] text-emerald-400">
              Live environmental assessment
            </span>

          </div>


          <h1 className="mt-3 text-3xl font-semibold text-white">
            Environmental intelligence at a glance.
          </h1>


          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Current weather conditions are analyzed by the
            VIGIL predictive model to recommend appropriate
            sensor sensitivity.
          </p>

        </div>


        {/* Weather metrics */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            label="Temperature"
            value={weather.temperature_c}
            unit="°C"
            description="Current air temperature"
            icon={<Thermometer className="h-5 w-5" />}
          />

          <MetricCard
            label="Wind Speed"
            value={weather.wind_speed_kmh}
            unit="km/h"
            description="Current wind movement"
            icon={<Wind className="h-5 w-5" />}
          />

          <MetricCard
            label="Humidity"
            value={weather.humidity_percent}
            unit="%"
            description="Relative humidity"
            icon={<Droplets className="h-5 w-5" />}
          />

          <MetricCard
            label="Rainfall"
            value={weather.rainfall_mm}
            unit="mm"
            description="Current precipitation"
            icon={<CloudRain className="h-5 w-5" />}
          />

        </div>


        {/* Main risk panel */}

        <div className="grid gap-6 lg:grid-cols-3">

          <div
            className={`lg:col-span-2 rounded-3xl border p-7 ${riskBorder}`}
          >

            <div className="flex flex-col justify-between gap-8 md:flex-row">

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Current predicted risk
                </p>


                <div className="mt-4 flex items-center gap-4">

                  <div
                    className={`rounded-2xl border border-current/10 bg-white/[0.03] p-4 ${riskColor}`}
                  >
                    <ShieldAlert className="h-8 w-8" />
                  </div>


                  <div>

                    <h2
                      className={`text-4xl font-bold ${riskColor}`}
                    >
                      {result.risk_level.replace("_", " ")}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Environmental disturbance assessment
                    </p>

                  </div>

                </div>

              </div>


              <div className="min-w-[180px]">

                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                  Model confidence
                </p>


                <p
                  className={`mt-2 text-4xl font-semibold ${riskColor}`}
                >
                  {result.confidence_percent}%
                </p>


                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">

                  <div
                    className={`h-full rounded-full transition-all duration-700 ${riskColor.replace(
                      "text-",
                      "bg-"
                    )}`}
                    style={{
                      width: `${result.confidence_percent}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>


          {/* Sensitivity */}

          <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.035] p-7">

            <div className="flex items-center gap-3">

              <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/10 p-3">

                <Gauge className="h-5 w-5 text-cyan-400" />

              </div>


              <div>

                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                  Recommended action
                </p>

                <h3 className="mt-1 text-xl font-semibold text-white">
                  Sensor Sensitivity
                </h3>

              </div>

            </div>


            <div className="mt-7">

              <p className="text-4xl font-bold text-cyan-300">
                {result.recommended_sensitivity}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Recommended sensitivity based on the
                predicted environmental risk.
              </p>

            </div>

          </div>

        </div>


        {/* Explanation + analytics */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Explanation */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">

            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Model explanation
            </p>

            <h3 className="mt-3 text-xl font-semibold text-white">
              Why VIGIL made this recommendation
            </h3>


            <p className="mt-3 text-sm leading-6 text-slate-400">
              {explanation?.summary}
            </p>


            <div className="mt-6 space-y-3">

              {explanation?.factors?.map(
                (factor, index) => (

                  <div
                    key={index}
                    className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                  >

                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />

                    <p className="text-sm text-slate-400">
                      {factor}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>


          {/* Analytics */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Prediction history
                </p>

                <h3 className="mt-3 text-xl font-semibold text-white">
                  System activity
                </h3>

              </div>


              <button
                onClick={loadDashboard}
                className="rounded-xl border border-white/10 p-2.5 text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>

            </div>


            <div className="mt-7 grid grid-cols-2 gap-4">

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">

                <p className="text-xs text-slate-500">
                  Total predictions
                </p>

                <p className="mt-2 text-3xl font-semibold text-white">
                  {analytics?.total_predictions ?? 0}
                </p>

              </div>


              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">

                <p className="text-xs text-slate-500">
                  Avg. confidence
                </p>

                <p className="mt-2 text-3xl font-semibold text-white">
                  {analytics?.average_confidence_percent ?? 0}%
                </p>

              </div>

            </div>


            <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5">

              <p className="text-xs text-slate-500">
                Risk distribution
              </p>


              <div className="mt-4 space-y-3">

                {[
                  "LOW_RISK",
                  "MEDIUM_RISK",
                  "HIGH_RISK",
                ].map((risk) => (

                  <div
                    key={risk}
                    className="flex items-center justify-between"
                  >

                    <span className="text-sm text-slate-400">
                      {risk.replace("_", " ")}
                    </span>

                    <span className="text-sm font-medium text-white">
                      {analytics?.risk_distribution?.[risk] ?? 0}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }


  function renderPage() {

    if (activePage === "overview") {
      return renderOverview();
    }

    if (activePage === "live") {
      return <LiveMonitor />;
    }
    if (activePage === "simulator") {
    return <ScenarioSimulator />;
    }
    if (activePage === "history") {
    return <PredictionHistory />;
    }
    if (activePage === "analytics") {
    return <Analytics />;
    } 

    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-10">

        <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
          VIGIL PIDS
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">

          {activePage === "history" &&
            "Prediction History"}

          {activePage === "analytics" &&
            "Analytics"}

          {activePage === "simulator" &&
            "Scenario Simulator"}

          {activePage === "about" &&
            "About VIGIL"}

        </h1>

        <p className="mt-3 text-slate-500">
          This module will be connected in the next stage.
        </p>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="ml-72 min-h-screen">

        <Topbar
          activePage={activePage}
        />

        <main className="p-8">

          {renderPage()}

        </main>

      </div>

    </div>
  );
}


export default App;