import React, { useState } from 'react';
import {
  ExternalLink,
  Plus,
  Trash2,
  Globe,
  ShieldCheck,
  BookOpen,
  Compass,
  Library,
  FileText,
  Archive,
  Key,
  Users,
  LifeBuoy,
  CreditCard,
  Video,
  Search,
} from 'lucide-react';
import { useCampus } from '../hooks/useCampusData';
import { QuickLink } from '../types/campus';

const CATEGORIES = [
  'All',
  'Academic Portals',
  'Library & Learning',
  'Campus Services',
  'Support & Administration',
  'Custom Links',
] as const;

const QuickLinks: React.FC = () => {
  const { data, addQuickLink, deleteQuickLink } = useCampus();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkCategory, setLinkCategory] = useState<QuickLink['category']>('Custom Links');
  const [linkDesc, setLinkDesc] = useState('');

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkName.trim() || !linkUrl.trim()) return;

    addQuickLink({
      name: linkName,
      url: linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`,
      category: linkCategory,
      description: linkDesc || 'Custom student shortcut',
      icon: 'link',
    });

    setLinkName('');
    setLinkUrl('');
    setLinkDesc('');
    setModalOpen(false);
  };

  const filteredLinks = data.quickLinks.filter((l) => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Custom Links'
        ? l.isCustom
        : l.category === selectedCategory;

    const matchesSearch =
      l.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.url.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Thapar Official Portals & Quick Links</h1>
          <p className="text-xs text-slate-400 mt-1">
            Directory of essential Thapar Institute digital services. All links open securely in external tabs.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus size={15} /> Add Custom Link
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search portal names..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLinks.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl glass-card hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-indigo-300">
                  {item.category}
                </span>

                {item.isCustom && (
                  <button
                    onClick={() => deleteQuickLink(item.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                    title="Delete custom link"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06]">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 border border-white/[0.08] transition-colors group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent"
              >
                Launch Portal <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Link Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#12131c] border border-white/[0.12] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-semibold text-white">Add Custom Portal Link</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLink} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Portal Name</label>
                <input
                  type="text"
                  required
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  placeholder="e.g. TIET Coding Club GitHub"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Destination URL</label>
                <input
                  type="url"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={linkCategory}
                  onChange={(e) => setLinkCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a1b26] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Academic Portals">Academic Portals</option>
                  <option value="Library & Learning">Library & Learning</option>
                  <option value="Campus Services">Campus Services</option>
                  <option value="Support & Administration">Support & Administration</option>
                  <option value="Custom Links">Custom Links</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={linkDesc}
                  onChange={(e) => setLinkDesc(e.target.value)}
                  placeholder="e.g. Shortcut to lab resources"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickLinks;

