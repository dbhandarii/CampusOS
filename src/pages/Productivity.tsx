import React, { useState, useEffect } from 'react';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Flame,
  Clock,
  Calendar,
  CheckSquare,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useCampus } from '../hooks/useCampusData';
import { Task } from '../types/campus';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const MODE_TIMES: Record<TimerMode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const Productivity: React.FC = () => {
  const { data, addTask, toggleTask, deleteTask, recordPomodoroSession } = useCampus();

  // Pomodoro Timer State
  const [timerMode, setTimerMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_TIMES.pomodoro);
  const [isActive, setIsActive] = useState<boolean>(false);

  // Switch timer mode
  const switchMode = (mode: TimerMode) => {
    setIsActive(false);
    setTimerMode(mode);
    setTimeLeft(MODE_TIMES[mode]);
  };

  // Timer Tick Effect
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      // Play sound or record session if pomodoro
      if (timerMode === 'pomodoro') {
        recordPomodoroSession(25);
        alert('Pomodoro focus block completed! Take a 5-minute breather.');
        switchMode('shortBreak');
      } else {
        alert('Break completed! Ready for the next focus sprint?');
        switchMode('pomodoro');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, timerMode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODE_TIMES[timerMode]);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Task Manager State
  const [taskText, setTaskText] = useState('');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High'>('High');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskCategory, setTaskCategory] = useState<'Study' | 'Project' | 'Administrative' | 'Personal'>('Study');
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    addTask({
      text: taskText,
      priority: taskPriority,
      dueDate: taskDueDate,
      category: taskCategory,
    });
    setTaskText('');
  };

  const filteredTasks = data.tasks.filter((t) => {
    if (taskFilter === 'pending') return !t.completed;
    if (taskFilter === 'completed') return t.completed;
    return true;
  });

  const completedTasksCount = data.tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Productivity & Focus Workspace</h1>
          <p className="text-xs text-slate-400 mt-1">
            Pomodoro focus sessions, daily study streak, and priority task management for Thapar students.
          </p>
        </div>

        {/* Study Streak Badge */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <Flame size={20} className="text-amber-400 animate-pulse" />
          <div>
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Study Streak</span>
            <span className="text-sm font-extrabold text-white">{data.pomodoro.streakDays} Consecutive Days</span>
          </div>
        </div>
      </div>

      {/* Main Row: Pomodoro + Weekly Productivity Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pomodoro Timer Card (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Pomodoro Deep-Work Timer</h3>
            </div>

            {/* Mode Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <button
                onClick={() => switchMode('pomodoro')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  timerMode === 'pomodoro' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => switchMode('shortBreak')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  timerMode === 'shortBreak' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Short Break (5m)
              </button>
              <button
                onClick={() => switchMode('longBreak')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  timerMode === 'longBreak' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Long Break (15m)
              </button>
            </div>
          </div>

          {/* Big Digital Display */}
          <div className="py-6 flex flex-col items-center justify-center space-y-2">
            <span className="text-7xl sm:text-8xl font-black font-mono tracking-tight text-white drop-shadow-md">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400">
              {timerMode === 'pomodoro'
                ? isActive
                  ? '⚡ Focus in progress...'
                  : 'Ready to Sprint'
                : 'Relax & hydrate'}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold shadow-lg transition-all ${
                isActive
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isActive ? <Pause size={18} /> : <Play size={18} />}
              <span>{isActive ? 'Pause Session' : 'Start Focus'}</span>
            </button>

            <button
              onClick={resetTimer}
              className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
              title="Reset"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          {/* Session Progress Stats */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span>Sessions Today: <strong className="text-white">{data.pomodoro.sessionsToday} completed</strong></span>
            <span>Focus Time Today: <strong className="text-indigo-300">{data.pomodoro.totalMinutes} mins</strong></span>
          </div>
        </div>

        {/* Weekly Productivity & Activity Card (1 Col) */}
        <div className="p-6 rounded-2xl glass-card space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Weekly Productivity</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">Past 7 Days</span>
            </div>

            {/* Metrics List */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-slate-400">Tasks Completed</span>
                <span className="text-sm font-bold text-white">{completedTasksCount} / {data.tasks.length}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-slate-400">Study Sessions</span>
                <span className="text-sm font-bold text-white">{data.pomodoro.sessionsToday * 2 + 5} blocks</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Focus Time</span>
                <span className="text-sm font-bold text-indigo-400">
                  {Math.round((data.pomodoro.totalMinutes + 180) / 60)} hrs {(data.pomodoro.totalMinutes + 180) % 60}m
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-slate-400">Assignments Due Soon</span>
                <span className="text-sm font-bold text-amber-400">
                  {data.assignments.filter((a) => !a.completed).length} pending
                </span>
              </div>
            </div>

            {/* Visual Weekly Activity Bars */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">Weekly Activity Heatmap:</span>
              <div className="flex items-center justify-between gap-1.5">
                {data.pomodoro.history.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-md bg-indigo-500/20 border border-indigo-500/30 transition-all hover:bg-indigo-500/40"
                      style={{ height: `${Math.min(60, h.sessions * 10 + 15)}px` }}
                      title={`${h.date}: ${h.sessions} sessions`}
                    />
                    <span className="text-[9px] text-slate-500 font-mono">
                      {new Date(h.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300">
            💡 <strong>Study Tip:</strong> Consistent 25-minute sprints with active recall significantly boost retention for MST and EST exams.
          </div>
        </div>
      </div>

      {/* Task Manager Section */}
      <div className="p-6 rounded-2xl glass-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <CheckSquare size={18} className="text-indigo-400" />
            <h3 className="text-base font-bold text-white">Student Task & To-Do Manager</h3>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1.5">
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTaskFilter(f)}
                className={`px-3 py-1 rounded-xl text-xs font-medium capitalize transition-colors ${
                  taskFilter === f ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Task Input Form */}
        <form onSubmit={handleCreateTask} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <input
              type="text"
              required
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="What do you need to get done?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <select
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Study">Study</option>
              <option value="Project">Project</option>
              <option value="Administrative">Administrative</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-1">
            <button
              type="submit"
              className="w-full h-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center transition-colors shadow-sm"
              title="Add task"
            >
              <Plus size={16} />
            </button>
          </div>
        </form>

        {/* Task List */}
        <div className="space-y-2 pt-2">
          {filteredTasks.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">No tasks in this category.</div>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  t.completed
                    ? 'bg-white/[0.01] border-white/[0.04] opacity-60'
                    : 'bg-white/[0.03] border-white/[0.06] hover:border-indigo-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTask(t.id)}
                    className="text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {t.completed ? (
                      <CheckCircle2 size={17} className="text-emerald-400" />
                    ) : (
                      <Circle size={17} />
                    )}
                  </button>

                  <span className={`text-xs font-medium text-white ${t.completed ? 'line-through text-slate-400' : ''}`}>
                    {t.text}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-400 hidden sm:inline">
                    {t.category}
                  </span>

                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      t.priority === 'High'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {t.priority}
                  </span>

                  <span className="text-[11px] text-slate-500 hidden sm:inline">{t.dueDate}</span>

                  <button
                    onClick={() => deleteTask(t.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Productivity;

