import React, { useState } from 'react';
import { useCampus } from '../hooks/useCampusData';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface OnboardingProps {
  onClose: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
  const { data, updateProfile } = useCampus();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: data.profile.name || '',
    rollNumber: data.profile.rollNumber || '',
    degree: data.profile.degree || 'B.Tech / B.E.',
    branch: data.profile.branch || 'Computer Engineering (COE)',
    year: data.profile.year || '3rd Year',
    semester: data.profile.semester || '5th Semester',
    hostel: data.profile.hostel || 'Hostel J (Boys)',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formData.name.trim() || 'Thapar Student',
      rollNumber: formData.rollNumber.trim() || '102203000',
      degree: formData.degree,
      branch: formData.branch,
      year: formData.year,
      semester: formData.semester,
      hostel: formData.hostel,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#12131c] border border-white/[0.12] shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Welcome to CampusOS</h2>
            <p className="text-xs text-slate-400">Everything at Thapar. One Unified Dashboard.</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-indigo-500' : 'bg-white/10'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-indigo-500' : 'bg-white/10'}`} />
        </div>

        <form onSubmit={handleFinish}>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Roll / Registration Number <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="e.g. 102203458"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Degree / Programme
                  </label>
                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MCA">MCA</option>
                    <option value="M.Sc">M.Sc</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Branch / Discipline
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Computer Engineering (COE)">Computer Engineering (COE)</option>
                    <option value="Computer Science & Engg (CSE)">Computer Science & Engg (CSE)</option>
                    <option value="Computer Science & Business Systems (CSBS)">CSBS</option>
                    <option value="Electronics & Communication (ECE)">Electronics & Comm (ECE)</option>
                    <option value="Electrical Engineering (EE)">Electrical Engineering (EE)</option>
                    <option value="Mechanical Engineering (ME)">Mechanical Engineering (ME)</option>
                    <option value="Civil Engineering (CE)">Civil Engineering (CE)</option>
                    <option value="Biotechnology (BT)">Biotechnology (BT)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Continue <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Current Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Current Semester
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Hostel / Residence <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="hostel"
                  value={formData.hostel}
                  onChange={handleChange}
                  placeholder="e.g. Hostel J - Block B, Room 312 or Day Scholar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Privacy Notice Required by Prompt */}
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  <strong>Zero Institutional Credential Storage:</strong> CampusOS never asks for your WebKiosk or LMS passwords. All your data is securely saved in your browser&apos;s local storage.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <CheckCircle2 size={16} /> Get Started with CampusOS
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Onboarding;

