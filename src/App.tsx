import { RASProvider, useRAS } from './context/RASContext';
import { Header } from './components/layout/Header';
import { ProgressIndicator } from './components/shared/ProgressIndicator';
import { BrowseOrSearch } from './components/BrowseOrSearch';
import { PointsAllocation } from './components/PointsAllocation';
import { ReviewSubmit } from './components/ReviewSubmit';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AmbassadorDashboard } from './components/AmbassadorDashboard/AmbassadorDashboard';
import { LotteryLogicOverview } from './components/LotteryLogic';
import { AnnotationCalloutModal } from './components/shared/AnnotationCalloutModal';
import './index.css';

function AppContent() {
  const { state, setView } = useRAS();
  const { currentView, requests, appMode } = state;

  const hideMemberProgress = appMode === 'ambassador' || appMode === 'lottery-logic';

  const handleStepClick = (step: typeof currentView) => {
    if (step === 'browse-or-search') {
      setView(step);
    } else if (step === 'allocate-points' && requests.length > 0) {
      setView(step);
    } else if (step === 'review' && requests.length > 0) {
      setView(step);
    }
  };

  const renderView = () => {
    if (appMode === 'ambassador') {
      return <AmbassadorDashboard />;
    }
    if (appMode === 'lottery-logic') {
      return <LotteryLogicOverview />;
    }
    switch (currentView) {
      case 'browse-or-search':
        return <BrowseOrSearch />;
      case 'allocate-points':
        return <PointsAllocation />;
      case 'review':
        return <ReviewSubmit />;
      case 'results':
        return <ResultsDashboard />;
      default:
        return <BrowseOrSearch />;
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {/* Progress indicator — member flow only */}
      {!hideMemberProgress && (
        <div className="bg-white" style={{ borderBottom: '1px solid var(--er-gray-100)' }}>
          <div className="max-w-6xl mx-auto px-6">
            <ProgressIndicator
              currentStep={currentView}
              onStepClick={handleStepClick}
              allowNavigation={currentView !== 'results'}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <main>{renderView()}</main>

      {/* President/presentation annotations (non-destructive) */}
      <AnnotationCalloutModal />

      {/* Footer */}
      <footer
        className="mt-auto py-8"
        style={{ borderTop: '1px solid var(--er-gray-200)', background: 'var(--er-white)' }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="label-caps" style={{ color: 'var(--er-gray-400)' }}>
            RAS Vacation Lottery Prototype — Q2 2025
          </p>
          <p className="mt-1" style={{ fontFamily: 'var(--er-font-sans)', fontSize: '0.75rem', color: 'var(--er-gray-300)' }}>
            Use the settings icon (top right) to switch between demo scenarios.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <RASProvider>
      <AppContent />
    </RASProvider>
  );
}

export default App;
