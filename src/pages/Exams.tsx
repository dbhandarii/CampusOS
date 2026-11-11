import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Clock,
  Calendar,
  MapPin,
  CheckSquare,
  Square,
  ExternalLink,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useCampus } from '../hooks/useCampusData';
import { Exam } from '../types/campus';

const Exams: React.FC = () => {
  const { data, addExam, toggleExamChecklist, deleteExam } = useCampus();

  const [modalOpen, setModalOpen] = useState(false);
  const [subject, setSubject] = useState(data.attendance[0]?.subject || 'Data Structures & Algorithms');
  const [code, setCode] = useState(data.attendance[0]?.code || 'UCS415');
  const [type, setType] = useState<'MST' | 'EST' | 'Quiz' | 'Lab Practical'>('MST');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM - 12:00 PM');
  const [location, setLocation] = useState('Auditorium Hall B');
  const [checklistText, setChecklistText] = useState('');

  // Countdown timer refresh
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCountdown = (targetDateStr: string) => {
    const target = new Date(targetDateStr + 'T09:00:00');
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, finished: false };
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !date) return;

    const initialChecklist = checklistText
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line, idx) => ({
        id: 'chk-' + Date.now() + '-' + idx,
        text: line.trim(),
        done: false,
      }));

    if (initialChecklist.length === 0) {
      initialChecklist.push(
        { id: 'chk-1', text: 'Revise lecture notes & slides', done: false },
        { id: 'chk-2', text: 'Solve past year papers from Library archive', done: false }
      );
    }

    addExam({
      subject,
      code,
      type,
      date,
      time,
      location,
      checklist: initialChecklist,
    });

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Examination Tracker & Revision</h1>
          <p className="text-xs text-slate-400 mt-1">
            Countdowns for Mid-Semester Tests (MST), End-Semester Tests (EST), Quizzes, and revision checklists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://cl.thapar.edu/ques.php"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 border border-white/[0.08] transition-colors"
          >
            Library Past Papers <ExternalLink size={12} />
          </a>

          <button
            onClick={() => {
              setDate(new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0]);
              setModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus size={15} /> Add Examination
          </button>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {data.exams.map((exam) => {
          const cd = getCountdown(exam.date);
          const completedCount = exam.checklist.filter((c) => c.done).length;
          const progress = exam.checklist.length > 0 ? (completedCount / exam.checklist.length) * 100 : 0;

          return (
            <div key={exam.id} className="p-5 rounded-2xl glass-card space-y-4 border border-white/[0.08] flex flex-col justify-between">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white">{exam.subject}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.06] text-indigo-300">
                        {exam.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-slate-500" /> {exam.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-slate-500" /> {exam.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                        exam.type === 'MST'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : exam.type === 'EST'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {exam.type}
                    </span>

                    <button
                      onClick={() => {
                        if (confirm(`Remove ${exam.subject} from exam tracker?`)) {
                          deleteExam(exam.id);
                        }
                      }}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Countdown Block */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-[#161826] border border-indigo-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block">
                      Time Remaining
                    </span>
                    <span className="text-xs text-slate-400">Venue: {exam.location}</span>
                  </div>

                  {cd.finished ? (
                    <span className="text-xs font-bold text-rose-400">Exam Concluded</span>
                  ) : (
                    <div className="flex items-center gap-2 font-mono">
                      <div className="text-center px-2 py-1 rounded bg-black/40 border border-white/[0.08]">
                        <span className="text-base font-bold text-white block">{cd.days}</span>
                        <span className="text-[9px] text-slate-400">DAYS</span>
                      </div>
                      <span className="text-indigo-400 font-bold">:</span>
                      <div className="text-center px-2 py-1 rounded bg-black/40 border border-white/[0.08]">
                        <span className="text-base font-bold text-white block">{cd.hours}</span>
                        <span className="text-[9px] text-slate-400">HRS</span>
                      </div>
                      <span className="text-indigo-400 font-bold">:</span>
                      <div className="text-center px-2 py-1 rounded bg-black/40 border border-white/[0.08]">
                        <span className="text-base font-bold text-white block">{cd.minutes}</span>
                        <span className="text-[9px] text-slate-400">MIN</span>
                      </div>
                      <span className="text-indigo-400 font-bold">:</span>
                      <div className="text-center px-2 py-1 rounded bg-black/40 border border-white/[0.08]">
                        <span className="text-base font-bold text-indigo-300 block">{cd.seconds}</span>
                        <span className="text-[9px] text-slate-400">SEC</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preparation Checklist */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <BookOpen size={13} className="text-indigo-400" /> Syllabus & Topic Checklist
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {completedCount} / {exam.checklist.length} mastered ({progress.toFixed(0)}%)
                    </span>
                  </div>

                  {/* Mini Progress */}
                  <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {exam.checklist.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleExamChecklist(exam.id, item.id)}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] cursor-pointer transition-colors"
                      >
                        {item.done ? (
                          <CheckSquare size={15} className="text-emerald-400 shrink-0" />
                        ) : (
                          <Square size={15} className="text-slate-500 hover:text-indigo-400 shrink-0" />
                        )}
                        <span
                          className={`text-xs ${item.done ? 'line-through text-slate-500' : 'text-slate-300'}`}
                        >
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Past Papers Quick Link */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                <a
                  href="https://cl.thapar.edu/ques.php"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                >
                  Download {exam.code} PYQs from Library <ExternalLink size={11} />
                </a>
                <span className="text-slate-500">Nava Nalanda Library</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Exam Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#12131c] border border-white/[0.12] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-semibold text-white">Add Exam Schedule</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => {
                    const sel = e.target.value;
                    setSubject(sel);
                    const match = data.attendance.find((a) => a.subject === sel);
                    if (match) setCode(match.code);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {data.attendance.map((att) => (
                    <option key={att.id} value={att.subject}>
                      {att.subject} ({att.code})
                    </option>
                  ))}
                  <option value="Elective Course">Elective Course</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="MST">Mid-Semester Test (MST)</option>
                    <option value="EST">End-Semester Test (EST)</option>
                    <option value="Quiz">Surprise / Scheduled Quiz</option>
                    <option value="Lab Practical">Lab Practical Viva</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:00 AM - 12:00 PM"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Seating Venue</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Auditorium Hall B"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Preparation Checklist Topics (one per line)
                </label>
                <textarea
                  rows={3}
                  value={checklistText}
                  onChange={(e) => setChecklistText(e.target.value)}
                  placeholder="Module 1: Red-Black Trees&#10;Module 2: Graph Algorithms&#10;Solve 2023 MST Paper"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
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
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;

