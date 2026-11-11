import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Clock,
  MapPin,
  User,
  Info,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { useCampus } from '../hooks/useCampusData';
import { TimetableEntry } from '../types/campus';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

const Timetable: React.FC = () => {
  const { data, addTimetableEntry, updateTimetableEntry, deleteTimetableEntry, importTimetableCSV } = useCampus();

  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    day: 'Monday' as (typeof DAYS)[number],
    start: '08:50',
    end: '09:40',
    subject: '',
    code: '',
    location: '',
    type: 'Lecture' as 'Lecture' | 'Tutorial' | 'Practical',
    faculty: '',
    group: 'COE-14',
  });

  const openAddModal = (dayToPrefill?: string) => {
    setEditingId(null);
    setFormData({
      day: (dayToPrefill as any) || (selectedDay as any) || 'Monday',
      start: '08:50',
      end: '09:40',
      subject: '',
      code: '',
      location: '',
      type: 'Lecture',
      faculty: '',
      group: 'COE-14',
    });
    setModalOpen(true);
  };

  const openEditModal = (entry: TimetableEntry) => {
    setEditingId(entry.id);
    setFormData({
      day: entry.day,
      start: entry.start,
      end: entry.end,
      subject: entry.subject,
      code: entry.code,
      location: entry.location,
      type: entry.type,
      faculty: entry.faculty || '',
      group: entry.group || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.code.trim()) return;

    if (editingId) {
      updateTimetableEntry(editingId, formData);
    } else {
      addTimetableEntry(formData);
    }
    setModalOpen(false);
  };

  // CSV Import handler
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim().length > 0);

      // Expected format: Day,Start,End,Subject,Code,Location,Type,Faculty,Group
      const imported: TimetableEntry[] = [];
      // Skip header if line 0 has 'day' or 'subject'
      const startIndex = lines[0].toLowerCase().includes('subject') || lines[0].toLowerCase().includes('day') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
        if (cols.length >= 6) {
          imported.push({
            id: 'tt-imp-' + Date.now() + '-' + i,
            day: (cols[0] as any) || 'Monday',
            start: cols[1] || '08:50',
            end: cols[2] || '09:40',
            subject: cols[3] || 'Course',
            code: cols[4] || 'UCS000',
            location: cols[5] || 'LT-101',
            type: (cols[6] as any) || 'Lecture',
            faculty: cols[7] || '',
            group: cols[8] || 'All',
          });
        }
      }

      if (imported.length > 0) {
        importTimetableCSV(imported);
        alert(`Successfully imported ${imported.length} classes from CSV!`);
      } else {
        alert('Could not parse valid timetable rows from CSV.');
      }
    };
    reader.readAsText(file);
  };

  // Export CSV sample template
  const downloadSampleCSV = () => {
    const sample = `Day,Start,End,Subject,Code,Location,Type,Faculty,Group
Monday,08:50,09:40,Data Structures & Algorithms,UCS415,LT-102,Lecture,Dr. Neeraj Kumar,COE-14
Monday,09:40,10:30,Operating Systems,UCS414,LT-101,Lecture,Dr. Inderveer Chhabra,COE-14
Monday,11:20,13:00,Computer Networks Lab,UCS503,LP-106,Practical,Er. Simranjit Kaur,COE-14-G1
Tuesday,10:30,11:20,Discrete Mathematics,UMA010,LT-301,Lecture,Dr. Harish Garg,COE-14
Wednesday,12:10,13:00,DSA Tutorial,UCS415,TS-104,Tutorial,Dr. Neeraj Kumar,COE-14`;

    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'thapar_timetable_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const dayClasses = data.timetable
    .filter((t) => t.day === selectedDay)
    .sort((a, b) => a.start.localeCompare(b.start));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header with Demo Data Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Weekly Timetable</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              Demo Data • Fully Editable
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Displaying timetable for Thapar COE Semester 5. You can add, edit, delete, or import your personal batch schedule.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 border border-white/[0.08] cursor-pointer transition-colors">
            <Upload size={14} className="text-indigo-400" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
          </label>

          <button
            onClick={downloadSampleCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 border border-white/[0.08] transition-colors"
            title="Download CSV format template"
          >
            <Download size={14} className="text-slate-400" />
            <span className="hidden sm:inline">CSV Template</span>
          </button>

          <button
            onClick={() => openAddModal()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus size={15} /> Add Class
          </button>
        </div>
      </div>

      {/* Demo Notice Warning */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-200">
        <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300">Important Disclaimer:</span> The initial classes shown below are sample mock data created for demonstration purposes, not your official WebKiosk schedule. You can edit every entry or import your actual batch timetable using the CSV import button above.
        </div>
      </div>

      {/* Day Selector Tabs (Monday - Saturday) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/[0.06]">
        {DAYS.map((day) => {
          const count = data.timetable.filter((t) => t.day === day).length;
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-medium shrink-0 transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.07] hover:text-slate-200 border border-white/[0.04]'
              }`}
            >
              <span>{day}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedule for Selected Day */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            {selectedDay} Schedule ({dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'})
          </h3>
          <button
            onClick={() => openAddModal(selectedDay)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
          >
            <Plus size={13} /> Add class to {selectedDay}
          </button>
        </div>

        {dayClasses.length === 0 ? (
          <div className="p-12 text-center rounded-2xl glass-card space-y-3">
            <CalendarIcon size={32} className="text-slate-600 mx-auto" />
            <p className="text-sm font-medium text-slate-300">No classes scheduled on {selectedDay}</p>
            <p className="text-xs text-slate-500">Take a break or click &apos;Add Class&apos; to schedule tutorials or labs.</p>
            <button
              onClick={() => openAddModal(selectedDay)}
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-colors"
            >
              + Add Class to {selectedDay}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {dayClasses.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl glass-card hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white">{item.subject}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-indigo-300">
                          {item.code}
                        </span>
                      </div>
                      <span
                        className={`inline-block text-[10px] px-2 py-0.5 rounded font-semibold ${
                          item.type === 'Lecture'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : item.type === 'Practical'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                        title="Edit class"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${item.subject} (${item.code})?`)) {
                            deleteTimetableEntry(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete class"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-500" /> {item.start} - {item.end}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-500" /> {item.location}
                    </span>
                    {item.faculty && (
                      <span className="flex items-center gap-1.5 col-span-2 truncate">
                        <User size={13} className="text-slate-500" /> {item.faculty}
                      </span>
                    )}
                  </div>
                </div>

                {item.group && (
                  <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>Batch: {item.group}</span>
                    <span className="text-indigo-400/80">Thapar Patiala</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Class Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#12131c] border border-white/[0.12] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-semibold text-white">
                {editingId ? 'Edit Timetable Class' : 'Add Class to Timetable'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Day of Week</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Session Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Practical">Practical (Lab)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Operating Systems"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. UCS414"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Room</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. LT-101 or LP-102"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time (24h)</label>
                  <input
                    type="time"
                    required
                    value={formData.start}
                    onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Time (24h)</label>
                  <input
                    type="time"
                    required
                    value={formData.end}
                    onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Faculty Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    placeholder="e.g. Dr. Inderveer Chhabra"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Batch / Group</label>
                  <input
                    type="text"
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    placeholder="e.g. COE-14"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
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
                  {editingId ? 'Update Class' : 'Save Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;

