import {
  MapPin,
  Activity,
  Clock3,
} from "lucide-react";

function Topbar({ activePage }) {

  const pageTitles = {
    overview: "Overview",
    live: "Live Monitor",
    history: "Prediction History",
    analytics: "Analytics",
    simulator: "Scenario Simulator",
    about: "About VIGIL",
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#07111f]/80 px-8 backdrop-blur-xl">

      {/* Page title */}
      <div>

        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-600">
          VIGIL PIDS / Workspace
        </p>

        <h2 className="mt-1 text-xl font-semibold text-white">
          {pageTitles[activePage]}
        </h2>

      </div>

      {/* Status */}
      <div className="flex items-center gap-4">

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-400 md:flex">

          <MapPin className="h-3.5 w-3.5 text-cyan-400" />

          <span>
            Pune, India
          </span>

        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-4 py-2 text-xs text-emerald-400">

          <Activity className="h-3.5 w-3.5" />

          <span>
            API Connected
          </span>

        </div>

        <div className="hidden items-center gap-2 text-xs text-slate-500 lg:flex">

          <Clock3 className="h-3.5 w-3.5" />

          <span>
            Live
          </span>

        </div>

      </div>

    </header>
  );
}

export default Topbar;