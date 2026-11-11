import React, { useState } from 'react';
import {
  CheckCircle,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Info,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useCampus } from '../hooks/useCampusData';
import { AttendanceRecord } from '../types/campus';

const Attendance: React.FC = () => {
  const {
    data,
    addAttendanceRecord,
    updateAttendanceRecord,
    logClassAttendance,
    deleteAttendanceRecord,
    setAttendanceTarget,
  } = useCampus();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [subjectName, setSubjectName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [totalClasses, setTotalClasses] = useState(30);
  const [attendedClasses, setAttendedClasses] = useState(25);

  const target = data.settings.attendanceTarget || 75;

  const openAddModal = () => {
    setEditingId(null);
    setSubjectName('');
    setCourseCode('');
    setTotalClasses(30);
    setAttendedClasses(25);
    setModalOpen(true);
  };

  const openEditModal = (rec: AttendanceRecord) => {
    setEditingId(rec.id);
    setSubjectName(rec.subject);
    setCourseCode(rec.code);
    setTotalClasses(rec.total);
    setAttendedClasses(rec.attended);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim() || !courseCode.trim()) return;

    if (editingId) {
      updateAttendanceRecord(editingId, {
        subject: subjectName,
        code: courseCode,
        total: Math.max(0, Number(totalClasses)),
        attended: Math.min(Math.max(0, Number(attendedClasses)), Number(totalClasses)),
      });
    } else {
      addAttendanceRecord({
        subject: subjectName,
        code: courseCode,
        total: Math.max(0, Number(totalClasses)),
        attended: Math.min(Math.max(0, Number(attendedClasses)), Number(totalClasses)),
        target,
      });
    }
    setModalOpen(false);
  };

  // Overall Stats
  const grandTotal = data.attendance.reduce((sum, item) => sum + item.total, 0);
  const grandAttended = data.attendance.reduce((sum, item) => sum + item.attended, 0);
  const overallPct = grandTotal > 0 ? ((grandAttended / grandTotal) * 100).toFixed(1) : '0';

  const criticalSubjects = data.attendance.filter(
    (item) => item.total > 0 && (item.attended / item.total) * 100 < target
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Attendance Tracker & Safe Bunk</h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain your semester attendance and calculate how many lectures you can safely miss or need to attend to satisfy Thapar criteria.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Target Threshold Configurator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <Sliders size={14} className="text-indigo-400" />
            <span className="text-xs text-slate-300 font-medium">Target:</span>
            <select
              value={target}
              onChange={(e) => setAttendanceTarget(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-indigo-400 focus:outline-none cursor-pointer"
            >
              <option value={70} className="bg-[#12131c] text-white">70%</option>
              <option value={75} className="bg-[#12131c] text-white">75% (Default)</option>
              <option value={80} className="bg-[#12131c] text-white">80%</option>
              <option value={85} className="bg-[#12131c] text-white">85%</option>
              <option value={90} className="bg-[#12131c] text-white">90%</option>
            </select>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus size={15} /> Add Subject
          </button>
        </div>
      </div>

      {/* Official ERP Disclaimer Notice Required by Prompt */}
      <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3 text-xs text-indigo-200">
        <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong>Manual Tracker Notice:</strong> Attendance tracked here is manually entered and maintained by you for daily habit tracking and safe bunk simulations. This is NOT synchronized from or submitted to the official TIET WebKiosk ERP. Always verify your official attendance on WebKiosk prior to exam registration.
        </div>
      </div>

      {/* Aggregate Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Percentage */}
        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Cumulative Attendance</span>
            <div className={`p-2 rounded-xl ${
              Number(overallPct) >= target ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{overallPct}%</span>
            <span className="text-xs text-slate-400">({grandAttended} of {grandTotal} attended)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Target threshold set at <span className="text-indigo-300 font-semibold">{target}%</span>
          </p>
        </div>

        {/* Subjects in Risk Zone */}
        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Subjects Below Target</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{criticalSubjects.length}</span>
            <span className="text-xs text-slate-400">of {data.attendance.length} enrolled subjects</span>
          </div>
          <p className="text-[11px] text-rose-400 font-medium">
            {criticalSubjects.length === 0
              ? 'Great work! All subjects are above target.'
              : `${criticalSubjects.map((s) => s.code).join(', ')} require attendance recovery.`}
          </p>
        </div>

        {/* Quick ERP Link */}
        <div className="p-5 rounded-2xl glass-card flex flex-col justify-between space-y-2">
          <div>
            <span className="text-xs font-medium text-slate-400">Official WebKiosk</span>
            <h4 className="text-sm font-semibold text-white mt-1">Cross-check Official ERP</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Verify medical certificate submissions and officially locked attendance percentages.
            </p>
          </div>
          <a
            href="https://campus.thapar.edu/psp/csprd/?cmd=login&languageCd=ENG&"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 pt-1"
          >
            Open WebKiosk Login →
          </a>
        </div>
      </div>

      {/* Subject-Wise Detailed Attendance Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Subject-wise Breakdown & Daily Logging</h3>

        <div className="space-y-3">
          {data.attendance.map((sub) => {
            const percentage = sub.total > 0 ? (sub.attended / sub.total) * 100 : 0;
            const isBelowTarget = percentage < target;

            // Safe bunk calculation:
            // max classes that can be missed: Math.floor(attended / (target/100)) - total
            const maxMissable = Math.max(0, Math.floor(sub.attended / (target / 100)) - sub.total);

            // Classes needed to reach target if below:
            // (attended + x) / (total + x) >= target/100 => x = ceil((target*total - 100*attended) / (100 - target))
            const classesNeeded = isBelowTarget
              ? Math.ceil((target * sub.total - 100 * sub.attended) / (100 - target))
              : 0;

            return (
              <div
                key={sub.id}
                className={`p-4 rounded-xl glass-card transition-all space-y-3.5 border ${
                  isBelowTarget
                    ? 'border-rose-500/30 bg-gradient-to-r from-rose-950/20 to-[#12131c]'
                    : 'border-white/[0.06]'
                }`}
              >
                {/* Top Row: Title, Code, Percentage, Edit/Delete */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-white">{sub.subject}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.06] text-indigo-300">
                      {sub.code}
                    </span>
                    {isBelowTarget && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Critical Shortage
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span
                        className={`text-base font-extrabold ${
                          isBelowTarget ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {percentage.toFixed(1)}%
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        ({sub.attended} / {sub.total})
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(sub)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                        title="Edit counts"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${sub.subject} from tracker?`)) {
                            deleteAttendanceRecord(sub.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar with 75% target marker */}
                <div className="space-y-1">
                  <div className="w-full h-2.5 rounded-full bg-white/[0.06] overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isBelowTarget ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>
                </div>

                {/* Calculations Row + One-Click Daily Logging Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-white/[0.06] text-xs">
                  {/* Calculation Insight */}
                  <div>
                    {isBelowTarget ? (
                      <p className="text-rose-400 font-medium flex items-center gap-1.5">
                        <AlertCircle size={14} className="shrink-0" />
                        Short of {target}%: Attend the next{' '}
                        <span className="underline font-bold text-rose-300">{classesNeeded}</span> lectures
                        consecutively to reach {target}%.
                      </p>
                    ) : (
                      <p className="text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        Safe zone: You can safely bunk{' '}
                        <span className="font-bold text-emerald-400 text-sm">{maxMissable}</span> more classes while
                        remaining above {target}%.
                      </p>
                    )}
                  </div>

                  {/* Quick Update Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-500 mr-1">Log today:</span>
                    <button
                      onClick={() => logClassAttendance(sub.id, true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all shadow-sm"
                      title="Add 1 attended class"
                    >
                      + Attended
                    </button>
                    <button
                      onClick={() => logClassAttendance(sub.id, false)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all shadow-sm"
                      title="Add 1 bunked class"
                    >
                      + Bunked
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Attendance Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#12131c] border border-white/[0.12] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-semibold text-white">
                {editingId ? 'Edit Subject Attendance' : 'Add Subject to Track'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g. Computer Networks"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. UCS503"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Classes Conducted</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={totalClasses}
                    onChange={(e) => setTotalClasses(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Classes Attended</label>
                  <input
                    type="number"
                    min="0"
                    max={totalClasses}
                    required
                    value={attendedClasses}
                    onChange={(e) => setAttendedClasses(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  {editingId ? 'Update Counts' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;

