import { useEffect, useState } from 'react';
import { X, ThermometerSnowflake, ShieldCheck, Radar, BellRing } from 'lucide-react';

const iconByState = {
  normal: ShieldCheck,
  monitor: Radar,
  alert: ThermometerSnowflake
};

const inventoryTone = {
  ok: 'border-signal/20 bg-signal/10 text-signal',
  low: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
  missing: 'border-red-400/20 bg-red-400/10 text-red-100'
};

export default function PulseDrawer({ copy, open, onClose, task, telemetry, regulations, inventory, locale, onUpdateMilestone }) {
  const [milestone, setMilestone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMilestone(task?.milestone ?? '');
  }, [task]);

  const handleMilestoneSubmit = async (event) => {
    event.preventDefault();
    if (!task || !milestone.trim()) return;

    setSaving(true);
    try {
      await onUpdateMilestone(task, milestone.trim());
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside
      className={`fixed right-0 top-0 z-40 h-full w-full max-w-[420px] transform border-l border-white/10 bg-dusk/95 shadow-2xl transition-all duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      aria-hidden={!open}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sand-200/70">{copy.pulseDrawer}</p>
            <h2 className="mt-1 text-lg font-semibold text-white">{task ? task.carrier : copy.everythingRollup}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/5 p-2 text-sand-100 hover:bg-white/10" aria-label="Close details">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {task ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-sand-200/70">{copy.summary}</p>
                <p className="mt-2 text-sand-100">{task.localizedSummary ?? task.summary?.[locale] ?? task.summary?.en}</p>
              </div>
              <form className="rounded-2xl border border-ember/20 bg-ember/10 p-4" onSubmit={handleMilestoneSubmit}>
                <p className="text-xs uppercase tracking-[0.25em] text-sand-200/70">Milestone alert</p>
                <input
                  className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-white outline-none placeholder:text-sand-200/40"
                  value={milestone}
                  onChange={(event) => setMilestone(event.target.value)}
                  placeholder={copy.milestone}
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ember px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <BellRing className="h-4 w-4" />
                  {saving ? 'Notifying...' : 'Update milestone and notify'}
                </button>
              </form>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-sand-200/70">{copy.subtasks}</p>
                <ul className="mt-3 space-y-2 text-sm text-sand-100">
                  {task.subtasks?.map((subtask) => (
                    <li key={subtask.id} className="rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2">
                      {subtask.label?.[locale] ?? subtask.label?.en}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          <div className="mt-5 space-y-4">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-sand-200/70">{copy.telemetry}</p>
              <div className="mt-3 space-y-3">
                {telemetry.map((record) => {
                  const Icon = iconByState[record.risk] ?? ShieldCheck;
                  return (
                    <article key={record.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">{record.asset}</p>
                          <p className="text-xs uppercase tracking-[0.2em] text-sand-200/70">Job {record.jobCode ?? record.vinSuffix}</p>
                        </div>
                        <Icon className="h-5 w-5 text-ember" />
                      </div>
                      <p className="mt-2 text-sm text-sand-100">{record.location}</p>
                      <p className="mt-1 text-xs text-sand-200/70">
                        Progress {record.progressPct ?? record.speedMph}% | Materials {record.materialsReadyPct ?? record.fuelPct}% | {record.nextCheck ?? 'Next check pending'}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.25em] text-sand-200/70">{copy.inventory}</p>
                <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-xs text-amber-100">
                  {inventory.filter((item) => item.status !== 'ok').length} {copy.inventoryLow}
                </span>
              </div>
              <div className="mt-3 space-y-3">
                {inventory.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{item.name?.[locale] ?? item.name?.en}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-sand-200/70">{item.location} | Job {item.linkedJob}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-1 text-xs uppercase ${inventoryTone[item.status] ?? inventoryTone.ok}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-sand-100">
                      Have {item.onHand} {item.unit} | Need {item.needed} {item.unit}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-sand-200/70">{copy.regulations}</p>
              <div className="mt-3 space-y-3">
                {regulations.map((track) => (
                  <article key={track.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-3">
                    <p className="font-medium text-white">{track.code}</p>
                    <p className="text-sm text-sand-100">{track.title?.[locale] ?? track.title?.en}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-sand-200/70">{track.status}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </aside>
  );
}
