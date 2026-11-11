import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Calendar,
  CheckCircle,
  FileCheck,
  FileText,
  Compass,
  Library,
  Zap,
  ExternalLink,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useCampus } from '../hooks/useCampusData';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/academics', label: 'Academics Hub', icon: GraduationCap },
  { to: '/academics/timetable', label: 'Timetable', icon: Calendar },
  { to: '/academics/attendance', label: 'Attendance Tracker', icon: CheckCircle },
  { to: '/academics/assignments', label: 'Assignments', icon: FileCheck },
  { to: '/academics/exams', label: 'Examinations', icon: FileText },
  { to: '/campus-life', label: 'Campus Life', icon: Compass },
  { to: '/library', label: 'Library & Resources', icon: Library },
  { to: '/productivity', label: 'Productivity', icon: Zap },
  { to: '/quick-links', label: 'Thapar Quick Links', icon: ExternalLink },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { data } = useCampus();

  return (
    <aside
      className={`h-screen bg-[#0d0e17] border-r border-white/[0.08] transition-all duration-300 flex flex-col shrink-0 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/[0.08]">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 shrink-0">
              <span className="text-base tracking-tight font-black">C</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-white tracking-tight">CampusOS</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  TIET
                </span>
              </div>
              <span className="text-[10px] text-slate-400 truncate">Thapar Student Companion</span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              <span className="text-base font-black">C</span>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors ${
            collapsed ? 'hidden' : 'block'
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard' || item.to === '/academics'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-indigo-200 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                } ${collapsed ? 'justify-center px-0' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}

                  {/* Active Indicator bar */}
                  {isActive && !collapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-glow-primary" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Sidebar Footer: Student Status & Collapse Toggle button for compact mode */}
      <div className="p-3 border-t border-white/[0.08] space-y-2">
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full py-2 flex justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {!collapsed && (
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <div className="truncate">
                <p className="text-[11px] font-medium text-slate-200 truncate">
                  {data.profile.rollNumber || 'Student ID'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">Thapar Institute, Patiala</p>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Online" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
