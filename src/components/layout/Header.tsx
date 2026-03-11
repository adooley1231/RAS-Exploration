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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold text-navy">RAS Lottery</h1>
              <p className="text-xs text-slate-500">Q2 2025 Vacation Requests</p>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center gap-6">
            {/* Points preview on Add Requests: you have X points to distribute in next step */}
            {showPointsPreview && (
              <div className="hidden md:flex md:items-center md:gap-2 px-3 py-2 bg-gold/10 rounded-lg">
                <Coins className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="text-sm text-navy">
                  <strong className="tabular-nums">{memberPoints} points</strong>
                  <span className="text-navy-light font-normal"> to distribute in next step</span>
                </span>
              </div>
            )}
            {/* Points bank (when allocating or reviewing) */}
            {showPointsBank && (
              <div className="hidden md:block">
                <PointsBank user={user} requests={requests} variant="compact" />
              </div>
            )}

            {/* User badge */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full">
                {user.memberType === 'ultra' ? (
                  <Crown className="w-4 h-4 text-gold" />
                ) : (
                  <User className="w-4 h-4 text-slate-500" />
                )}
                <span className="text-sm font-medium text-navy">{user.name}</span>
                {user.memberType === 'ultra' && (
                  <span className="px-1.5 py-0.5 text-xs font-semibold gold-gradient text-white rounded">
                    ULTRA
                  </span>
                )}
              </div>
            </div>

            {/* Demo scenario selector */}
            <div className="relative group">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-slate-400" />
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Demo Scenario
                  </p>
                </div>
                <div className="p-2">
                  {(Object.keys(scenarioLabels) as DemoScenario[]).map((scenario) => (
                    <button
                      key={scenario}
                      onClick={() => setDemoScenario(scenario)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        demoScenario === scenario
                          ? 'bg-gold/10 text-gold-dark font-medium'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {scenarioLabels[scenario]}
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-100">
                  <button
                    onClick={reset}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-coral hover:bg-coral/5 transition-colors"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Points preview / bank + AR Tokens (mobile) */}
        <div className="md:hidden mt-4 space-y-3">
          {showPointsPreview && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gold/10 rounded-lg">
              <Coins className="w-4 h-4 text-gold flex-shrink-0" />
              <span className="text-sm text-navy">
                <strong className="tabular-nums">{memberPoints} points</strong>
                <span className="text-navy-light font-normal"> to distribute in next step</span>
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
