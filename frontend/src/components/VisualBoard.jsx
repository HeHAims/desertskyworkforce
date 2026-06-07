import { LayoutGrid, TimerReset } from 'lucide-react';
import TimelineSvg from './TimelineSvg.jsx';

export default function VisualBoard({ copy, tasks, mode, onModeChange }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sand-200/70">{copy.visualBoard}</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Milestone workflow views</h2>
        </div>

        <div className="inline-flex overflow-hidden rounded-full border border-white/10 bg-slate-950/35">
          <button
            type="button"
            onClick={() => onModeChange('board')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm transition ${mode === 'board' ? 'bg-ember text-white' : 'text-sand-100 hover:bg-white/10'}`}
          >
            <LayoutGrid className="h-4 w-4" />
            {copy.board}
          </button>
          <button
            type="button"
            onClick={() => onModeChange('timeline')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm transition ${mode === 'timeline' ? 'bg-signal text-white' : 'text-sand-100 hover:bg-white/10'}`}
          >
            <TimerReset className="h-4 w-4" />
            {copy.timeline}
          </button>
        </div>
      </div>

      {mode === 'board' ? (
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {['scheduled', 'in-progress', 'blocked'].map((lane) => (
            <div key={lane} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-sand-200/70">{copy.statusLabels[lane]}</p>
              <div className="mt-4 space-y-3">
                {tasks.filter((task) => task.status === lane).map((task) => (
                  <article key={task.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-medium text-white">{task.carrier}</p>
                    <p className="mt-2 text-sm text-sand-100">{task.localizedTitle ?? task.title?.en}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-sand-200/70">{task.milestone}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/30 p-4">
          <TimelineSvg tasks={tasks} />
        </div>
      )}
    </section>
  );
}
