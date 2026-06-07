import { ChevronDown, ChevronUp, PlusCircle, SlidersHorizontal, Send } from 'lucide-react';
import { useMemo, useState } from 'react';

const pillClassByStatus = {
  scheduled: 'bg-amber-500/20 text-amber-200 border-amber-500/20',
  'in-progress': 'bg-signal/20 text-signal border-signal/20',
  blocked: 'bg-red-500/20 text-red-200 border-red-500/20',
  complete: 'bg-white/10 text-sand-100 border-white/10'
};

const pillClassByPriority = {
  critical: 'bg-red-500/20 text-red-100 border-red-500/20',
  high: 'bg-orange-500/20 text-orange-100 border-orange-500/20',
  medium: 'bg-sand-100/20 text-sand-50 border-white/10',
  low: 'bg-white/10 text-sand-100 border-white/10'
};

const defaultForm = {
  titleEn: '',
  titleEs: '',
  summaryEn: '',
  summaryEs: '',
  carrier: '',
  route: '',
  milestone: '',
  priority: 'medium',
  status: 'scheduled'
};

export default function OperationalGrid({ copy, tasks, onSelectTask, onCreateTask, locale, filters, onFiltersChange }) {
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const carriers = useMemo(() => ['all', ...new Set(tasks.map((task) => task.carrier))], [tasks]);

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filters.status === 'all' || task.status === filters.status;
    const carrierMatch = filters.carrier === 'all' || task.carrier === filters.carrier;
    return statusMatch && carrierMatch;
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onCreateTask({
      locale,
      title: {
        en: form.titleEn,
        es: form.titleEs || form.titleEn
      },
      summary: {
        en: form.summaryEn,
        es: form.summaryEs || form.summaryEn
      },
      carrier: form.carrier,
      route: form.route,
      milestone: form.milestone,
      priority: form.priority,
      status: form.status,
      subtasks: []
    });
    setForm(defaultForm);
  };

  return (
    <section className="grid gap-5 xl:grid-cols-[1.6fr_0.9fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sand-200/70">{copy.highDensity}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Customer job matrix</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <select
              value={filters.status}
              onChange={(event) => onFiltersChange((current) => ({ ...current, status: event.target.value }))}
              className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sand-100 outline-none"
            >
              <option value="all">{copy.allTasks}</option>
              {Object.entries(copy.statusLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <select
              value={filters.carrier}
              onChange={(event) => onFiltersChange((current) => ({ ...current, carrier: event.target.value }))}
              className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sand-100 outline-none"
            >
              {carriers.map((carrier) => (
                <option key={carrier} value={carrier}>{carrier === 'all' ? copy.filter : carrier}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-[1.2fr_0.8fr_0.7fr_0.9fr_0.9fr_0.5fr] gap-2 border-b border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-sand-200/70">
            <span>{copy.carrier}</span>
            <span>{copy.route}</span>
            <span>{copy.status}</span>
            <span>{copy.priority}</span>
            <span>{copy.milestone}</span>
            <span className="text-right">+</span>
          </div>

          <div className="divide-y divide-white/10">
            {filteredTasks.map((task) => {
              const isExpanded = expanded === task.id;
              return (
                <div key={task.id} className="bg-slate-950/25">
                  <button
                    type="button"
                    className="grid w-full grid-cols-[1.2fr_0.8fr_0.7fr_0.9fr_0.9fr_0.5fr] gap-2 px-4 py-4 text-left transition hover:bg-white/5"
                    onClick={() => {
                      setExpanded(isExpanded ? null : task.id);
                      onSelectTask(task);
                    }}
                  >
                    <span className="font-medium text-white">{task.carrier}</span>
                    <span className="text-sand-100">{task.route}</span>
                    <span>
                      <span className={`rounded-full border px-2 py-1 text-xs ${pillClassByStatus[task.status] ?? 'bg-white/10 text-sand-100 border-white/10'}`}>
                        {copy.statusLabels[task.status] ?? task.status}
                      </span>
                    </span>
                    <span>
                      <span className={`rounded-full border px-2 py-1 text-xs ${pillClassByPriority[task.priority] ?? 'bg-white/10 text-sand-100 border-white/10'}`}>
                        {task.priority}
                      </span>
                    </span>
                    <span className="text-sand-100">{task.milestone}</span>
                    <span className="flex items-center justify-end text-white/80">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  </button>

                  {isExpanded ? (
                    <div className="grid gap-3 border-t border-white/10 px-4 py-4 md:grid-cols-[1fr_0.9fr]">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-sand-200/70">{copy.summary}</p>
                        <p className="mt-2 text-sm leading-6 text-sand-100">{task.localizedSummary ?? task.summary?.[locale] ?? task.summary?.en}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-sand-200/70">{copy.subtasks}</p>
                        <ul className="mt-2 space-y-2 text-sm text-sand-100">
                          {task.subtasks?.map((subtask) => (
                            <li key={subtask.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                              <span>{subtask.label?.[locale] ?? subtask.label?.en}</span>
                              <span className={subtask.done ? 'text-signal' : 'text-amber-200'}>{subtask.done ? 'OK' : 'Open'}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="rounded-3xl border border-white/10 bg-slate-950/30 p-5 shadow-glow">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-signal/15 text-signal">
            <PlusCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sand-200/70">{copy.newTask}</p>
            <h3 className="text-lg font-semibold text-white">{copy.addTask}</h3>
          </div>
        </div>

        <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-sand-200/40" placeholder="Title EN" value={form.titleEn} onChange={(event) => setForm({ ...form, titleEn: event.target.value })} required />
            <input className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-sand-200/40" placeholder="Title ES" value={form.titleEs} onChange={(event) => setForm({ ...form, titleEs: event.target.value })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <textarea className="min-h-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-sand-200/40" placeholder="Summary EN" value={form.summaryEn} onChange={(event) => setForm({ ...form, summaryEn: event.target.value })} required />
            <textarea className="min-h-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-sand-200/40" placeholder="Summary ES" value={form.summaryEs} onChange={(event) => setForm({ ...form, summaryEs: event.target.value })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-sand-200/40" placeholder={copy.carrier} value={form.carrier} onChange={(event) => setForm({ ...form, carrier: event.target.value })} />
            <input className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-sand-200/40" placeholder={copy.route} value={form.route} onChange={(event) => setForm({ ...form, route: event.target.value })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-sand-200/40" placeholder={copy.milestone} value={form.milestone} onChange={(event) => setForm({ ...form, milestone: event.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
                {['critical', 'high', 'medium', 'low'].map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
              <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                {Object.keys(copy.statusLabels).map((status) => (
                  <option key={status} value={status}>{copy.statusLabels[status]}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ember to-signal px-4 py-3 font-semibold text-white transition hover:opacity-95">
            <Send className="h-4 w-4" />
            {copy.sendSms}
          </button>
        </form>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-sand-100">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-ember" /> {copy.filter}</span>
            <span>{filteredTasks.length} rows</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
