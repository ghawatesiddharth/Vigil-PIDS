import { useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  RefreshCw,
  ShieldAlert,
  Gauge,
  Activity,
  Clock3,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getAnalytics } from "../services/api";


function Analytics() {

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(null);


  // ============================================
  // LOAD ANALYTICS
  // ============================================

  async function loadAnalytics(
    showRefresh = false
  ) {

    try {

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response =
        await getAnalytics();

      setData(response);

    } catch (err) {

      console.error(
        "Analytics error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Unable to load analytics."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  }


  useEffect(() => {
    loadAnalytics();
  }, []);


  // ============================================
  // RISK DATA
  // ============================================

  const riskData = useMemo(() => {

    if (!data) {
      return [];
    }

    return [
      {
        name: "Low Risk",
        key: "LOW_RISK",
        count:
          data.risk_distribution?.LOW_RISK ||
          0,
        percentage:
          data.risk_percentages?.LOW_RISK ||
          0,
      },

      {
        name: "Medium Risk",
        key: "MEDIUM_RISK",
        count:
          data.risk_distribution?.MEDIUM_RISK ||
          0,
        percentage:
          data.risk_percentages?.MEDIUM_RISK ||
          0,
      },

      {
        name: "High Risk",
        key: "HIGH_RISK",
        count:
          data.risk_distribution?.HIGH_RISK ||
          0,
        percentage:
          data.risk_percentages?.HIGH_RISK ||
          0,
      },
    ];

  }, [data]);


  // ============================================
  // TIMELINE DATA
  // ============================================

  const timelineData = useMemo(() => {

    if (!data?.timeline) {
      return [];
    }

    return data.timeline.map(
      (item, index) => ({

        index: index + 1,

        time: new Date(
          item.timestamp
        ).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),

        confidence:
          Number(
            item.confidence_percent
          ),

        risk:
          item.risk_level,

      })
    );

  }, [data]);


  // ============================================
  // RISK COUNTS
  // ============================================

  const lowRisk =
    data?.risk_distribution?.LOW_RISK || 0;

  const mediumRisk =
    data?.risk_distribution?.MEDIUM_RISK || 0;

  const highRisk =
    data?.risk_distribution?.HIGH_RISK || 0;


  // ============================================
  // AVERAGE CONFIDENCE
  // ============================================

  const averageConfidence =
    Number(
      data?.average_confidence_percent || 0
    ).toFixed(2);


  // ============================================
  // LATEST PREDICTION
  // ============================================

  const latest =
    data?.latest_prediction;


  // ============================================
  // RISK COLORS
  // ============================================

  const chartColors = [
    "#34d399",
    "#fbbf24",
    "#f87171",
  ];


  // ============================================
  // FORMAT RISK
  // ============================================

  function formatRisk(risk) {

    return String(risk || "")
      .replace("_RISK", "")
      .replace("_", " ");

  }


  // ============================================
  // RISK COLOR
  // ============================================

  function getRiskTextColor(risk) {

    if (risk === "HIGH_RISK") {
      return "text-red-400";
    }

    if (risk === "MEDIUM_RISK") {
      return "text-amber-400";
    }

    return "text-emerald-400";

  }


  // ============================================
  // LOADING
  // ============================================

  if (loading) {

    return (

      <div className="flex min-h-[500px] items-center justify-center">

        <div className="text-center">

          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-cyan-400" />

          <p className="mt-4 text-sm text-slate-500">
            Loading analytics...
          </p>

        </div>

      </div>

    );

  }


  // ============================================
  // ERROR
  // ============================================

  if (error) {

    return (

      <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-8">

        <div className="flex items-start gap-3">

          <AlertTriangle className="h-5 w-5 text-red-400" />

          <div>

            <h2 className="font-semibold text-red-300">
              Analytics unavailable
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>


            <button
              onClick={() =>
                loadAnalytics()
              }
              className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:text-white"
            >
              Try again
            </button>

          </div>

        </div>

      </div>

    );

  }


  return (

    <div className="space-y-6">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">

        <div>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-cyan-400" />

            <span className="text-xs uppercase tracking-[0.2em] text-cyan-400">
              System analytics
            </span>

          </div>


          <h1 className="mt-3 text-3xl font-semibold text-white">
            VIGIL Analytics
          </h1>


          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor prediction volume, risk distribution,
            model confidence and recent system activity.
          </p>

        </div>


        <button
          onClick={() =>
            loadAnalytics(true)
          }
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-300 transition hover:border-cyan-400/20 hover:text-white disabled:opacity-50"
        >

          <RefreshCw
            className={`h-4 w-4 ${
              refreshing
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh

        </button>

      </div>


      {/* ========================================
          KPI CARDS
      ======================================== */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          label="Total predictions"
          value={
            data?.total_predictions || 0
          }
          icon={
            <Activity className="h-5 w-5" />
          }
        />


        <MetricCard
          label="Average confidence"
          value={`${averageConfidence}%`}
          icon={
            <Gauge className="h-5 w-5" />
          }
        />


        <MetricCard
          label="Low risk"
          value={lowRisk}
          icon={
            <CheckCircle2 className="h-5 w-5" />
          }
        />


        <MetricCard
          label="High risk"
          value={highRisk}
          icon={
            <ShieldAlert className="h-5 w-5" />
          }
        />

      </div>


      {/* ========================================
          RISK OVERVIEW
      ======================================== */}

      <div className="grid gap-6 lg:grid-cols-5">

        {/* Risk distribution */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7 lg:col-span-3">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.18em] text-slate-600">
                Risk distribution
              </p>

              <h2 className="mt-2 text-lg font-semibold text-white">
                Environmental risk breakdown
              </h2>

            </div>

            <BarChart3 className="h-5 w-5 text-cyan-400" />

          </div>


          <div className="mt-7 h-[280px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={riskData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background:
                      "#07111f",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                    borderRadius:
                      "12px",
                    color: "#fff",
                  }}
                  formatter={(
                    value
                  ) => [
                    value,
                    "Predictions",
                  ]}
                />

                <Bar
                  dataKey="count"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                >

                  {riskData.map(
                    (_, index) => (

                      <Cell
                        key={index}
                        fill={
                          chartColors[index]
                        }
                      />

                    )
                  )}

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* Risk percentages */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7 lg:col-span-2">

          <p className="text-xs uppercase tracking-[0.18em] text-slate-600">
            Risk composition
          </p>


          <h2 className="mt-2 text-lg font-semibold text-white">
            Current system state
          </h2>


          <div className="mt-6 h-[190px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={riskData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >

                  {riskData.map(
                    (_, index) => (

                      <Cell
                        key={index}
                        fill={
                          chartColors[index]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip
                  contentStyle={{
                    background:
                      "#07111f",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                    borderRadius:
                      "12px",
                    color: "#fff",
                  }}
                />

              </PieChart>

            </ResponsiveContainer>

          </div>


          <div className="space-y-3">

            {riskData.map(
              (item, index) => (

                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >

                  <div className="flex items-center gap-2">

                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          chartColors[index],
                      }}
                    />

                    <span className="text-sm text-slate-400">
                      {item.name}
                    </span>

                  </div>


                  <div className="text-right">

                    <span className="text-sm font-semibold text-white">
                      {item.count}
                    </span>

                    <span className="ml-2 text-xs text-slate-600">
                      {item.percentage}%
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>


      {/* ========================================
          CONFIDENCE TIMELINE
      ======================================== */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.18em] text-slate-600">
              Model confidence
            </p>

            <h2 className="mt-2 text-lg font-semibold text-white">
              Prediction confidence timeline
            </h2>

          </div>


          <TrendingUp className="h-5 w-5 text-cyan-400" />

        </div>


        <div className="mt-7 h-[300px]">

          {timelineData.length === 0 ? (

            <div className="flex h-full items-center justify-center text-sm text-slate-600">
              No timeline data available.
            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={timelineData}
                margin={{
                  top: 10,
                  right: 15,
                  left: -20,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis
                  dataKey="index"
                  tick={{
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[
                    "dataMin - 1",
                    "dataMax + 1",
                  ]}
                  tick={{
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background:
                      "#07111f",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                    borderRadius:
                      "12px",
                    color: "#fff",
                  }}
                  formatter={(
                    value
                  ) => [
                    `${value}%`,
                    "Confidence",
                  ]}
                  labelFormatter={(
                    label
                  ) =>
                    `Prediction #${label}`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="confidence"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  dot={{
                    r: 3,
                    fill: "#22d3ee",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          )}

        </div>

      </div>


      {/* ========================================
          LATEST PREDICTION
      ======================================== */}

      {latest && (

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Latest status */}

          <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.035] p-7 lg:col-span-2">

            <div className="flex items-center gap-3">

              <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/10 p-3">

                <Clock3 className="h-5 w-5 text-cyan-400" />

              </div>

              <div>

                <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                  Latest prediction
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                  Most recent VIGIL assessment
                </h2>

              </div>

            </div>


            <div className="mt-6 grid gap-5 md:grid-cols-3">

              <div>

                <p className="text-xs text-slate-600">
                  Risk
                </p>

                <p
                  className={`mt-2 text-xl font-bold ${getRiskTextColor(
                    latest.risk_level
                  )}`}
                >
                  {formatRisk(
                    latest.risk_level
                  )}
                </p>

              </div>


              <div>

                <p className="text-xs text-slate-600">
                  Confidence
                </p>

                <p className="mt-2 text-xl font-bold text-white">
                  {
                    latest.confidence_percent
                  }
                  %
                </p>

              </div>


              <div>

                <p className="text-xs text-slate-600">
                  Sensitivity
                </p>

                <p className="mt-2 text-xl font-bold text-cyan-300">
                  {
                    latest.recommended_sensitivity
                  }
                </p>

              </div>

            </div>

          </div>


          {/* Location */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">

            <div className="flex items-center gap-3">

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">

                <MapPin className="h-5 w-5 text-cyan-400" />

              </div>

              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Latest location
              </p>

            </div>


            <p className="mt-6 text-2xl font-semibold text-white">
              {Number(
                latest.location.latitude
              ).toFixed(4)}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Latitude
            </p>


            <p className="mt-4 text-2xl font-semibold text-white">
              {Number(
                latest.location.longitude
              ).toFixed(4)}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Longitude
            </p>

          </div>

        </div>

      )}


      {/* ========================================
          SYSTEM INSIGHT
      ======================================== */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

        <div className="flex items-start gap-3">

          <Activity className="mt-0.5 h-5 w-5 text-cyan-400" />

          <div>

            <p className="text-sm font-medium text-white">
              Current system insight
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">

              VIGIL has processed{" "}
              <span className="text-slate-300">
                {data?.total_predictions || 0}
              </span>{" "}
              predictions with an average model
              confidence of{" "}
              <span className="text-cyan-300">
                {averageConfidence}%
              </span>
              .

              {highRisk === 0 && (
                <>
                  {" "}
                  No high-risk predictions are currently
                  recorded in the database.
                </>
              )}

            </p>

          </div>

        </div>

      </div>

    </div>

  );
}


// ============================================
// METRIC CARD
// ============================================

function MetricCard({
  label,
  value,
  icon,
}) {

  return (

    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

      <div className="flex items-center justify-between">

        <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
          {label}
        </p>

        <span className="text-cyan-400">
          {icon}
        </span>

      </div>


      <p className="mt-4 text-2xl font-semibold text-white">
        {value}
      </p>

    </div>

  );

}


export default Analytics;