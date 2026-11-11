import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  User,
  Clock,
  Sparkles,
  ExternalLink,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronDown,
} from 'lucide-react';
import { useCampus } from '../hooks/useCampusData';
import { useNavigate } from 'react-router-dom';

const TopBar: React.FC = () => {
  const { data, resetDemoData } = useCampus();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Time based greeting
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  // Filter search results
  const q = searchQuery.toLowerCase().trim();
  const searchResults = searchQuery
    ? {
        timetable: data.timetable.filter(
          (t) =>
            t.subject.toLowerCase().includes(q) ||
            t.code.toLowerCase().includes(q) ||
            t.location.toLowerCase().includes(q)
        ),
        assignments: data.assignments.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.subject.toLowerCase().includes(q)
        ),
        quickLinks: data.quickLinks.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.category.toLowerCase().includes(q) ||
            l.description.toLowerCase().includes(q)
        ),
        attendance: data.attendance.filter(
          (att) =>
            att.subject.toLowerCase().includes(q) ||
            att.code.toLowerCase().includes(q)
        ),
      }
    : null;

  const totalResultsCount = searchResults
    ? searchResults.timetable.length +
      searchResults.assignments.length +
      searchResults.quickLinks.length +
      searchResults.attendance.length
    : 0;

  // Unread or important announcements
  const importantAnnouncements = data.announcements;

  return (
    <>
      <header className="h-16 px-6 glass-panel border-b border-white/[0.08] flex items-center justify-between sticky top-0 z-30">
        {/* Left: Greeting & Date */}
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 font-medium">
                {getGreeting()},
              </span>
              <span className="text-sm font-semibold text-white">
                {data.profile.name.split(' ')[0]}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {data.profile.branch.includes('COE') ? 'TIET COE' : data.profile.branch} • Sem {data.profile.semester.replace(/\D/g, '') || '5'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all text-xs text-slate-400 group"
          >
            <div className="flex items-center gap-2.5">
              <Search size={14} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span>Search subjects, assignments, portals...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-slate-400 border border-white/[0.1]">
              <span className="text-[9px]">Ctrl</span> K
            </kbd>
          </button>
        </div>

        {/* Right: Actions (Search Mobile, Notifications, Theme, Profile) */}
        <div className="flex items-center gap-2.5">
          {/* Mobile Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] md:hidden transition-colors"
            title="Search"
          >
            <Search size={18} />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors relative"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#12131c] border border-white/[0.1] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-indigo-400" />
                    <h4 className="text-sm font-semibold text-white">Campus Notifications</h4>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                    {importantAnnouncements.length} updates
                  </span>
                </div>

                <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {importantAnnouncements.map((anc) => (
                    <div
                      key={anc.id}
                      className="p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          anc.important ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {anc.category}
                        </span>
                        <span className="text-[10px] text-slate-500">{anc.date}</span>
                      </div>
                      <h5 className="text-xs font-medium text-slate-200 mt-1.5">{anc.title}</h5>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{anc.content}</p>
                      <span className="text-[10px] text-indigo-400/80 mt-1.5 block">Source: {anc.source}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex justify-between items-center text-xs">
                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate('/campus-life');
                    }}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    View all notices →
                  </button>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-slate-500 hover:text-slate-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Profile Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/[0.08]"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {data.profile.name.charAt(0)}
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#12131c] border border-white/[0.1] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2 py-2 border-b border-white/[0.08]">
                  <p className="text-sm font-semibold text-white">{data.profile.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{data.profile.rollNumber}</p>
                  <p className="text-xs text-indigo-400 mt-0.5">{data.profile.branch}</p>
                  <p className="text-[11px] text-slate-500">{data.profile.hostel}</p>
                </div>

                <div className="mt-2 space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <User size={14} className="text-slate-400" />
                    <span>Edit Student Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/campus-life');
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <Clock size={14} className="text-slate-400" />
                    <span>Hostel & Mess Menu</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/quick-links');
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <ExternalLink size={14} className="text-slate-400" />
                    <span>Thapar Portals Directory</span>
                  </button>

                  <div className="pt-2 border-t border-white/[0.08]">
                    <button
                      onClick={() => {
                        if (confirm('Reset CampusOS to default Thapar COE sample demo data?')) {
                          resetDemoData();
                          setProfileOpen(false);
                        }
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-left text-[11px]"
                    >
                      <Sparkles size={13} />
                      <span>Reset to Demo Data</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal (Ctrl+K) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl bg-[#12131c] border border-white/[0.12] shadow-2xl overflow-hidden">
            {/* Input Header */}
            <div className="p-4 border-b border-white/[0.08] flex items-center gap-3">
              <Search size={18} className="text-indigo-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search timetable classes, assignments, portals, subjects..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Results or Suggestions */}
            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {!searchQuery && (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-400 font-medium">Quick suggestions:</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {['Data Structures', 'Operating Systems', 'WebKiosk', 'LMS', 'Hostel J', 'Past Papers'].map(
                      (item) => (
                        <button
                          key={item}
                          onClick={() => setSearchQuery(item)}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-300 border border-white/[0.06] transition-colors"
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {searchQuery && totalResultsCount === 0 && (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No matching classes, assignments, or portals found for &quot;{searchQuery}&quot;
                </div>
              )}

              {searchResults && searchResults.timetable.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar size={13} className="text-indigo-400" /> Timetable Classes
                  </h5>
                  <div className="space-y-1.5">
                    {searchResults.timetable.map((tt) => (
                      <div
                        key={tt.id}
                        onClick={() => {
                          setSearchOpen(false);
                          navigate('/academics/timetable');
                        }}
                        className="p-2.5 rounded-lg bg-white/[0.03] hover:bg-indigo-600/10 hover:border-indigo-500/30 border border-white/[0.05] cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-medium text-white">{tt.subject} ({tt.code})</p>
                          <p className="text-[11px] text-slate-400">{tt.day} • {tt.start} - {tt.end} • {tt.location}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-slate-300">
                          {tt.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults && searchResults.assignments.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-amber-400" /> Assignments
                  </h5>
                  <div className="space-y-1.5">
                    {searchResults.assignments.map((asg) => (
                      <div
                        key={asg.id}
                        onClick={() => {
                          setSearchOpen(false);
                          navigate('/academics/assignments');
                        }}
                        className="p-2.5 rounded-lg bg-white/[0.03] hover:bg-amber-500/10 hover:border-amber-500/30 border border-white/[0.05] cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-medium text-white">{asg.title}</p>
                          <p className="text-[11px] text-slate-400">{asg.subject} • Due {asg.dueDate}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                          asg.priority === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {asg.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults && searchResults.quickLinks.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ExternalLink size={13} className="text-blue-400" /> Thapar Portals & Quick Links
                  </h5>
                  <div className="space-y-1.5">
                    {searchResults.quickLinks.map((ql) => (
                      <a
                        key={ql.id}
                        href={ql.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-lg bg-white/[0.03] hover:bg-blue-600/10 hover:border-blue-500/30 border border-white/[0.05] flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors flex items-center gap-1">
                            {ql.name}
                            <ExternalLink size={11} className="text-slate-500" />
                          </p>
                          <p className="text-[11px] text-slate-400">{ql.description}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-slate-300">
                          {ql.category}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-black/40 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
              <span>Press <kbd className="font-mono text-slate-400">Esc</kbd> to close</span>
              <span>CampusOS Local Search</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;

