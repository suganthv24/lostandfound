import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createItem } from '../services/itemApi';
import ImageUpload from '../components/ImageUpload';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Electronics', 'Documents', 'Personal Items', 'Accessories', 'Books', 'Other'];
const LOCATIONS = [
  'Main Library Hall', 
  'Student Center', 
  'Cafeteria', 
  'Science Block', 
  'Sports Complex', 
  'Administration', 
  'Hostel Block A', 
  'Hostel Block B'
];

const CreateItem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: LOCATIONS[0],
    date: new Date().toISOString().split('T')[0],
    type: 'lost',
    category: CATEGORIES[0],
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSubmit = {
        ...formData,
        imageUrl: formData.image,
        dateTime: new Date(formData.date).toISOString(),
      };
      await createItem(dataToSubmit);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please check your inputs.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const previewItem = useMemo(() => ({
    ...formData,
    _id: 'preview',
    createdAt: new Date().toISOString(),
  }), [formData]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <header className="mb-16 animate-fade-in max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">
          Report an <span className="glow-text">Artifact</span>
        </h1>
        <p className="text-xl text-muted leading-relaxed font-medium">
          Document a lost or found item within the university ecosystem. Our curators will verify the listing to maintain the integrity of our digital gallery.
        </p>
      </header>

      <div className="flex flex-col xl:flex-row gap-12 items-start">
        {/* Left Side: Form */}
        <form onSubmit={handleSubmit} className="flex-grow w-full space-y-16">
          {error && (
            <div className="bg-rose-500/10 border-l-4 border-rose-500 p-6 rounded-2xl animate-shake">
              <p className="text-rose-400 font-bold flex items-center gap-3">
                <span className="text-xl">⚠️</span> {error}
              </p>
            </div>
          )}

          {/* Type Toggle */}
          <section className="sidebar-card !rounded-[2.5rem]">
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-6 mb-4 px-4">Item Status</p>
            <div className="flex bg-black/40 p-1.5 rounded-[2rem] gap-1">
              {['lost', 'found'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, type: t }))}
                  className={`flex-1 py-4 rounded-[1.5rem] font-bold text-sm transition-all capitalize ${
                    formData.type === t 
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                      : 'text-muted hover:bg-white/5'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* Section 01 */}
          <section className="form-section">
            <div className="flex items-center gap-4 mb-8">
              <div className="section-number">01</div>
              <h2 className="text-2xl font-black tracking-tight">Identity & Taxonomy</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Item Name</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Silver MacBook Air M2"
                  className="input-field"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Category</label>
                <select 
                  name="category"
                  className="input-field"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Section 02 */}
          <section className="form-section">
            <div className="flex items-center gap-4 mb-8">
              <div className="section-number">02</div>
              <h2 className="text-2xl font-black tracking-tight">Visual Proof</h2>
            </div>
            <div className="glass-card !p-8 border-dashed border-2 bg-indigo-500/[0.02] hover:bg-indigo-500/[0.05] transition-colors">
              <ImageUpload onUpload={handleImageUpload} />
            </div>
          </section>

          {/* Section 03 */}
          <section className="form-section">
            <div className="flex items-center gap-4 mb-8">
              <div className="section-number">03</div>
              <h2 className="text-2xl font-black tracking-tight">Context & Provenance</h2>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Detailed Description</label>
                <textarea
                  name="description"
                  required
                  rows="5"
                  placeholder="Describe specific markings, stickers, or distinguishing features..."
                  className="input-field min-h-[160px] resize-none"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Campus Location</label>
                  <select 
                    name="location"
                    className="input-field"
                    value={formData.location}
                    onChange={handleChange}
                  >
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Date & Approximate Time</label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="input-field"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between pt-10 border-t border-white/5">
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="text-muted hover:text-white font-bold text-sm transition-colors px-6"
            >
              Discard Draft
            </button>
            <button
              type="submit"
              disabled={loading || !formData.image}
              className={`btn-primary !px-12 !py-5 text-lg min-w-[240px] ${
                (loading || !formData.image) ? 'opacity-50 cursor-not-allowed grayscale' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Submit Report'}
            </button>
          </div>
        </form>

        {/* Right Side: Sidebar */}
        <aside className="w-full xl:w-[420px] space-y-8 sticky top-24">
          {/* Institutional Privacy Card */}
          <div className="sidebar-card border-emerald-500/10 !bg-emerald-500/[0.02]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">🛡️</div>
              <h3 className="font-bold text-emerald-400">Institutional Privacy</h3>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Artifacts reported are only visible to <span className="text-emerald-400 font-bold">verified university accounts</span>. Your personal contact data is encrypted and only shared when you approve a claim request.
            </p>
          </div>

          {/* Live Preview Card */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] px-2 flex justify-between">
              <span>Preview Artifact</span>
              <span className="text-indigo-400 animate-pulse">Live</span>
            </p>
            <div className="pointer-events-none opacity-80 scale-[0.95] origin-top">
              <ItemCard item={previewItem} />
            </div>
          </div>

          {/* Submission Tips */}
          <div className="sidebar-card">
            <h3 className="font-bold mb-6 text-sm flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
               Submission Tips
            </h3>
            <ul className="space-y-4">
              {[
                { n: '01', t: 'Use high-contrast photos against neutral backgrounds.' },
                { n: '02', t: 'Do not include sensitive personal IDs in public photos.' },
                { n: '03', t: 'Be as specific as possible with the "Campus Location" dropdown.' }
              ].map(tip => (
                <li key={tip.n} className="flex gap-4">
                  <span className="text-[10px] font-black text-indigo-400 pt-1">{tip.n}</span>
                  <p className="text-xs text-muted leading-relaxed">{tip.t}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <footer className="mt-24 pt-12 border-t border-white/5 flex flex-wrap gap-8 text-[10px] font-bold text-muted uppercase tracking-widest">
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Campus Safety</a>
        <a href="#" className="hover:text-white transition-colors">Contact Support</a>
        <span className="ml-auto opacity-30">© 2026 University LostAndFound ecosystem</span>
      </footer>
    </div>
  );
};

export default CreateItem;

