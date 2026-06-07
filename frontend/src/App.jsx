import { useEffect, useMemo, useState } from 'react';
import TopBar from './components/TopBar.jsx';
import EverythingRollup from './components/EverythingRollup.jsx';
import OperationalGrid from './components/OperationalGrid.jsx';
import VisualBoard from './components/VisualBoard.jsx';
import PulseDrawer from './components/PulseDrawer.jsx';
import { api } from './lib/api.js';
import { dashboardModes, defaultFilters, localeCopy } from './data/dashboardSeed.js';

const initialState = {
  tasks: [],
  telemetry: [],
  regulations: [],
  inventory: []
};

const getInitialLocale = () => {
  const saved = localStorage.getItem('desertsky.locale');
  if (saved === 'es') return 'es';
  return import.meta.env.VITE_DEFAULT_LOCALE === 'es' ? 'es' : 'en';
};

export default function App() {
  const [locale, setLocale] = useState(getInitialLocale);
  const [state, setState] = useState(initialState);
  const [selectedTask, setSelectedTask] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mode, setMode] = useState(dashboardModes.board);
  const [filters, setFilters] = useState(defaultFilters);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const copy = localeCopy[locale];

  useEffect(() => {
    localStorage.setItem('desertsky.locale', locale);
  }, [locale]);

  useEffect(() => {
    let cancelled = false;

    api.getDashboard(locale)
      .then((payload) => {
        if (cancelled) return;
        setState({
          tasks: payload.tasks,
          telemetry: payload.telemetry,
          regulations: payload.regulations,
          inventory: payload.inventory ?? []
        });
        setSelectedTask((current) => current ?? payload.tasks[0] ?? null);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const activeTasks = useMemo(() => state.tasks, [state.tasks]);

  const createTask = async (payload) => {
    const response = await api.createTask(payload);
    const createdTask = response.task;

    setState((current) => ({
      ...current,
      tasks: [createdTask, ...current.tasks]
    }));
    setSelectedTask(createdTask);

    await api.sendNotification({
      locale,
      taskId: createdTask.id,
      recipient: '+14428882240'
    });
  };

  const updateMilestone = async (task, milestone) => {
    const response = await api.updateMilestone(task.id, {
      locale,
      milestone,
      notifyOwner: true
    });
    const updatedTask = response.task;

    setState((current) => ({
      ...current,
      tasks: current.tasks.map((currentTask) => (currentTask.id === updatedTask.id ? updatedTask : currentTask))
    }));
    setSelectedTask(updatedTask);
  };

  return (
    <div className="min-h-screen bg-desert-grid text-white">
      <TopBar
        locale={locale}
        copy={copy}
        onLocaleChange={setLocale}
        onTogglePulse={() => setDrawerOpen((current) => !current)}
        onToggleSidebar={() => setSidebarOpen((current) => !current)}
      />

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5">
          <EverythingRollup copy={copy} state={state} locale={locale} />
          <OperationalGrid
            copy={copy}
            tasks={activeTasks}
            onSelectTask={setSelectedTask}
            onCreateTask={createTask}
            locale={locale}
            filters={filters}
            onFiltersChange={setFilters}
          />
          <VisualBoard copy={copy} tasks={activeTasks} mode={mode} onModeChange={setMode} />
        </div>

        <div className={`xl:static ${sidebarOpen ? 'block' : 'hidden xl:block'}`}>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow">
            <p className="text-xs uppercase tracking-[0.3em] text-sand-200/70">{copy.liveAlerts}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Owner alert queue</h2>
            <div className="mt-4 space-y-3">
              {state.tasks.slice(0, 3).map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => {
                    setSelectedTask(task);
                    setDrawerOpen(true);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-left transition hover:bg-white/10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-white">{task.localizedTitle ?? task.title?.[locale] ?? task.title?.en}</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-sand-200/70">{copy.statusLabels[task.status] ?? task.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-sand-100">{task.localizedSummary ?? task.summary?.[locale] ?? task.summary?.en}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <PulseDrawer
        copy={copy}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        task={selectedTask}
        telemetry={state.telemetry}
        regulations={state.regulations}
        inventory={state.inventory}
        locale={locale}
        onUpdateMilestone={updateMilestone}
      />
    </div>
  );
}
