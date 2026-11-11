import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Play,
  Flame,
  FileText,
  MapPin,
  ArrowUpRight,
  TrendingUp,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useCampus } from '../hooks/useCampusData';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { data, logClassAttendance, addAssignment } = useCampus();
  const navigate = useNavigate();

  // Quick Action Modal states
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState(data.attendance[0]?.subject || 'Data Structures & Algorithms');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('High');

  // Today determination
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
  const currentDayIndex = new Date().getDay();
  // If Sunday, default preview to Monday schedule for demo
  const todayDayName = currentDayIndex === 0 ? 'Monday' : dayNames[currentDayIndex];

  const todayClasses = data.timetable
    .filter((t) => t.day === todayDayName)
    .sort((a, b) => a.start.localeCompare(b.start));

  // Find next class logic
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let nextClass = todayClasses.find((c) => {
    const [h, m] = c.start.split(':').map(Number);
    return h * 60 + m >= currentMinutes;
  });
  if (!nextClass && todayClasses.length > 0) {
    nextClass = todayClasses[0]; // fallback for demo
  }

  // Attendance Calculations
  const totalClasses = data.attendance.reduce((acc, curr) => acc + curr.total, 0);
  const totalAttended = data.attendance.reduce((acc, curr) => acc + curr.attended, 0);
  const overallPercentage = totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(1) : '0';

  const target = data.settings.attendanceTarget || 75;

  // Assignments calculation
  const pendingAssignments = data.assignments.filter((a) => !a.completed);
  const upcomingExams = data.exams.slice(0, 2);

  // Quick Assignment Add
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addAssignment({
      title: newTitle,
      subject: newSubject,
      dueDate: newDueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      priority: newPriority,
    });
    setNewTitle('');
    setShowAddAssignmentModal(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-blue-900/20 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Thapar COE Student Hub</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                Live Prototype
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Welcome back, <span className="text-slate-200 font-medium">{data.profile.name}</span>. You have {todayClasses.length} sessions scheduled today.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://campus.thapar.edu/psp/csprd/?cmd=login&languageCd=ENG&"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-slate-200 border border-white/[0.08] transition-colors"
          >
            ERP WebKiosk <ExternalLink size={12} />
          </a>
          <a
            href="https://lms.thapar.edu/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white shadow-md shadow-indigo-600/30 transition-colors"
          >
            TIET LMS <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Widget F: Daily Overview Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Classes Today */}
        <div
          onClick={() => navigate('/academics/timetable')}
          className="p-4 rounded-2xl glass-card cursor-pointer hover:border-indigo-500/30 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Classes Today</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Calendar size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{todayClasses.length}</span>
            <span className="text-xs text-slate-500">for {todayDayName}</span>
          </div>
          <p className="text-[11px] text-blue-400 mt-2 flex items-center gap-1">
            View full schedule <ArrowUpRight size={12} />
          </p>
        </div>

        {/* Pending Assignments */}
        <div
          onClick={() => navigate('/academics/assignments')}
          className="p-4 rounded-2xl glass-card cursor-pointer hover:border-indigo-500/30 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Assignments</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{pendingAssignments.length}</span>
            <span className="text-xs text-amber-400 font-medium">
              {pendingAssignments.filter((a) => a.priority === 'High').length} High priority
            </span>
          </div>
          <p className="text-[11px] text-amber-400/90 mt-2 flex items-center gap-1">
            Manage deadlines <ArrowUpRight size={12} />
          </p>
        </div>

        {/* Overall Attendance */}
        <div
          onClick={() => navigate('/academics/attendance')}
          className="p-4 rounded-2xl glass-card cursor-pointer hover:border-indigo-500/30 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Overall Attendance</span>
            <div className={`p-2 rounded-xl ${
              Number(overallPercentage) >= target ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{overallPercentage}%</span>
            <span className="text-xs text-slate-400">({totalAttended}/{totalClasses})</span>
          </div>
          <p className={`text-[11px] mt-2 flex items-center gap-1 font-medium ${
            Number(overallPercentage) >= target ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {Number(overallPercentage) >= target ? `Above ${target}% threshold` : `Warning: Below ${target}% target`}
          </p>
        </div>

        {/* Upcoming Examinations */}
        <div
          onClick={() => navigate('/academics/exams')}
          className="p-4 rounded-2xl glass-card cursor-pointer hover:border-indigo-500/30 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Upcoming Exams</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <FileText size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{data.exams.length}</span>
            <span className="text-xs text-purple-400">Mid-Sem (MST)</span>
          </div>
          <p className="text-[11px] text-purple-400 mt-2 flex items-center gap-1">
            Check preparation checklist <ArrowUpRight size={12} />
          </p>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Today's Schedule + Attendance Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Widget A: Today's Schedule */}
          <div className="p-5 rounded-2xl glass-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Today&apos;s Schedule ({todayDayName})</h3>
                  <p className="text-[11px] text-slate-400">Chronological academic lectures, labs & tutorials</p>
                </div>
              </div>

              {nextClass && (
                <div className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2">
                  <Clock size={12} className="text-indigo-400 animate-pulse" />
                  <span className="text-xs font-medium text-indigo-300">
                    Next: {nextClass.code} at {nextClass.start} ({nextClass.location})
                  </span>
                </div>
              )}
            </div>

            {todayClasses.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No classes scheduled for today! Time to work on projects or study.
              </div>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((cls) => {
                  const isNext = nextClass?.id === cls.id;
                  return (
                    <div
                      key={cls.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isNext
                          ? 'bg-gradient-to-r from-indigo-950/40 to-[#161826] border-indigo-500/40 shadow-glow-primary'
                          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 shrink-0 text-left">
                          <span className="text-xs font-bold text-white block">{cls.start}</span>
                          <span className="text-[10px] text-slate-400 block">{cls.end}</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-semibold text-white">{cls.subject}</h4>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-indigo-300">
                              {cls.code}
                            </span>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded font-medium ${
                                cls.type === 'Lecture'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : cls.type === 'Practical'
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : 'bg-emerald-500/20 text-emerald-300'
                              }`}
                            >
                              {cls.type}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="text-slate-500" /> {cls.location}
                            </span>
                            {cls.faculty && (
                              <span className="truncate">Faculty: {cls.faculty}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Log Attendance for this subject */}
                      {(() => {
                        const attRecord = data.attendance.find((a) => a.code === cls.code);
                        if (!attRecord) return null;
                        return (
                          <div className="flex items-center gap-2 shrink-0 sm:self-center">
                            <button
                              onClick={() => logClassAttendance(attRecord.id, true)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium transition-colors"
                              title="Mark attended"
                            >
                              Attended +1
                            </button>
                            <button
                              onClick={() => logClassAttendance(attRecord.id, false)}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-[10px] font-medium transition-colors"
                              title="Mark missed"
                            >
                              Missed
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Widget B: Attendance Overview with Safe Bunk & Threshold Highlight */}
          <div className="p-5 rounded-2xl glass-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Subject-wise Attendance & Safe Bunk</h3>
                  <p className="text-[11px] text-slate-400">
                    Threshold target: <span className="text-indigo-400 font-semibold">{target}%</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/academics/attendance')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                Detailed calculator <ArrowUpRight size={13} />
              </button>
            </div>

            <div className="space-y-3.5">
              {data.attendance.map((sub) => {
                const percentage = sub.total > 0 ? (sub.attended / sub.total) * 100 : 0;
                const isBelowTarget = percentage < target;

                // Safe bunk calculation:
                // How many more can miss: Math.floor(attended / (target/100)) - total
                const maxMissable = Math.max(0, Math.floor(sub.attended / (target / 100)) - sub.total);

                // Classes needed to reach target if below:
                // (attended + x) / (total + x) >= target/100 => x = ceil((target*total - 100*attended) / (100 - target))
                const classesNeeded = isBelowTarget
                  ? Math.ceil((target * sub.total - 100 * sub.attended) / (100 - target))
                  : 0;

                return (
                  <div key={sub.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{sub.subject}</span>
                        <span className="font-mono text-[10px] text-slate-400">{sub.code}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px]">
                          {sub.attended}/{sub.total} classes
                        </span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            isBelowTarget
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isBelowTarget ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>

                    {/* Safe Bunk or Recovery Status */}
                    <div className="flex items-center justify-between text-[11px]">
                      {isBelowTarget ? (
                        <span className="text-rose-400 font-medium flex items-center gap-1">
                          <AlertCircle size={12} /> Attend next {classesNeeded} classes consecutively to hit {target}%
                        </span>
                      ) : (
                        <span className="text-slate-400 flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-emerald-400" /> You can safely bunk{' '}
                          <span className="text-emerald-300 font-semibold">{maxMissable}</span> more classes
                        </span>
                      )}

                      <span className="text-slate-500 text-[10px]">Manual Entry (Not ERP)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Quick Actions, Upcoming Assignments, Events */}
        <div className="space-y-6">
          {/* Widget E: Quick Actions */}
          <div className="p-5 rounded-2xl glass-card space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Actions</h3>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setShowAddAssignmentModal(true)}
                className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-left transition-colors group"
              >
                <Plus size={16} className="text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-medium text-white">Add Assignment</p>
                <p className="text-[10px] text-slate-500">Track submission</p>
              </button>

              <button
                onClick={() => navigate('/productivity')}
                className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-left transition-colors group"
              >
                <Play size={16} className="text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-medium text-white">Focus Timer</p>
                <p className="text-[10px] text-slate-500">Pomodoro mode</p>
              </button>

              <button
                onClick={() => navigate('/academics/timetable')}
                className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-left transition-colors group"
              >
                <Calendar size={16} className="text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-medium text-white">Add Class</p>
                <p className="text-[10px] text-slate-500">Custom timetable</p>
              </button>

              <button
                onClick={() => navigate('/quick-links')}
                className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-left transition-colors group"
              >
                <ExternalLink size={16} className="text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-medium text-white">All Portals</p>
                <p className="text-[10px] text-slate-500">Official links</p>
              </button>
            </div>
          </div>

          {/* Widget C: Upcoming Assignments */}
          <div className="p-5 rounded-2xl glass-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Assignments Due</h3>
              </div>
              <button
                onClick={() => navigate('/academics/assignments')}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {data.assignments.slice(0, 3).map((asg) => {
                const due = new Date(asg.dueDate);
                const diffDays = Math.ceil((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <div
                    key={asg.id}
                    className={`p-3 rounded-xl border transition-all ${
                      asg.completed
                        ? 'bg-white/[0.01] border-white/[0.04] opacity-60'
                        : 'bg-white/[0.03] border-white/[0.06] hover:border-indigo-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-xs font-medium text-white ${asg.completed ? 'line-through text-slate-400' : ''}`}>
                        {asg.title}
                      </h4>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                          asg.priority === 'High'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {asg.priority}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{asg.subject}</span>
                      <span className={diffDays <= 2 ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
                        {diffDays > 0 ? `${diffDays} days left` : diffDays === 0 ? 'Due Today!' : 'Overdue'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Widget D: Upcoming Campus Events */}
          <div className="p-5 rounded-2xl glass-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Campus Events</h3>
              </div>
              <button
                onClick={() => navigate('/campus-life')}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                More events
              </button>
            </div>

            <div className="space-y-3">
              {data.events.slice(0, 2).map((ev) => (
                <div key={ev.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium">
                      {ev.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{ev.date}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white">{ev.title}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin size={11} className="text-slate-500" /> {ev.venue}
                  </p>
                  <a
                    href={ev.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 pt-1 font-medium"
                  >
                    Register on Campus Connect <ExternalLink size={10} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Assignment Modal */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#12131c] border border-white/[0.12] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-semibold text-white">Add New Assignment</h3>
              <button
                onClick={() => setShowAddAssignmentModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Graph Algorithms Homework"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {data.attendance.map((att) => (
                    <option key={att.id} value={att.subject}>
                      {att.subject} ({att.code})
                    </option>
                  ))}
                  <option value="General">General / Elective</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAssignmentModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

