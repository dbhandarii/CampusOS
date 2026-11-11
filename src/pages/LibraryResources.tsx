import React, { useState } from 'react';
import {
  Library,
  BookOpen,
  FileText,
  Archive,
  Key,
  Video,
  ExternalLink,
  Plus,
  Trash2,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { useCampus } from '../hooks/useCampusData';

const OFFICIAL_LIBRARY_RESOURCES = [
  {
    name: 'Nava Nalanda Central Library',
    desc: 'Main university library portal. Access OPAC book search catalog, library timings, and floor guides.',
    url: 'https://library.thapar.edu/',
    icon: Library,
    badge: 'Campus Central',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    name: 'TIET eLibrary (RefRead)',
    desc: 'Digital repository offering remote access to over 50,000+ e-books, Springer & IEEE journals, and scholarly theses.',
    url: 'https://tiet.refread.com/#/home',
    icon: FileText,
    badge: 'Digital Access',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    name: 'Past Year Question Papers Archive',
    desc: 'Official Central Library archive of MST and EST question papers sorted by branch and semester for exam preparation.',
    url: 'https://cl.thapar.edu/ques.php',
    icon: Archive,
    badge: 'Exam Prep',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    name: 'Remote Library Access (IDP Shibboleth)',
    desc: 'Secure institutional identity provider allowing students to access subscription research papers from home and hostels.',
    url: 'https://idp.thapar.edu/',
    icon: Key,
    badge: 'Off-Campus Proxy',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    name: 'NPTEL Local Chapter & SWAYAM',
    desc: 'Free access to IIT/IISc video lectures, course transcripts, and registration for credit-transfer MOOC certifications.',
    url: 'https://nptel.ac.in/',
    icon: Video,
    badge: 'MOOCs & Credits',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
];

const LibraryResources: React.FC = () => {
  const { data, addStudyResource, deleteStudyResource } = useCampus();

  const [modalOpen, setModalOpen] = useState(false);
  const [resTitle, setResTitle] = useState('');
  const [resSubject, setResSubject] = useState(data.attendance[0]?.subject || 'Data Structures & Algorithms');
  const [resUrl, setResUrl] = useState('');
  const [resNotes, setResNotes] = useState('');

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !resUrl.trim()) return;

    addStudyResource({
      title: resTitle,
      subject: resSubject,
      url: resUrl,
      notes: resNotes,
    });

    setResTitle('');
    setResUrl('');
    setResNotes('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Library & Academic Resources</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access Nava Nalanda Central Library portals, past year papers, digital repositories, and organize your personal study links.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus size={15} /> Save Study Resource
        </button>
      </div>

      {/* Official Thapar Library Resources Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <BookOpen size={16} className="text-indigo-400" /> Official Thapar University Library Portals
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {OFFICIAL_LIBRARY_RESOURCES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="p-5 rounded-2xl glass-card hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl border ${item.color} group-hover:scale-110 transition-transform`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-400">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06]">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-200 border border-white/[0.08] transition-colors"
                  >
                    Open Resource <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Study Resource Organiser */}
      <div className="space-y-4 pt-4 border-t border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bookmark size={16} className="text-purple-400" /> Personal Study-Resource Organiser
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Save and organize drive links, GitHub repos, YouTube playlists, and lecture notes by subject.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            <Plus size={13} /> Add Link
          </button>
        </div>

        {data.studyResources.length === 0 ? (
          <div className="p-8 text-center rounded-2xl glass-card text-xs text-slate-400">
            No saved study links yet. Click &apos;Save Study Resource&apos; to bookmark textbooks, notes, and lecture slides.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.studyResources.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-xl glass-card hover:border-purple-500/30 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block">
                        {res.subject}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-0.5">{res.title}</h4>
                    </div>
                    <button
                      onClick={() => deleteStudyResource(res.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {res.notes && <p className="text-xs text-slate-400 line-clamp-2">{res.notes}</p>}
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    Open Link <ExternalLink size={11} />
                  </a>
                  <span className="text-[10px] text-slate-500">Saved Bookmark</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Study Resource Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#12131c] border border-white/[0.12] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-semibold text-white">Save Study Resource</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddResource} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="e.g. Operating Systems OSTEP Book Chapters"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <select
                  value={resSubject}
                  onChange={(e) => setResSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {data.attendance.map((att) => (
                    <option key={att.id} value={att.subject}>
                      {att.subject}
                    </option>
                  ))}
                  <option value="General Reference">General Reference</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL / Link</label>
                <input
                  type="url"
                  required
                  value={resUrl}
                  onChange={(e) => setResUrl(e.target.value)}
                  placeholder="https://pages.cs.wisc.edu/~remzi/OSTEP/"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Description</label>
                <textarea
                  rows={2}
                  value={resNotes}
                  onChange={(e) => setResNotes(e.target.value)}
                  placeholder="e.g. Recommended by instructor for concurrency and semaphores."
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
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryResources;

