import React, { useState } from 'react';
import {
  FileCheck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  Clock,
  Calendar as CalendarIcon,
  Filter,
  List,
  AlertCircle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { useCampus } from '../hooks/useCampusData';
import { Assignment } from '../types/campus';

const Assignments: React.FC = () => {
  const { data, addAssignment, toggleAssignment, deleteAssignment, updateAssignment } = useCampus();

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(data.attendance[0]?.subject || 'Data Structures & Algorithms');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('High');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setSubject(data.attendance[0]?.subject || 'General');
    setDueDate(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
    setPriority('High');
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (asg: Assignment) => {
    setEditingId(asg.id);
    setTitle(asg.title);
    setSubject(asg.subject);
    setDueDate(asg.dueDate);
    setPriority(asg.priority);
    setDescription(asg.description || '');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      updateAssignment(editingId, {
        title,
        subject,
        dueDate,
        priority,
        description,
      });
    } else {
      addAssignment({
        title,
        subject,
        dueDate,
        priority,
        description,
      });
    }
    setModalOpen(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering
  const filteredAssignments = data.assignments
    .filter((a) => {
      const isOverdue = !a.completed && a.dueDate < todayStr;
      if (filterStatus === 'pending') return !a.completed && !isOverdue;
      if (filterStatus === 'completed') return a.completed;
      if (filterStatus === 'overdue') return isOverdue;
      return true;
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate)); // nearest deadline first

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Assignments & Deadlines</h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize lab journals, theory problem sets, and course projects with deadline reminders and priority tags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'calendar' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Calendar Schedule"
            >
              <CalendarIcon size={15} />
            </button>
          </div>

          <a
            href="https://lms.thapar.edu/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 border border-white/[0.08] transition-colors"
          >
            Submit on LMS <ExternalLink size={12} />
          </a>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus size={15} /> Add Assignment
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-1 border-b border-white/[0.06] overflow-x-auto">
        <span className="text-xs font-medium text-slate-500 mr-1 flex items-center gap-1">
          <Filter size={12} /> Filter:
        </span>
        {[
          { key: 'all', label: 'All Tasks', count: data.assignments.length },
          { key: 'pending', label: 'Pending', count: data.assignments.filter((a) => !a.completed && a.dueDate >= todayStr).length },
          { key: 'overdue', label: 'Overdue', count: data.assignments.filter((a) => !a.completed && a.dueDate < todayStr).length },
          { key: 'completed', label: 'Completed', count: data.assignments.filter((a) => a.completed).length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              filterStatus === tab.key
                ? 'bg-white/[0.1] text-white border border-white/[0.15]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/[0.06] text-slate-300 font-mono">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main List or Calendar View */}
      {viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredAssignments.length === 0 ? (
            <div className="p-12 text-center rounded-2xl glass-card space-y-2">
              <FileCheck size={32} className="text-slate-600 mx-auto" />
              <p className="text-sm font-medium text-slate-300">No assignments found</p>
              <p className="text-xs text-slate-500">All submissions are up to date in this category.</p>
            </div>
          ) : (
            filteredAssignments.map((item) => {
              const due = new Date(item.dueDate);
              const isOverdue = !item.completed && item.dueDate < todayStr;
              const diffDays = Math.ceil((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl glass-card transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                    item.completed
                      ? 'border-white/[0.04] opacity-70 bg-white/[0.01]'
                      : isOverdue
                      ? 'border-rose-500/30 bg-rose-950/15'
                      : 'border-white/[0.06] hover:border-indigo-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Toggle Completed Checkbox Button */}
                    <button
                      onClick={() => toggleAssignment(item.id)}
                      className="mt-0.5 p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                      title={item.completed ? 'Mark pending' : 'Mark completed'}
                    >
                      {item.completed ? (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                      ) : (
                        <Circle size={18} className="hover:text-indigo-400" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`text-sm font-semibold text-white ${
                            item.completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {item.title}
                        </h4>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                            item.priority === 'High'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : item.priority === 'Medium'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {item.priority}
                        </span>
                        {isOverdue && (
                          <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-rose-600 text-white animate-pulse">
                            Overdue!
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="font-medium text-indigo-300">{item.subject}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> Due: {item.dueDate}
                        </span>
                        <span>•</span>
                        <span className={isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
                          {item.completed
                            ? 'Submitted'
                            : diffDays > 0
                            ? `${diffDays} days left`
                            : diffDays === 0
                            ? 'Due Today!'
                            : 'Submission overdue'}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-xs text-slate-400 pt-1 line-clamp-2 max-w-2xl">{item.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete assignment "${item.title}"?`)) {
                          deleteAssignment(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Calendar / Timeline View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['High', 'Medium', 'Low'].map((prio) => {
            const list = data.assignments.filter((a) => a.priority === prio);
            return (
              <div key={prio} className="p-4 rounded-2xl glass-card space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {prio} Priority Stack
                  </h4>
                  <span className="text-xs font-mono text-slate-500">{list.length}</span>
                </div>

                <div className="space-y-2">
                  {list.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleAssignment(item.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        item.completed
                          ? 'bg-white/[0.01] border-white/[0.04] opacity-50'
                          : 'bg-white/[0.03] border-white/[0.06] hover:border-indigo-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className={`text-xs font-semibold text-white ${item.completed ? 'line-through' : ''}`}>
                          {item.title}
                        </span>
                        {item.completed && <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{item.subject}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Due: {item.dueDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#12131c] border border-white/[0.12] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-semibold text-white">
                {editingId ? 'Edit Assignment' : 'Add New Assignment'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Red-Black Tree Coding Assignment"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course / Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {data.attendance.map((att) => (
                    <option key={att.id} value={att.subject}>
                      {att.subject} ({att.code})
                    </option>
                  ))}
                  <option value="Capstone Project">Capstone Project</option>
                  <option value="Elective Course">Elective Course</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Include runtime complexity graphs and submit PDF on LMS."
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
                  {editingId ? 'Update Assignment' : 'Save Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;

