import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  ShieldCheck,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';
import { useCampus } from '../hooks/useCampusData';

const Settings: React.FC = () => {
  const { data, updateProfile, setAttendanceTarget, resetDemoData } = useCampus();

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [name, setName] = useState(data.profile.name);
  const [rollNumber, setRollNumber] = useState(data.profile.rollNumber);
  const [degree, setDegree] = useState(data.profile.degree);
  const [branch, setBranch] = useState(data.profile.branch);
  const [year, setYear] = useState(data.profile.year);
  const [semester, setSemester] = useState(data.profile.semester);
  const [hostel, setHostel] = useState(data.profile.hostel);
  const [email, setEmail] = useState(data.profile.email);
  const [cgpa, setCgpa] = useState(data.profile.cgpa);

  const [threshold, setThreshold] = useState(data.settings.attendanceTarget || 75);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      rollNumber,
      degree,
      branch,
      year,
      semester,
      hostel,
      email,
      cgpa,
    });
    setAttendanceTarget(Number(threshold));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to restore default Thapar COE sample demo data? This will overwrite manual changes.')) {
      resetDemoData();
      alert('CampusOS restored to default Thapar COE demo state.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Student Profile & Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal academic information, attendance targets, and dashboard preferences.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 size={14} /> Profile Saved Successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Student Profile Card */}
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <User size={18} className="text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Student Personal & Academic Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Student Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                TIET Roll Number / Registration
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Degree / Programme</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Branch / Specialization</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Semester</label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hostel & Room Allotment</label>
              <input
                type="text"
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Student Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Academic Settings & Threshold Card */}
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <Sliders size={18} className="text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Academic Thresholds & Calculations</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Minimum Attendance Target Threshold (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-32 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                />
                <span className="text-xs text-slate-400">
                  Thapar standard requirement is typically 75%. Safe bunk and recovery calculations adapt immediately.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Credentials Notice */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 text-xs text-slate-400">
          <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200">Zero Credential Architecture:</span> CampusOS does not require or store your institutional passwords for WebKiosk, LMS, or WiFi. All preferences and course records are isolated inside your browser&apos;s localStorage sandbox.
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <RotateCcw size={14} /> Reset to Thapar COE Demo Data
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all self-end sm:self-auto"
          >
            <CheckCircle2 size={15} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;

