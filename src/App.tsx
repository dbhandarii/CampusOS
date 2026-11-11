import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Academics from './pages/Academics';
import Timetable from './pages/Timetable';
import Attendance from './pages/Attendance';
import Assignments from './pages/Assignments';
import Exams from './pages/Exams';
import CampusLife from './pages/CampusLife';
import LibraryResources from './pages/LibraryResources';
import QuickLinks from './pages/QuickLinks';
import Productivity from './pages/Productivity';
import Settings from './pages/Settings';
import Onboarding from './components/Onboarding';
import { CampusProvider } from './hooks/useCampusData';
import { UIProvider } from './hooks/useUIState';

const AppContent: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('campusOS_onboarding_completed');
    if (!hasSeenOnboarding) {
      // First visit: show onboarding
      setShowOnboarding(true);
    }
  }, []);

  const handleFinishOnboarding = () => {
    localStorage.setItem('campusOS_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="flex h-screen w-screen bg-[#0a0a0f] text-slate-100 overflow-hidden font-sans antialiased">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/academics/timetable" element={<Timetable />} />
            <Route path="/academics/attendance" element={<Attendance />} />
            <Route path="/academics/assignments" element={<Assignments />} />
            <Route path="/academics/exams" element={<Exams />} />
            <Route path="/campus-life" element={<CampusLife />} />
            <Route path="/library" element={<LibraryResources />} />
            <Route path="/quick-links" element={<QuickLinks />} />
            <Route path="/productivity" element={<Productivity />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {showOnboarding && <Onboarding onClose={handleFinishOnboarding} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CampusProvider>
      <UIProvider>
        <Router>
          <AppContent />
        </Router>
      </UIProvider>
    </CampusProvider>
  );
};

export default App;
