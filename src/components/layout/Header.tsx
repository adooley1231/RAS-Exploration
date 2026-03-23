import { User, Crown, Settings, Briefcase, GitBranch } from 'lucide-react';
import { useRAS } from '../../context/RASContext';
import type { DemoScenario } from '../../types';

const scenarioLabels: Record<DemoScenario, string> = {
  regular: 'Regular Member',
  ultra: 'Ultra Member',
  'first-time': 'First-Time Member',
  'results-mix': 'Results (Mix)',
  'no-wins': 'Results (No Wins)',
};

export function Header() {
  const { state, setDemoScenario, setAppMode, reset } = useRAS();
  const { user, demoScenario, currentView, appMode } = state;

  return (
    <header className="bg-white sticky top-0 z-50" style={{ borderBottom: '1px solid var(--er-gray-200)' }}>
      {/* Mode toggle — above main header bar (progress steps render below Header in App) */}
      <div
        className="w-full"
        style={{
          borderBottom: '1px solid var(--er-gray-100)',
          background: 'var(--er-gray-50)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-2 flex justify-center">
          <div
            className="flex items-center gap-0.5 p-0.5 w-full max-w-md sm:max-w-none sm:w-auto justify-center overflow-x-auto"
            style={{
              background: 'var(--er-gray-100)',
              borderRadius: '10px',
            }}
          >
            <button
              type="button"
              onClick={() => setAppMode('member')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 transition-all whitespace-nowrap flex-1 sm:flex-initial justify-center"
              style={{
                borderRadius: '8px',
                fontFamily: 'var(--er-font-sans)',
                fontSize: '0.6875rem',
                fontWeight: appMode === 'member' ? 500 : 400,
                background: appMode === 'member' ? 'var(--er-white)' : 'transparent',
                color: appMode === 'member' ? 'var(--er-slate-800)' : 'var(--er-gray-500)',
                boxShadow: appMode === 'member' ? 'var(--er-shadow-xs)' : 'none',
              }}
            >
              <User className="w-3 h-3 flex-shrink-0" />
              Member
            </button>
            <button
              type="button"
              onClick={() => setAppMode('ambassador')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 transition-all whitespace-nowrap flex-1 sm:flex-initial justify-center"
              style={{
                borderRadius: '8px',
                fontFamily: 'var(--er-font-sans)',
                fontSize: '0.6875rem',
                fontWeight: appMode === 'ambassador' ? 500 : 400,
                background: appMode === 'ambassador' ? 'var(--er-slate-800)' : 'transparent',
                color: appMode === 'ambassador' ? '#fff' : 'var(--er-gray-500)',
                boxShadow: appMode === 'ambassador' ? 'var(--er-shadow-xs)' : 'none',
              }}
            >
              <Briefcase className="w-3 h-3 flex-shrink-0" />
              Ambassador
            </button>
            <button
              type="button"
              onClick={() => setAppMode('lottery-logic')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 transition-all whitespace-nowrap flex-1 sm:flex-initial justify-center"
              style={{
                borderRadius: '8px',
                fontFamily: 'var(--er-font-sans)',
                fontSize: '0.6875rem',
                fontWeight: appMode === 'lottery-logic' ? 500 : 400,
                background: appMode === 'lottery-logic' ? 'var(--er-white)' : 'transparent',
                color: appMode === 'lottery-logic' ? '#004750' : 'var(--er-gray-500)',
                boxShadow: appMode === 'lottery-logic' ? 'var(--er-shadow-xs)' : 'none',
                border: appMode === 'lottery-logic' ? '1px solid rgba(0, 71, 80, 0.2)' : '1px solid transparent',
              }}
            >
              <GitBranch className="w-3 h-3 flex-shrink-0" />
              <span className="hidden sm:inline">How it works</span>
              <span className="sm:hidden">Logic</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Brand lockup */}
          <div className="flex items-center gap-4">
            {/* Typographic mark — thin serif R in a quiet square frame */}
            <div
              className="w-8 h-8 flex items-center justify-center flex-shrink-0"
              style={{ border: '1px solid var(--er-gray-200)' }}
            >
              <span style={{
                fontFamily: 'var(--er-font-serif)',
                fontWeight: 300,
                fontSize: '1.125rem',
                color: 'var(--er-slate-700)',
                letterSpacing: '0.02em',
                lineHeight: 1,
              }}>
                R
              </span>
            </div>
            <div>
              <h1 style={{
                fontFamily: 'var(--er-font-serif)',
                fontWeight: 300,
                fontSize: '1.1875rem',
                letterSpacing: '-0.01em',
                color: 'var(--er-slate-800)',
                margin: 0,
                lineHeight: 1.2,
              }}>
                RAS Lottery
              </h1>
              <p className="label-caps mt-0.5" style={{ color: 'var(--er-gray-400)' }}>
                Q2 2025 · Vacation Requests
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1">


            {/* Member badge */}
            <div className="flex items-center gap-2 px-3 py-1.5">
              {user.memberType === 'ultra' ? (
                <Crown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-gold)' }} />
              ) : (
                <User className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--er-gray-400)' }} />
              )}
              <span className="label-caps" style={{ color: 'var(--er-slate-700)', letterSpacing: '0.08em' }}>
                {user.name}
              </span>
              {user.memberType === 'ultra' && (
                <span
                  className="label-caps px-1.5 py-0.5"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))',
                    color: '#fff',
                    letterSpacing: '0.1em',
                    borderRadius: '2px',
                    fontSize: '0.55rem',
                  }}
                >
                  Ultra
                </span>
              )}
            </div>

            {/* Settings */}
            <div className="relative group">
              <button
                className="p-2 rounded transition-colors hover:bg-gray-50"
                style={{ color: 'var(--er-gray-400)' }}
              >
                <Settings className="w-4 h-4" />
              </button>

              <div
                className="absolute right-0 top-full mt-2 w-52 bg-white border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                style={{
                  borderColor: 'var(--er-gray-200)',
                  boxShadow: 'var(--er-shadow-lg)',
                  borderRadius: 'var(--er-radius-md)',
                }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--er-gray-100)' }}>
                  <p className="label-caps" style={{ color: 'var(--er-gray-400)' }}>Demo Scenario</p>
                </div>
                <div className="p-1.5">
                  {(Object.keys(scenarioLabels) as DemoScenario[]).map((scenario) => (
                    <button
                      key={scenario}
                      onClick={() => setDemoScenario(scenario)}
                      className="w-full text-left px-3 py-2 transition-colors text-sm"
                      style={{
                        borderRadius: 'var(--er-radius-sm)',
                        color: demoScenario === scenario ? 'var(--color-gold-dark)' : 'var(--er-gray-700)',
                        background: demoScenario === scenario ? 'rgba(201,169,110,0.08)' : 'transparent',
                        fontFamily: 'var(--er-font-sans)',
                        fontWeight: demoScenario === scenario ? 500 : 400,
                      }}
                    >
                      {scenarioLabels[scenario]}
                    </button>
                  ))}
                </div>
                <div className="p-1.5" style={{ borderTop: '1px solid var(--er-gray-100)' }}>
                  <button
                    onClick={reset}
                    className="w-full text-left px-3 py-2 transition-colors text-sm"
                    style={{
                      borderRadius: 'var(--er-radius-sm)',
                      color: 'var(--er-base-destructive)',
                      fontFamily: 'var(--er-font-sans)',
                    }}
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </header>
  );
}
