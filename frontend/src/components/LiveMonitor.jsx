import { useState } from "react";

import {
  MapPin,
  RefreshCw,
  Wind,
  CloudRain,
  Thermometer,
  Droplets,
  ShieldAlert,
  Gauge,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { getLiveWeatherPrediction } from "../services/api";
import { getLocationName } from "../services/geocoding";
import LocationMap from "./LocationMap";

function LiveMonitor() {
  // ============================================
  // LOCATION STATE
  // ============================================

  const [latitude, setLatitude] = useState(18.5204);
  const [longitude, setLongitude] = useState(73.8567);

  const [locationName, setLocationName] =
    useState("Pune, India");

  // ============================================
  // RESULT STATE
  // ============================================

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  // ============================================
  // MAP LOCATION SELECTION
  // ============================================

  async function handleLocationSelect(
  lat,
  lng
) {
  const selectedLat =
    Number(lat.toFixed(6));

  const selectedLng =
    Number(lng.toFixed(6));

  setLatitude(selectedLat);
  setLongitude(selectedLng);

  setLocationName(
    "Identifying location..."
  );

  setResult(null);
  setError(null);

  const location =
    await getLocationName(
      selectedLat,
      selectedLng
    );

  setLocationName(
    location.displayName
  );
}

  // ============================================
  // RUN LIVE PREDICTION
  // ============================================

  async function runPrediction() {
    try {
      setLoading(true);
      setError(null);

      const lat = Number(latitude);
      const lon = Number(longitude);

      // ------------------------------------------
      // Validate coordinates
      // ------------------------------------------

      if (
        Number.isNaN(lat) ||
        Number.isNaN(lon)
      ) {
        throw new Error(
          "Please select a valid location on the map."
        );
      }

      if (lat < -90 || lat > 90) {
        throw new Error(
          "Latitude must be between -90 and 90."
        );
      }

      if (lon < -180 || lon > 180) {
        throw new Error(
          "Longitude must be between -180 and 180."
        );
      }

      // ------------------------------------------
      // Call backend
      // ------------------------------------------

      const data =
        await getLiveWeatherPrediction(
          lat,
          lon
        );

      // ------------------------------------------
      // Save prediction
      // ------------------------------------------

      setResult(data);

    } catch (err) {
      console.error(
        "Live prediction error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Unable to fetch live weather prediction."
      );

    } finally {
      setLoading(false);
    }
  }

  // ============================================
  // RISK STYLING
  // ============================================

  const riskLevel =
    result?.prediction?.risk_level;

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

  // ============================================
  // QUICK LOCATION
  // ============================================

  function selectQuickLocation(
    name,
    lat,
    lng
  ) {
    setLatitude(lat);
    setLongitude(lng);
    setLocationName(name);

    setResult(null);
    setError(null);
  }

  // ============================================
  // UI
  // ============================================

  return (
    <div className="space-y-6">

      {/* ========================================
          HEADER
      ======================================== */}

      <div>

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

          <span className="text-xs uppercase tracking-[0.2em] text-cyan-400">
            Real-time monitoring
          </span>

        </div>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Live Environmental Monitor
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Select any location on the map and run the
          VIGIL predictive model against current
          environmental conditions.
        </p>

      </div>


      {/* ========================================
          LOCATION CARD
      ======================================== */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">

        {/* Header */}

        <div className="flex items-center gap-3">

          <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/10 p-3">

            <MapPin className="h-5 w-5 text-cyan-400" />

          </div>

          <div>

            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
              Monitoring location
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Select a location from the map
            </h2>

          </div>

        </div>


        {/* ======================================
            MAP
        ====================================== */}

        <div className="mt-6 overflow-hidden rounded-2xl">

          <LocationMap
            latitude={latitude}
            longitude={longitude}
            onLocationSelect={
              handleLocationSelect
            }
          />

        </div>


        {/* ======================================
            SELECTED LOCATION INFORMATION
        ====================================== */}

        <div className="mt-5 grid gap-4 md:grid-cols-3">

          {/* Latitude */}

          <div className="rounded-xl border border-white/10 bg-[#07111f] p-4">

            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
              Latitude
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              {latitude}
            </p>

          </div>


          {/* Longitude */}

          <div className="rounded-xl border border-white/10 bg-[#07111f] p-4">

            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
              Longitude
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              {longitude}
            </p>

          </div>


          {/* Location */}

          <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">

            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
              Selected location
            </p>

            <p className="mt-2 text-lg font-semibold text-cyan-300">
            {locationName}
            </p>

            <p className="mt-1 text-xs text-slate-600">
            Coordinates selected from map
            </p>

          </div>

        </div>


        {/* ======================================
            ANALYZE BUTTON
        ====================================== */}

        <button
          onClick={runPrediction}
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />

              Analyzing environment...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />

              Analyze Selected Location
            </>
          )}

        </button>


        {/* ======================================
            QUICK LOCATIONS
        ====================================== */}

        <div className="mt-5">

          <div className="mb-3 flex items-center gap-2">

            <span className="text-xs uppercase tracking-[0.12em] text-slate-600">
              Quick locations
            </span>

          </div>

          <div className="flex flex-wrap gap-2">

            {/* Pune */}

            <button
              onClick={() =>
                selectQuickLocation(
                  "Pune, India",
                  18.5204,
                  73.8567
                )
              }
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
            >
              Pune
            </button>


            {/* Mumbai */}

            <button
              onClick={() =>
                selectQuickLocation(
                  "Mumbai, India",
                  19.076,
                  72.8777
                )
              }
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
            >
              Mumbai
            </button>


            {/* Chennai */}

            <button
              onClick={() =>
                selectQuickLocation(
                  "Chennai, India",
                  13.0827,
                  80.2707
                )
              }
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
            >
              Chennai
            </button>


            {/* Delhi */}

            <button
              onClick={() =>
                selectQuickLocation(
                  "Delhi, India",
                  28.6139,
                  77.209
                )
              }
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
            >
              Delhi
            </button>

          </div>

        </div>

      </div>


      {/* ========================================
          ERROR
      ======================================== */}

      {error && (

        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">

          <div className="flex items-start gap-3">

            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />

            <div>

              <p className="font-medium text-red-300">
                Analysis failed
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {error}
              </p>

            </div>

          </div>

        </div>

      )}


      {/* ========================================
          RESULTS
      ======================================== */}

      {result && (

        <div className="space-y-6">

          {/* ====================================
              LOCATION STATUS
          ==================================== */}

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div className="flex items-center gap-2 text-sm text-slate-400">

              <MapPin className="h-4 w-4 text-cyan-400" />

              <span>
                {result.location.latitude}
                {" , "}
                {result.location.longitude}
              </span>

            </div>


            <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-400">

              <CheckCircle2 className="h-3.5 w-3.5" />

              Live analysis complete

            </div>

          </div>


          {/* ====================================
              WEATHER CARDS
          ==================================== */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <WeatherCard
              label="Temperature"
              value={
                result.weather.temperature_c
              }
              unit="°C"
              icon={
                <Thermometer className="h-5 w-5" />
              }
            />


            <WeatherCard
              label="Wind Speed"
              value={
                result.weather.wind_speed_kmh
              }
              unit="km/h"
              icon={
                <Wind className="h-5 w-5" />
              }
            />


            <WeatherCard
              label="Humidity"
              value={
                result.weather.humidity_percent
              }
              unit="%"
              icon={
                <Droplets className="h-5 w-5" />
              }
            />


            <WeatherCard
              label="Rainfall"
              value={
                result.weather.rainfall_mm
              }
              unit="mm"
              icon={
                <CloudRain className="h-5 w-5" />
              }
            />

          </div>


          {/* ====================================
              RISK + SENSITIVITY
          ==================================== */}

          <div className="grid gap-6 lg:grid-cols-3">

            {/* Risk */}

            <div
              className={`rounded-3xl border p-7 lg:col-span-2 ${riskBackground}`}
            >

              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Model assessment
              </p>


              <div className="mt-5 flex flex-col justify-between gap-8 md:flex-row">

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
                      {riskLevel
                        ? riskLevel.replace(
                            "_",
                            " "
                          )
                        : "UNKNOWN"}
                    </h2>

                  </div>

                </div>


                {/* Confidence */}

                <div>

                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                    Confidence
                  </p>

                  <p
                    className={`mt-2 text-4xl font-semibold ${riskColor}`}
                  >
                    {
                      result.prediction
                        .confidence_percent
                    }
                    %
                  </p>

                </div>

              </div>

            </div>


            {/* Sensor action */}

            <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.035] p-7">

              <div className="flex items-center gap-3">

                <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/10 p-3">

                  <Gauge className="h-5 w-5 text-cyan-400" />

                </div>

                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                  Sensor action
                </p>

              </div>


              <p className="mt-6 text-4xl font-bold text-cyan-300">
                {
                  result.prediction
                    .recommended_sensitivity
                }
              </p>


              <p className="mt-2 text-sm leading-6 text-slate-500">
                Recommended sensor sensitivity
                for the current environmental
                conditions.
              </p>

            </div>

          </div>


          {/* ====================================
              MODEL EXPLANATION
          ==================================== */}

          {result.explanation && (

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">

              <div className="flex items-center gap-3">

                <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/10 p-3">

                  <ShieldAlert className="h-5 w-5 text-cyan-400" />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                    Model explanation
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-white">
                    Why VIGIL made this recommendation
                  </h3>

                </div>

              </div>


              {/* Summary */}

              <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.02] p-5">

                <p className="text-sm leading-7 text-slate-300">
                  {result.explanation.summary}
                </p>

              </div>


              {/* Factors */}

              {Array.isArray(
                result.explanation.factors
              ) &&
                result.explanation.factors.length >
                  0 && (

                  <div className="mt-5">

                    <p className="mb-3 text-xs uppercase tracking-[0.15em] text-slate-500">
                      Contributing factors
                    </p>

                    <div className="space-y-2">

                      {result.explanation.factors.map(
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

          )}


          {/* ====================================
              ENVIRONMENTAL STATE
          ==================================== */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">

            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Environmental state
            </p>


            <div className="mt-5 grid gap-4 md:grid-cols-3">

              <StateItem
                label="Storm condition"
                value={
                  result.weather.storm === 1
                    ? "Detected"
                    : "Not detected"
                }
                active={
                  result.weather.storm === 1
                }
              />


              <StateItem
                label="Rainfall"
                value={`${result.weather.rainfall_mm} mm`}
                active={
                  result.weather.rainfall_mm >
                  10
                }
              />


              <StateItem
                label="Wind"
                value={`${result.weather.wind_speed_kmh} km/h`}
                active={
                  result.weather.wind_speed_kmh >
                  40
                }
              />

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


// ============================================
// WEATHER CARD
// ============================================

function WeatherCard({
  label,
  value,
  unit,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold text-white">

            {value}

            <span className="ml-1 text-sm font-normal text-slate-500">
              {unit}
            </span>

          </p>

        </div>


        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-cyan-400">

          {icon}

        </div>

      </div>

    </div>
  );
}


// ============================================
// ENVIRONMENT STATE ITEM
// ============================================

function StateItem({
  label,
  value,
  active,
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4">

      <div>

        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-white">
          {value}
        </p>

      </div>


      <span
        className={`h-2.5 w-2.5 rounded-full ${
          active
            ? "bg-red-400"
            : "bg-emerald-400"
        }`}
      />

    </div>
  );
}


export default LiveMonitor;