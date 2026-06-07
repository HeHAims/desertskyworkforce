import { AlertTriangle, Boxes, Clock3, ClipboardList, BellRing } from 'lucide-react';

const metricCards = [
  {
    key: 'tasks',
    icon: ClipboardList,
    tone: 'from-ember/20 to-ember/5',
    border: 'border-ember/20'
  },
  {
    key: 'telemetry',
    icon: Clock3,
    tone: 'from-signal/20 to-signal/5',
    border: 'border-signal/20'
  },
  {
    key: 'inventory',
    icon: Boxes,
    tone: 'from-white/10 to-white/5',
    border: 'border-white/10'
  },
  {
    key: 'alerts',
    icon: AlertTriangle,
    tone: 'from-orange-500/20 to-orange-500/5',
    border: 'border-orange-500/20'
  }
];

const countHighPriority = (tasks) => tasks.filter((task) => task.priority === 'critical' || task.priority === 'high').length;
const countInventoryGaps = (inventory) => inventory.filter((item) => item.status !== 'ok').length;

export default function EverythingRollup({ copy, state, locale }) {
  const stats = {
    tasks: state.tasks.length,
    telemetry: state.telemetry.length,
    inventory: countInventoryGaps(state.inventory ?? []),
    alerts: countHighPriority(state.tasks)
  };
  const labels = {
    tasks: copy.allTasks,
    telemetry: copy.telemetry,
    inventory: copy.inventory,
    alerts: copy.liveAlerts
  };

  return (
    <section className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sand-200/70">{copy.everythingRollup}</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Production and milestone control</h2>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-sand-100">
            {locale.toUpperCase()}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.key} className={`rounded-2xl border ${card.border} bg-gradient-to-br ${card.tone} p-4`}>
                <div className="flex items-center justify-between text-sand-50">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs uppercase tracking-[0.25em] text-sand-200/70">{labels[card.key]}</span>
                </div>
                <p className="mt-4 text-3xl font-semibold text-white">{stats[card.key]}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/35 p-6 shadow-glow">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ember/15 text-ember">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sand-200/70">{copy.liveAlerts}</p>
            <h3 className="text-lg font-semibold text-white">Milestone pulse</h3>
          </div>
        </div>

        <div className="space-y-3 text-sm text-sand-100">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <span>Commercial booths</span>
            <span className="text-signal">Fabric approval</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <span>Custom banquette</span>
            <span className="text-ember">Decision needed</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <span>{copy.inventory}</span>
            <span className="text-ember">{stats.inventory} low/missing</span>
          </div>
        </div>
      </div>
    </section>
  );
}
