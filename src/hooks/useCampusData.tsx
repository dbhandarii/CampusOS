import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CampusData,
  Profile,
  TimetableEntry,
  AttendanceRecord,
  Assignment,
  Exam,
  CampusEvent,
  Task,
  StudyResource,
  QuickLink,
  HostelInfo,
} from '../types/campus';
import { INITIAL_CAMPUS_DATA } from '../data/initialData';

type CampusContextType = {
  data: CampusData;
  setData: React.Dispatch<React.SetStateAction<CampusData>>;
  // Profile
  updateProfile: (profile: Partial<Profile>) => void;
  // Timetable
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  updateTimetableEntry: (id: string, entry: Partial<TimetableEntry>) => void;
  deleteTimetableEntry: (id: string) => void;
  importTimetableCSV: (entries: TimetableEntry[]) => void;
  // Attendance
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendanceRecord: (id: string, record: Partial<AttendanceRecord>) => void;
  logClassAttendance: (id: string, attended: boolean) => void;
  deleteAttendanceRecord: (id: string) => void;
  setAttendanceTarget: (target: number) => void;
  // Assignments
  addAssignment: (assignment: Omit<Assignment, 'id' | 'completed'>) => void;
  toggleAssignment: (id: string) => void;
  deleteAssignment: (id: string) => void;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  // Exams
  addExam: (exam: Omit<Exam, 'id'>) => void;
  toggleExamChecklist: (examId: string, checklistId: string) => void;
  deleteExam: (id: string) => void;
  // Tasks
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  // Events
  toggleEventRegistration: (id: string) => void;
  addEvent: (event: Omit<CampusEvent, 'id'>) => void;
  // Resources
  addStudyResource: (resource: Omit<StudyResource, 'id'>) => void;
  deleteStudyResource: (id: string) => void;
  // Quick Links
  addQuickLink: (link: Omit<QuickLink, 'id' | 'isCustom'>) => void;
  deleteQuickLink: (id: string) => void;
  // Hostel
  updateHostel: (hostel: Partial<HostelInfo>) => void;
  // Pomodoro
  recordPomodoroSession: (minutes: number) => void;
  // Reset
  resetDemoData: () => void;
};

const CampusContext = createContext<CampusContextType | undefined>(undefined);

const STORAGE_KEY = 'campusOSData_v1';

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CampusData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse campus data from localStorage', e);
    }
    return INITIAL_CAMPUS_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [data]);

  const updateProfile = (profile: Partial<Profile>) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
    }));
  };

  const addTimetableEntry = (entry: Omit<TimetableEntry, 'id'>) => {
    const newEntry: TimetableEntry = {
      ...entry,
      id: 'tt-' + Date.now(),
    };
    setData((prev) => ({
      ...prev,
      timetable: [...prev.timetable, newEntry],
    }));
  };

  const updateTimetableEntry = (id: string, entry: Partial<TimetableEntry>) => {
    setData((prev) => ({
      ...prev,
      timetable: prev.timetable.map((t) => (t.id === id ? { ...t, ...entry } : t)),
    }));
  };

  const deleteTimetableEntry = (id: string) => {
    setData((prev) => ({
      ...prev,
      timetable: prev.timetable.filter((t) => t.id !== id),
    }));
  };

  const importTimetableCSV = (entries: TimetableEntry[]) => {
    setData((prev) => ({
      ...prev,
      timetable: entries,
    }));
  };

  const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: 'att-' + Date.now(),
    };
    setData((prev) => ({
      ...prev,
      attendance: [...prev.attendance, newRecord],
    }));
  };

  const updateAttendanceRecord = (id: string, record: Partial<AttendanceRecord>) => {
    setData((prev) => ({
      ...prev,
      attendance: prev.attendance.map((a) => (a.id === id ? { ...a, ...record } : a)),
    }));
  };

  const logClassAttendance = (id: string, attended: boolean) => {
    setData((prev) => ({
      ...prev,
      attendance: prev.attendance.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            total: a.total + 1,
            attended: attended ? a.attended + 1 : a.attended,
          };
        }
        return a;
      }),
    }));
  };

  const deleteAttendanceRecord = (id: string) => {
    setData((prev) => ({
      ...prev,
      attendance: prev.attendance.filter((a) => a.id !== id),
    }));
  };

  const setAttendanceTarget = (target: number) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, attendanceTarget: target },
      attendance: prev.attendance.map((a) => ({ ...a, target })),
    }));
  };

  const addAssignment = (assignment: Omit<Assignment, 'id' | 'completed'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: 'asg-' + Date.now(),
      completed: false,
    };
    setData((prev) => ({
      ...prev,
      assignments: [newAssignment, ...prev.assignments],
    }));
  };

  const toggleAssignment = (id: string) => {
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) =>
        a.id === id ? { ...a, completed: !a.completed } : a
      ),
    }));
  };

  const deleteAssignment = (id: string) => {
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== id),
    }));
  };

  const updateAssignment = (id: string, assignment: Partial<Assignment>) => {
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) =>
        a.id === id ? { ...a, ...assignment } : a
      ),
    }));
  };

  const addExam = (exam: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...exam,
      id: 'ex-' + Date.now(),
    };
    setData((prev) => ({
      ...prev,
      exams: [...prev.exams, newExam],
    }));
  };

  const toggleExamChecklist = (examId: string, checklistId: string) => {
    setData((prev) => ({
      ...prev,
      exams: prev.exams.map((ex) => {
        if (ex.id === examId) {
          return {
            ...ex,
            checklist: ex.checklist.map((c) =>
              c.id === checklistId ? { ...c, done: !c.done } : c
            ),
          };
        }
        return ex;
      }),
    }));
  };

  const deleteExam = (id: string) => {
    setData((prev) => ({
      ...prev,
      exams: prev.exams.filter((ex) => ex.id !== id),
    }));
  };

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: 'task-' + Date.now(),
      completed: false,
    };
    setData((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  };

  const toggleTask = (id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  };

  const deleteTask = (id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  };

  const toggleEventRegistration = (id: string) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.map((ev) =>
        ev.id === id ? { ...ev, registered: !ev.registered } : ev
      ),
    }));
  };

  const addEvent = (event: Omit<CampusEvent, 'id'>) => {
    const newEvent: CampusEvent = {
      ...event,
      id: 'ev-' + Date.now(),
    };
    setData((prev) => ({
      ...prev,
      events: [newEvent, ...prev.events],
    }));
  };

  const addStudyResource = (resource: Omit<StudyResource, 'id'>) => {
    const newRes: StudyResource = {
      ...resource,
      id: 'res-' + Date.now(),
    };
    setData((prev) => ({
      ...prev,
      studyResources: [...prev.studyResources, newRes],
    }));
  };

  const deleteStudyResource = (id: string) => {
    setData((prev) => ({
      ...prev,
      studyResources: prev.studyResources.filter((r) => r.id !== id),
    }));
  };

  const addQuickLink = (link: Omit<QuickLink, 'id' | 'isCustom'>) => {
    const newLink: QuickLink = {
      ...link,
      id: 'ql-custom-' + Date.now(),
      isCustom: true,
    };
    setData((prev) => ({
      ...prev,
      quickLinks: [...prev.quickLinks, newLink],
    }));
  };

  const deleteQuickLink = (id: string) => {
    setData((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((l) => l.id !== id),
    }));
  };

  const updateHostel = (hostel: Partial<HostelInfo>) => {
    setData((prev) => ({
      ...prev,
      hostel: { ...prev.hostel, ...hostel },
    }));
  };

  const recordPomodoroSession = (minutes: number) => {
    setData((prev) => {
      const today = new Date().toISOString().split('T')[0];
      const history = [...prev.pomodoro.history];
      const todayIndex = history.findIndex((h) => h.date === today);

      if (todayIndex >= 0) {
        history[todayIndex].sessions += 1;
      } else {
        history.push({ date: today, sessions: 1 });
      }

      return {
        ...prev,
        pomodoro: {
          sessionsToday: prev.pomodoro.sessionsToday + 1,
          totalMinutes: prev.pomodoro.totalMinutes + minutes,
          streakDays: prev.pomodoro.streakDays,
          history: history.slice(-7),
        },
      };
    });
  };

  const resetDemoData = () => {
    setData(INITIAL_CAMPUS_DATA);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CAMPUS_DATA));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <CampusContext.Provider
      value={{
        data,
        setData,
        updateProfile,
        addTimetableEntry,
        updateTimetableEntry,
        deleteTimetableEntry,
        importTimetableCSV,
        addAttendanceRecord,
        updateAttendanceRecord,
        logClassAttendance,
        deleteAttendanceRecord,
        setAttendanceTarget,
        addAssignment,
        toggleAssignment,
        deleteAssignment,
        updateAssignment,
        addExam,
        toggleExamChecklist,
        deleteExam,
        addTask,
        toggleTask,
        deleteTask,
        toggleEventRegistration,
        addEvent,
        addStudyResource,
        deleteStudyResource,
        addQuickLink,
        deleteQuickLink,
        updateHostel,
        recordPomodoroSession,
        resetDemoData,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = () => {
  const ctx = useContext(CampusContext);
  if (!ctx) throw new Error('useCampus must be used within CampusProvider');
  return ctx;
};
