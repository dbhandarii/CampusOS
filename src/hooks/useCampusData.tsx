import React, { createContext, useContext, useEffect, useState } from 'react';

export type Profile = {
  name: string;
  rollNumber?: string;
  degree?: string;
  branch?: string;
  year?: string;
  semester?: string;
  hostel?: string;
};

export type TimetableEntry = {
  id: string;
  day: string; // Monday, Tuesday ...
  start: string; // HH:MM
  end: string; // HH:MM
  subject: string;
  code: string;
  location: string;
  type: 'Lecture' | 'Tutorial' | 'Practical';
  faculty?: string;
};

export type AttendanceRecord = {
  subject: string;
  total: number;
  attended: number;
};

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // ISO
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
};

export type Exam = {
  id: string;
  subject: string;
  type: string; // MST, EST, Quiz ...
  date: string; // ISO
  checklist: string[];
};

export type QuickLink = {
  id: string;
  name: string;
  url: string;
  category: string;
};

export type CampusData = {
  profile?: Profile;
  timetable: TimetableEntry[];
  attendance: AttendanceRecord[];
  assignments: Assignment[];
  exams: Exam[];
  quickLinks: QuickLink[];
  // you can add more sections later
};

type CampusContextProps = {
  data: CampusData;
  setData: React.Dispatch<React.SetStateAction<CampusData>>;
};

const CampusContext = createContext<CampusContextProps | undefined>(undefined);

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CampusData>({
    timetable: [],
    attendance: [],
    assignments: [],
    exams: [],
    quickLinks: [],
  });

  // load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('campusOSData');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        console.error('Failed to parse stored data');
      }
    } else {
      // initialise with demo data
      const demo: CampusData = {
        profile: { name: 'Demo Student', degree: 'B.Tech', branch: 'COE', year: '2', semester: '4' },
        timetable: [
          { id: '1', day: 'Monday', start: '09:00', end: '10:00', subject: 'Data Structures', code: 'CS2101', location: 'H-101', type: 'Lecture', faculty: 'Prof. Sharma' },
          { id: '2', day: 'Monday', start: '10:15', end: '11:15', subject: 'Analog Circuits', code: 'EE2102', location: 'H-102', type: 'Lecture' },
        ],
        attendance: [
          { subject: 'Data Structures', total: 30, attended: 24 },
          { subject: 'Analog Circuits', total: 30, attended: 28 },
        ],
        assignments: [
          { id: 'a1', title: 'DS Homework 3', subject: 'Data Structures', dueDate: new Date().toISOString(), priority: 'High', completed: false },
        ],
        exams: [],
        quickLinks: [],
      };
      setData(demo);
    }
  }, []);

  // persist on change
  useEffect(() => {
    localStorage.setItem('campusOSData', JSON.stringify(data));
  }, [data]);

  return (
    <CampusContext.Provider value={{ data, setData }}>{children}</CampusContext.Provider>
  );
};

export const useCampus = () => {
  const ctx = useContext(CampusContext);
  if (!ctx) throw new Error('useCampus must be used within CampusProvider');
  return ctx;
};

