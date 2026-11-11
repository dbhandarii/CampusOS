import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Calendar,
  CheckCircle,
  FileCheck,
  FileText,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  BookOpen,
} from 'lucide-react';
import { useCampus } from '../hooks/useCampusData';

const Academics: React.FC = () => {
  const { data } = useCampus();

  const totalClasses = data.attendance.reduce((a, b) => a + b.total, 0);
  const totalAttended = data.attendance.reduce((a, b) => a + b.attended, 0);
  const overallPct = totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(1) : '0';
  const target = data.settings.attendanceTarget || 75;

  const pendingAssignments = data.assignments.filter((a) => !a.completed);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Academics Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-[#12131c] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
            Academics Management Center
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Academic Performance & Scheduling
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Streamline your coursework at Thapar Institute. Manage your weekly class schedule, calculate attendance with safe bunk analysis, track assignments, and prepare for MST/EST examinations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300">
            {data.profile.branch} • Sem {data.profile.semester.replace(/\D/g, '') || '5'}
          </span>
        </div>
      </div>

      {/* 4 Dedicated Academic Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Timetable Card */}
        <NavLink
          to="/academics/timetable"
          className="p-5 rounded-2xl glass-card hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                <Calendar size={22} />
              </div>
              <span className="text-xs text-slate-400 group-hover:text-indigo-400 font-medium flex items-center gap-1 transition-colors">
                Open Timetable <ArrowRight size={14} />
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mt-4 group-hover:text-indigo-300 transition-colors">
              Weekly Timetable
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Grid-based calendar interface for Monday–Saturday. Visual distinctions for Lectures, Tutorials, and Practicals with CSV import.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span>{data.timetable.length} scheduled sessions</span>
            <span className="text-blue-400 font-medium">Editable Demo Data</span>
          </div>
        </NavLink>

        {/* Attendance Tracker Card */}
        <NavLink
          to="/academics/attendance"
          className="p-5 rounded-2xl glass-card hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle size={22} />
              </div>
              <span className="text-xs text-slate-400 group-hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors">
                Open Attendance <ArrowRight size={14} />
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mt-4 group-hover:text-emerald-300 transition-colors">
              Attendance Tracker & Safe Bunk
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Subject-wise percentage calculations, target threshold settings (default 75%), classes needed for recovery, and safe bunk calculations.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span>Overall: <strong className="text-white">{overallPct}%</strong></span>
            <span className={Number(overallPct) >= target ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
              {Number(overallPct) >= target ? `On Track (>= ${target}%)` : `Action Required (< ${target}%)`}
            </span>
          </div>
        </NavLink>

        {/* Assignments Manager Card */}
        <NavLink
          to="/academics/assignments"
          className="p-5 rounded-2xl glass-card hover:border-amber-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                <FileCheck size={22} />
              </div>
              <span className="text-xs text-slate-400 group-hover:text-amber-400 font-medium flex items-center gap-1 transition-colors">
                Open Assignments <ArrowRight size={14} />
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mt-4 group-hover:text-amber-300 transition-colors">
              Assignments & Deliverables
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Track course deliverables with priority flags, nearest deadline sorting, urgent notifications, and interactive status filters.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span>{pendingAssignments.length} pending submissions</span>
            <span className="text-amber-400 font-medium">
              {pendingAssignments.filter((a) => a.priority === 'High').length} High priority
            </span>
          </div>
        </NavLink>

        {/* Examinations Card */}
        <NavLink
          to="/academics/exams"
          className="p-5 rounded-2xl glass-card hover:border-purple-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                <FileText size={22} />
              </div>
              <span className="text-xs text-slate-400 group-hover:text-purple-400 font-medium flex items-center gap-1 transition-colors">
                Open Exam Tracker <ArrowRight size={14} />
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mt-4 group-hover:text-purple-300 transition-colors">
              Examination Tracker & Revision
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              MST, EST and quiz countdowns with interactive topic preparation checklists and past paper reference guides.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span>{data.exams.length} examinations scheduled</span>
            <span className="text-purple-400 font-medium">Countdown Active</span>
          </div>
        </NavLink>
      </div>

      {/* Note regarding ERP and Local data */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 text-xs text-slate-400">
        <BookOpen size={16} className="text-indigo-400 shrink-0 mt-0.5" />
        <p>
          <strong>Notice on Data Privacy & Portals:</strong> CampusOS operates with local privacy. Timetable and attendance records are customizable student tools and do not directly override or modify official Thapar WebKiosk ERP databases. For formal grade transcripts or official fee slips, access the WebKiosk link.
        </p>
      </div>
    </div>
  );
};

export default Academics;

