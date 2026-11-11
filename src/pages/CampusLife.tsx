import React, { useState } from 'react';
import {
  Compass,
  ExternalLink,
  Calendar,
  Search,
  Key,
  Moon,
  Home,
  Users,
  Plus,
  Phone,
  Utensils,
  Bell,
  Clock,
  Sparkles,
  MapPin,
  Tag,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useCampus } from '../hooks/useCampusData';

const CAMPUS_CONNECT_SHORTCUTS = [
  {
    title: 'Event Calendar',
    desc: 'Browse official upcoming society workshops, guest lectures & hackathons.',
    url: 'https://campusconnect.thapar.edu/',
    icon: Calendar,
    tag: 'Campus Connect',
  },
  {
    title: 'Lost & Found Portal',
    desc: 'Report lost ID cards, calculators, earphones or claim discovered items.',
    url: 'https://campusconnect.thapar.edu/',
    icon: Search,
    tag: 'Services',
  },
  {
    title: 'Venue & Auditorium Booking',
    desc: 'Reserve TAN Auditorium, C-Hall, LP classrooms for society meetings.',
    url: 'https://campusconnect.thapar.edu/',
    icon: MapPin,
    tag: 'Infrastructure',
  },
  {
    title: 'Society Night Pass',
    desc: 'Apply for official nocturnal passes for festival preparations & lab access.',
    url: 'https://campusconnect.thapar.edu/',
    icon: Moon,
    tag: 'Permissions',
  },
  {
    title: 'Library Night Pass',
    desc: 'Generate approved barcode for 24x7 Nava Nalanda Central Library entry.',
    url: 'https://campusconnect.thapar.edu/',
    icon: Key,
    tag: 'Library',
  },
  {
    title: 'Hostel Guest Room Booking',
    desc: 'Book verified campus guest house and visitor hostel suites for parents.',
    url: 'https://campusconnect.thapar.edu/',
    icon: Home,
    tag: 'Hostel Life',
  },
];

const CampusLife: React.FC = () => {
  const { data, toggleEventRegistration, addEvent, updateHostel } = useCampus();

  const [activeTab, setActiveTab] = useState<'connect' | 'hostel' | 'events' | 'announcements'>('connect');

  // Event filter
  const [eventCategory, setEventCategory] = useState<string>('All');
  const [addEventOpen, setAddEventOpen] = useState(false);

  // New Event Form
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('05:30 PM');
  const [newEventVenue, setNewEventVenue] = useState('TAN Auditorium');
  const [newEventSociety, setNewEventSociety] = useState('TIET Technical Society');
  const [newEventCategory, setNewEventCategory] = useState<'Technical' | 'Cultural' | 'Workshop' | 'Hackathon' | 'Sports'>('Technical');

  // Hostel Edit State
  const [isEditingHostel, setIsEditingHostel] = useState(false);
  const [hostelName, setHostelName] = useState(data.hostel.hostelName);
  const [roomNumber, setRoomNumber] = useState(data.hostel.room);
  const [caretakerContact, setCaretakerContact] = useState(data.hostel.caretakerContact);
  const [wardenContact, setWardenContact] = useState(data.hostel.wardenContact);

  const saveHostel = (e: React.FormEvent) => {
    e.preventDefault();
    updateHostel({
      hostelName,
      room: roomNumber,
      caretakerContact,
      wardenContact,
    });
    setIsEditingHostel(false);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    addEvent({
      title: newEventTitle,
      date: newEventDate || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      time: newEventTime,
      venue: newEventVenue,
      society: newEventSociety,
      category: newEventCategory,
      link: 'https://campusconnect.thapar.edu/',
      registered: false,
    });
    setNewEventTitle('');
    setAddEventOpen(false);
  };

  // Filtered Events
  const filteredEvents = data.events.filter((ev) => {
    if (eventCategory === 'All') return true;
    return ev.category === eventCategory;
  });

  // Current day mess menu
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = dayNames[new Date().getDay()];
  const todayMenu = data.hostel.messMenu.find((m) => m.day === todayDayName) || data.hostel.messMenu[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Campus Life & Student Services</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access official Campus Connect services, manage your hostel details & daily mess menu, and explore campus societies.
          </p>
        </div>

        <a
          href="https://campusconnect.thapar.edu/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all"
        >
          <Compass size={15} /> Open Campus Connect <ExternalLink size={12} />
        </a>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/[0.06]">
        {[
          { key: 'connect', label: 'Campus Connect Shortcuts' },
          { key: 'hostel', label: 'Hostel & Mess Menu' },
          { key: 'events', label: 'Societies & Campus Events' },
          { key: 'announcements', label: 'Notices & Announcements' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-medium shrink-0 transition-all ${
              activeTab === tab.key
                ? 'bg-white/[0.1] text-white border border-white/[0.15] shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION A: Campus Connect Shortcuts */}
      {activeTab === 'connect' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
            <strong>Official Integration Note:</strong> The cards below connect directly to official TIET Campus Connect platforms. Clicking any shortcut securely opens the respective portal in a new tab without storing your login credentials.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAMPUS_CONNECT_SHORTCUTS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-2xl glass-card hover:border-indigo-500/40 transition-all flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                        <Icon size={22} />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/[0.06] text-slate-400">
                        {item.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-indigo-400 font-medium">
                    <span>Open in Campus Connect</span>
                    <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION B: Hostel Information & Mess Menu */}
      {activeTab === 'hostel' && (
        <div className="space-y-6">
          {/* Hostel Summary Card */}
          <div className="p-6 rounded-2xl glass-card space-y-4 border border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <Home size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{data.hostel.hostelName}</h3>
                  <p className="text-xs text-slate-400">{data.hostel.room}</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditingHostel(!isEditingHostel)}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-slate-200 transition-colors"
              >
                {isEditingHostel ? 'Cancel' : 'Edit Hostel / Room Details'}
              </button>
            </div>

            {isEditingHostel ? (
              <form onSubmit={saveHostel} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hostel Name</label>
                  <input
                    type="text"
                    value={hostelName}
                    onChange={(e) => setHostelName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Room Details</label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Caretaker Contact</label>
                  <input
                    type="text"
                    value={caretakerContact}
                    onChange={(e) => setCaretakerContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Warden Helpline</label>
                  <input
                    type="text"
                    value={wardenContact}
                    onChange={(e) => setWardenContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white"
                  />
                </div>
                <div className="col-span-full flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-500 block">Hostel Caretaker Office</span>
                  <span className="text-slate-200 font-mono font-medium block mt-1">
                    {data.hostel.caretakerContact}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-500 block">Hostel Warden Desk</span>
                  <span className="text-slate-200 font-mono font-medium block mt-1">
                    {data.hostel.wardenContact}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-500 block">Official Support</span>
                  <a
                    href="https://eticket.thapar.edu/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 font-medium block mt-1"
                  >
                    Raise eTicket for maintenance →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Mess Menu Table */}
          <div className="p-6 rounded-2xl glass-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Utensils size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Weekly Mess Food Schedule</h3>
                  <p className="text-xs text-slate-400">Vegetarian & non-vegetarian rotational hostel diet</p>
                </div>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                Today is {todayDayName}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Day</th>
                    <th className="py-2.5 px-3">Breakfast (07:30 - 09:30)</th>
                    <th className="py-2.5 px-3">Lunch (12:00 - 02:00)</th>
                    <th className="py-2.5 px-3">Snacks (05:00 - 06:15)</th>
                    <th className="py-2.5 px-3">Dinner (07:30 - 09:30)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {data.hostel.messMenu.map((m) => {
                    const isToday = m.day === todayDayName;
                    return (
                      <tr
                        key={m.day}
                        className={`transition-colors ${
                          isToday ? 'bg-indigo-950/25 font-medium' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <td className="py-3 px-3 text-white font-semibold flex items-center gap-1.5">
                          {m.day} {isToday && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                        </td>
                        <td className="py-3 px-3 text-slate-300">{m.breakfast}</td>
                        <td className="py-3 px-3 text-slate-300">{m.lunch}</td>
                        <td className="py-3 px-3 text-slate-300">{m.snacks}</td>
                        <td className="py-3 px-3 text-slate-300">{m.dinner}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION C: Campus & Society Events */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['All', 'Hackathon', 'Technical', 'Cultural', 'Sports', 'Workshop'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setEventCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    eventCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setAddEventOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
            >
              <Plus size={14} /> Add Personal Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl glass-card hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        item.category === 'Hackathon'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : item.category === 'Technical'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.category}
                    </span>

                    <button
                      onClick={() => toggleEventRegistration(item.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        item.registered
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.1]'
                      }`}
                    >
                      {item.registered ? '✓ Registered' : '+ Register'}
                    </button>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-indigo-300 font-medium mt-1">Organized by {item.society}</p>
                  </div>

                  <div className="space-y-1 text-xs text-slate-400">
                    <p className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-500" /> {item.date} • {item.time}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-500" /> {item.venue}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    Campus Connect details <ExternalLink size={11} />
                  </a>
                  <span className="text-[10px] text-slate-500 font-mono">TIET Patiala</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Personal Event Modal */}
          {addEventOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
              <div className="w-full max-w-md rounded-2xl bg-[#12131c] border border-white/[0.12] p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <h3 className="text-base font-semibold text-white">Add Campus Event</h3>
                  <button onClick={() => setAddEventOpen(false)} className="text-slate-400 hover:text-white">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddEvent} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title</label>
                    <input
                      type="text"
                      required
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="e.g. ACM Competitive Coding Contest"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                      <select
                        value={newEventCategory}
                        onChange={(e) => setNewEventCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Technical">Technical</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Sports">Sports</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Organizing Society</label>
                      <input
                        type="text"
                        value={newEventSociety}
                        onChange={(e) => setNewEventSociety(e.target.value)}
                        placeholder="e.g. MLSC / ACM"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Time</label>
                      <input
                        type="text"
                        value={newEventTime}
                        onChange={(e) => setNewEventTime(e.target.value)}
                        placeholder="e.g. 05:00 PM"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Venue</label>
                    <input
                      type="text"
                      value={newEventVenue}
                      onChange={(e) => setNewEventVenue(e.target.value)}
                      placeholder="e.g. TAN Auditorium / C-Hall"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAddEventOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                    >
                      Save Event
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION D: Announcements & Campus Notices */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Showing verified campus broadcast alerts and administration circulars (Sample demo records).
            </span>
            <span className="text-indigo-400 font-mono">TIET Circulars</span>
          </div>

          <div className="space-y-3">
            {data.announcements.map((anc) => (
              <div
                key={anc.id}
                className={`p-5 rounded-2xl glass-card transition-all space-y-2.5 border ${
                  anc.important ? 'border-rose-500/30 bg-rose-950/10' : 'border-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        anc.important ? 'bg-rose-500/20 text-rose-300' : 'bg-white/[0.06] text-slate-400'
                      }`}
                    >
                      {anc.category}
                    </span>
                    {anc.important && (
                      <span className="text-[10px] font-bold text-rose-400 animate-pulse">Important</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{anc.date}</span>
                </div>

                <h3 className="text-sm font-bold text-white">{anc.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{anc.content}</p>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-indigo-300">Issued by: {anc.source}</span>
                  <span className="text-slate-500">Official Communication</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusLife;

