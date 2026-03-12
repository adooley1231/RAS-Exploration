import { User, Crown, Settings, Coins } from 'lucide-react';
import { useRAS } from '../../context/RASContext';
import { PointsBank } from '../shared/PointsBank';
import { getMemberPoints } from '../../utils/helpers';
import type { DemoScenario } from '../../types';

const scenarioLabels: Record<DemoScenario, string> = {
  regular: 'Regular Member',
  ultra: 'Ultra Member',
  'first-time': 'First-Time Member',
  'results-mix': 'Results (Mix)',
  'no-wins': 'Results (No Wins)',
};

export function Header() {
  const { state, setDemoScenario, reset } = useRAS();
  const { user, demoScenario, requests, currentView } = state;
  const showPointsBank =
    currentView === 'browse-or-search' || currentView === 'allocate-points' || currentView === 'review';
  const showPointsPreview = currentView === 'browse-or-search';
  const memberPoints = getMemberPoints(user);

  return (
    <header className="bg-white sticky top-0 z-50" style={{ borderBottom: '1px solid var(--er-gray-200)' }}>
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

            {/* Points preview — quiet status */}
            {showPointsPreview && (
              <div
                className="hidden md:flex items-center gap-2 px-4 py-1.5 mr-2"
                style={{ borderRight: '1px solid var(--er-gray-200)' }}
              >
                <Coins className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-gold)' }} />
                <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-base-foreground)' }}>
                  <strong className="tabular-nums" style={{ fontWeight: 500 }}>{memberPoints}</strong>
                  <span style={{ color: 'var(--er-gray-500)' }}> pts to allocate</span>
                </span>
              </div>
            )}

            {/* Points bank (allocate / review) */}
            {showPointsBank && (
              <div className="hidden md:block mr-2">
                <PointsBank user={user} requests={requests} variant="compact" />
              </div>
            )}

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

        {/* Mobile */}
        <div className="md:hidden mt-3 space-y-2">
          {showPointsPreview && (
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ background: 'rgba(201,169,110,0.07)', borderRadius: 'var(--er-radius-md)' }}
            >
              <Coins className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-gold)' }} />
              <span style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.8125rem', color: 'var(--er-base-foreground)' }}>
                <strong className="tabular-nums">{memberPoints}</strong>
                <span style={{ color: 'var(--er-gray-500)' }}> points to allocate</span>
              </span>
            </div>
          )}
          {showPointsBank && (
            <PointsBank user={user} requests={requests} variant="compact" />
          )}
        </div>
      </div>
    </header>
  );
}
