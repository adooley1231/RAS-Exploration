import { RASProvider, useRAS } from './context/RASContext';
import { Header } from './components/layout/Header';
import { ProgressIndicator } from './components/shared/ProgressIndicator';
import { BrowseOrSearch } from './components/BrowseOrSearch';
import { PointsAllocation } from './components/PointsAllocation';
import { ReviewSubmit } from './components/ReviewSubmit';
import { ResultsDashboard } from './components/ResultsDashboard';
import './index.css';

function AppContent() {
  const { state, setView } = useRAS();
  const { currentView, requests } = state;

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

      {/* Progress indicator */}
      <div className="bg-white border-b border-slate-100 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <ProgressIndicator
            currentStep={currentView}
            onStepClick={handleStepClick}
            allowNavigation={currentView !== 'results'}
          />
        </div>
      </div>

      {/* Main content */}
      <main>{renderView()}</main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-400">
          <p>RAS Vacation Lottery Prototype — Q2 2025</p>
          <p className="mt-1">
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
