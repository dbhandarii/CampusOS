export type Profile = {
  name: string;
  rollNumber: string;
  degree: string;
  branch: string;
  year: string;
  semester: string;
  hostel: string;
  email: string;
  cgpa: string;
};

export type TimetableEntry = {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  start: string; // HH:MM (24hr e.g. "08:50")
  end: string;   // HH:MM (e.g. "09:40")
  subject: string;
  code: string;
  location: string;
  type: 'Lecture' | 'Tutorial' | 'Practical';
  faculty?: string;
  group?: string;
};

export type AttendanceRecord = {
  id: string;
  subject: string;
  code: string;
  total: number;
  attended: number;
  target: number; // default 75
};

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  description?: string;
};

export type ExamChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

export type Exam = {
  id: string;
  subject: string;
  code: string;
  type: 'MST' | 'EST' | 'Quiz' | 'Lab Practical';
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  checklist: ExamChecklistItem[];
};

export type CampusEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  society: string;
  category: 'Technical' | 'Cultural' | 'Workshop' | 'Hackathon' | 'Sports';
  link: string;
  registered?: boolean;
};

export type Announcement = {
  id: string;
  title: string;
  date: string;
  category: 'Academic' | 'Campus' | 'Society' | 'General';
  content: string;
  source: string;
  important: boolean;
};

export type Task = {
  id: string;
  text: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  completed: boolean;
  category: 'Study' | 'Project' | 'Administrative' | 'Personal';
};

export type StudyResource = {
  id: string;
  title: string;
  subject: string;
  url: string;
  notes: string;
};

export type QuickLink = {
  id: string;
  name: string;
  url: string;
  category: 'Academic Portals' | 'Library & Learning' | 'Campus Services' | 'Support & Administration' | 'Custom Links';
  description: string;
  icon?: string;
  isCustom?: boolean;
};

export type MessDayMenu = {
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
};

export type HostelInfo = {
  hostelName: string;
  room: string;
  caretakerContact: string;
  wardenContact: string;
  messMenu: MessDayMenu[];
};

export type PomodoroStats = {
  sessionsToday: number;
  totalMinutes: number;
  streakDays: number;
  history: { date: string; sessions: number }[];
};

export type CampusData = {
  profile: Profile;
  timetable: TimetableEntry[];
  attendance: AttendanceRecord[];
  assignments: Assignment[];
  exams: Exam[];
  events: CampusEvent[];
  announcements: Announcement[];
  tasks: Task[];
  studyResources: StudyResource[];
  quickLinks: QuickLink[];
  hostel: HostelInfo;
  pomodoro: PomodoroStats;
  settings: {
    attendanceTarget: number;
    theme: 'dark' | 'light';
    notificationsEnabled: boolean;
  };
};

