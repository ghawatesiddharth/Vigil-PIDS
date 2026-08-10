import { useState } from "react";

import {
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  ShieldAlert,
  Gauge,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";

import { predictWeather } from "../services/api";


const SCENARIOS = {
  normal: {
    name: "Normal Weather",
    description:
      "Stable environmental conditions with minimal disturbance.",
    wind_speed_kmh: 8,
    rainfall_mm: 0,
    temperature_c: 27,
    humidity_percent: 55,
    storm: 0,
  },

  heavyRain: {
    name: "Heavy Rain",
    description:
      "High rainfall and humidity with increased environmental disturbance.",
    wind_speed_kmh: 18,
    rainfall_mm: 20,
    temperature_c: 25,
    humidity_percent: 88,
    storm: 0,
  },

  highWind: {
    name: "High Wind",
    description:
      "Strong wind conditions that may introduce sensor movement and noise.",
    wind_speed_kmh: 55,
    rainfall_mm: 5,
    temperature_c: 26,
    humidity_percent: 72,
    storm: 0,
  },

  severeStorm: {
    name: "Severe Storm",
    description:
      "Extreme wind, rainfall, humidity and active storm conditions.",
    wind_speed_kmh: 60,
    rainfall_mm: 35,
    temperature_c: 24,
    humidity_percent: 95,
    storm: 1,
  },
};


function ScenarioSimulator() {

  const [selectedScenario, setSelectedScenario] =
    useState("normal");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);


  const scenario =
    SCENARIOS[selectedScenario];


  async function runScenario() {

    try {

      setLoading(true);
      setError(null);

      setResult(null);

      const data =
        await predictWeather({
          wind_speed_kmh:
            scenario.wind_speed_kmh,

          rainfall_mm:
            scenario.rainfall_mm,

          temperature_c:
            scenario.temperature_c,

          humidity_percent:
            scenario.humidity_percent,

          storm:
            scenario.storm,
        });

      setResult(data);

    } catch (err) {

      console.error(
        "Scenario prediction error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Unable to run scenario."
      );

    } finally {

      setLoading(false);

    }
  }


  const riskLevel =
    result?.risk_level;


  const riskColor =
    riskLevel === "HIGH_RISK"
      ? "text-red-400"
      : riskLevel === "MEDIUM_RISK"
        ? "text-amber-400"
        : "text-emerald-400";


  const riskBackground =
    riskLevel === "HIGH_RISK"
      ? "border-red-400/20 bg-red-400/5"
      : riskLevel === "MEDIUM_RISK"
        ? "border-amber-400/20 bg-amber-400/5"
        : "border-emerald-400/20 bg-emerald-400/5";


  return (
    <div className="space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div>

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

          <span className="text-xs uppercase tracking-[0.2em] text-cyan-400">
            Predictive simulation
          </span>

        </div>


        <h1 className="mt-3 text-3xl font-semibold text-white">
          Scenario Simulator
        </h1>


        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Test how VIGIL responds to different environmental
          conditions and observe the resulting sensor
          sensitivity recommendation.
        </p>

      </div>


      {/* ======================================
          SCENARIO SELECTOR
      ====================================== */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {Object.entries(SCENARIOS).map(
          ([key, item]) => {

            const active =
              selectedScenario === key;

            return (

              <button
                key={key}
                onClick={() => {
                  setSelectedScenario(key);
                  setResult(null);
                  setError(null);
                }}
                className={`rounded-2xl border p-5 text-left transition ${
                  active
                    ? "border-cyan-400/40 bg-cyan-400/[0.06]"
                    : "border-white/10 bg-white/[0.025] hover:border-white/20"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div
                    className={`rounded-xl p-3 ${
                      active
                        ? "bg-cyan-400/10 text-cyan-400"
                        : "bg-white/[0.04] text-slate-500"
                    }`}
                  >

                    {key === "normal" && (
                      <CheckCircle2 className="h-5 w-5" />
                    )}

                    {key === "heavyRain" && (
                      <CloudRain className="h-5 w-5" />
                    )}

                    {key === "highWind" && (
                      <Wind className="h-5 w-5" />
                    )}

                    {key === "severeStorm" && (
                      <Zap className="h-5 w-5" />
                    )}

                  </div>


                  {active && (

                    <span className="text-[10px] uppercase tracking-widest text-cyan-400">
                      Selected
                    </span>

                  )}

                </div>


                <h2 className="mt-4 font-semibold text-white">
                  {item.name}
                </h2>


                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {item.description}
                </p>

              </button>

            );

          }
        )}

      </div>


      {/* ======================================
          SCENARIO CONDITIONS
      ====================================== */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Selected scenario
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              {scenario.name}
            </h2>

          </div>


          <button
            onClick={runScenario}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#07111f] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Running model...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Run Scenario
              </>
            )}

          </button>

        </div>


        {/* Conditions */}

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <ConditionCard
            label="Wind"
            value={scenario.wind_speed_kmh}
            unit="km/h"
            icon={<Wind className="h-5 w-5" />}
          />


          <ConditionCard
            label="Rainfall"
            value={scenario.rainfall_mm}
            unit="mm"
            icon={<CloudRain className="h-5 w-5" />}
          />


          <ConditionCard
            label="Temperature"
            value={scenario.temperature_c}
            unit="°C"
            icon={<Thermometer className="h-5 w-5" />}
          />


          <ConditionCard
            label="Humidity"
            value={scenario.humidity_percent}
            unit="%"
            icon={<Droplets className="h-5 w-5" />}
          />


          <ConditionCard
            label="Storm"
            value={
              scenario.storm === 1
                ? "Detected"
                : "None"
            }
            unit=""
            icon={<Zap className="h-5 w-5" />}
          />

        </div>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">

          <div className="flex items-start gap-3">

            <AlertTriangle className="mt-0.5 h-5 w-5 text-red-400" />

            <div>

              <p className="font-medium text-red-300">
                Simulation failed
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {error}
              </p>

            </div>

          </div>

        </div>

      )}


      {/* ======================================
          RESULT
      ====================================== */}

      {result && (

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Risk */}

          <div
            className={`rounded-3xl border p-7 lg:col-span-2 ${riskBackground}`}
          >

            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Model result
            </p>


            <div className="mt-6 flex flex-col justify-between gap-8 md:flex-row">

              <div className="flex items-center gap-4">

                <div
                  className={`rounded-2xl border border-current/10 bg-white/[0.03] p-4 ${riskColor}`}
                >

                  <ShieldAlert className="h-9 w-9" />

                </div>


                <div>

                  <p className="text-sm text-slate-500">
                    Predicted environmental risk
                  </p>

                  <h2
                    className={`mt-1 text-4xl font-bold ${riskColor}`}
                  >
                    {result.risk_level.replace(
                      "_",
                      " "
                    )}
                  </h2>

                </div>

              </div>


              <div>

                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                  Confidence
                </p>

                <p
                  className={`mt-2 text-4xl font-semibold ${riskColor}`}
                >
                  {result.confidence_percent}%
                </p>

              </div>

            </div>

          </div>


          {/* Sensitivity */}

          <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.035] p-7">

            <div className="flex items-center gap-3">

              <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/10 p-3">

                <Gauge className="h-5 w-5 text-cyan-400" />

              </div>

              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                Recommended sensitivity
              </p>

            </div>


            <p className="mt-6 text-4xl font-bold text-cyan-300">
              {result.recommended_sensitivity}
            </p>


            <p className="mt-2 text-sm leading-6 text-slate-500">
              VIGIL recommends this sensor sensitivity
              for the selected environmental scenario.
            </p>

          </div>

        </div>

      )}


      {/* ======================================
          EXPLANATION
      ====================================== */}

      {result?.explanation && (

        <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">

          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Decision explanation
          </p>


          <h2 className="mt-3 text-xl font-semibold text-white">
            Why did VIGIL make this recommendation?
          </h2>


          <p className="mt-4 text-sm leading-7 text-slate-400">
            {result.explanation.summary}
          </p>


          <div className="mt-5 space-y-2">

            {result.explanation.factors?.map(
              (factor, index) => (

                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                >

                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400" />

                  <p className="text-sm leading-6 text-slate-400">
                    {factor}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </div>
  );
}


// ============================================
// CONDITION CARD
// ============================================

function ConditionCard({
  label,
  value,
  unit,
  icon,
}) {

  return (
    <div className="rounded-2xl border border-white/10 bg-[#07111f] p-4">

      <div className="flex items-center justify-between">

        <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>

        <span className="text-cyan-400">
          {icon}
        </span>

      </div>


      <p className="mt-4 text-2xl font-semibold text-white">

        {value}

        {unit && (
          <span className="ml-1 text-xs font-normal text-slate-500">
            {unit}
          </span>
        )}

      </p>

    </div>
  );
}

export default ScenarioSimulator;