import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useCampus } from '../hooks/useCampusData';

const sections = [
  { to: '/dashboard', label: 'Dashboard', icon: 'home' },
  { to: '/academics', label: 'Academics', icon: 'book' },
  { to: '/academics/timetable', label: 'Timetable', icon: 'calendar' },
  { to: '/academics/attendance', label: 'Attendance', icon: 'clipboard-check' },
  { to: '/academics/assignments', label: 'Assignments', icon: 'list-check' },
  { to: '/academics/exams', label: 'Exams', icon: 'file-text' },
  { to: '/campus-life', label: 'Campus Life', icon: 'map-pin' },
  { to: '/library', label: 'Library & Resources', icon: 'library' },
  { to: '/productivity', label: 'Productivity', icon: 'zap' },
  { to: '/quick-links', label: 'Quick Links', icon: 'link' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { data, setData } = useCampus();
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
    }
    // persist theme maybe later
  };

  return (
    <aside className={`bg-surface text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col`}>
      <div className="flex items-center justify-between p-4">
        {!collapsed && <span className="font-bold text-lg">CampusOS</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-primary/20 rounded">
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      <nav className="flex-1 space-y-1">
        {sections.map((sec) => (
          <NavLink
            key={sec.to}
            to={sec.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 hover:bg-primary/10 rounded transition-colors ${isActive ? 'bg-primary/20' : ''}`
            }
          >
            {/* Simple placeholder icons using lucide-react generic icons */}
            <span>{sec.icon}</span>
            {!collapsed && <span>{sec.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 flex items-center justify-between">
        <button onClick={toggleTheme} className="p-1 hover:bg-primary/20 rounded">
          {/* sun/moon icons */}
          <Sun size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

