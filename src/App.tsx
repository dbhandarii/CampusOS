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

const App: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Determine if profile exists
  useEffect(() => {
    const data = localStorage.getItem('campusOSData');
    if (data) {
      const parsed = JSON.parse(data);
      if (!parsed.profile?.name) {
        setShowOnboarding(true);
      }
    } else {
      setShowOnboarding(true);
    }
  }, []);

  return (
    <CampusProvider>
      <Router>
        <div className="flex h-full bg-background text-white">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-auto">
            <TopBar />
            <main className="p-4 overflow-auto">
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
              </Routes>
            </main>
          </div>
        </div>
        {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} />}
      </Router>
    </CampusProvider>
  );
};

export default App;

