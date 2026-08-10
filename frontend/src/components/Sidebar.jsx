import {
  LayoutDashboard,
  Radio,
  History,
  BarChart3,
  SlidersHorizontal,
  Info,
  ShieldCheck,
} from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
  const navigation = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "live",
      label: "Live Monitor",
      icon: Radio,
    },
    {
      id: "history",
      label: "Prediction History",
      icon: History,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      id: "simulator",
      label: "Scenario Simulator",
      icon: SlidersHorizontal,
    },
    {
      id: "about",
      label: "About VIGIL",
      icon: Info,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-white/10 bg-[#081321]/95 px-5 py-6 backdrop-blur-xl">

      {/* Brand */}
      <div className="mb-10 flex items-center gap-3 px-2">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
          <ShieldCheck className="h-6 w-6 text-cyan-400" />
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-[0.18em] text-white">
            VIGIL
          </h1>

          <p className="text-[10px] tracking-[0.25em] text-slate-500">
            PIDS
          </p>
        </div>

      </div>

      {/* System status */}
      <div className="mb-8 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 px-4 py-3">

        <div className="flex items-center gap-2">

          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>

          <span className="text-xs font-medium text-emerald-400">
            SYSTEM ONLINE
          </span>

        </div>

        <p className="mt-2 text-[11px] text-slate-500">
          Predictive intelligence active
        </p>

      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          Workspace
        </p>

        {navigation.map((item) => {

          const Icon = item.icon;

          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-all duration-200 ${
                isActive
                  ? "border border-cyan-400/15 bg-cyan-400/10 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.05)]"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >

              <Icon
                className={`h-[18px] w-[18px] ${
                  isActive
                    ? "text-cyan-400"
                    : "text-slate-500 group-hover:text-slate-300"
                }`}
              />

              <span>{item.label}</span>

              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />
              )}

            </button>
          );
        })}

      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 pt-5">

        <div className="px-3">

          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
            VIGIL PIDS
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Predictive Sensor Intelligence
          </p>

          <p className="mt-3 text-[10px] text-slate-700">
            v1.0.0
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;