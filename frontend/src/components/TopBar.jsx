import { Globe2, MapPinned, Signal, Menu } from 'lucide-react';

export default function TopBar({ locale, copy, onLocaleChange, onTogglePulse, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-dusk/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/90 transition hover:bg-white/10 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-ember to-signal text-sm font-black text-dusk shadow-glow">
            DS
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-sand-200/70">{copy.appName}</p>
            <h1 className="text-lg font-semibold text-white sm:text-xl">{copy.tagline}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-sand-100 md:flex">
            <Signal className="h-4 w-4 text-signal" />
            <span>Live</span>
          </div>
          <button
            type="button"
            onClick={onTogglePulse}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
          >
            <MapPinned className="h-4 w-4 text-ember" />
            {copy.openPulse}
          </button>
          <div className="inline-flex overflow-hidden rounded-full border border-white/10 bg-white/5">
            {['en', 'es'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onLocaleChange(value)}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition ${
                  locale === value ? 'bg-ember text-white' : 'text-sand-100 hover:bg-white/10'
                }`}
              >
                <Globe2 className="h-4 w-4" />
                {value.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
