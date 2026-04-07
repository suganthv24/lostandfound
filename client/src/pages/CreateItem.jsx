import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../services/itemApi';
import ImageUpload from '../components/ImageUpload';

const CreateItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    type: 'lost',
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
        dateTime: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      };
      await createItem(dataToSubmit);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create item. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="glass-card !p-0 overflow-hidden">
        <div className="p-8 md:p-12 border-b border-glass-border">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Report an <span className="glow-text">Item</span></h1>
          <p className="text-muted leading-relaxed">Fill in the details to help the community find or return an item.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
          {error && (
            <div className="bg-rose-500/10 border-l-4 border-rose-500 p-4 rounded-xl animate-shake">
              <p className="text-rose-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted uppercase tracking-wider pl-1">Item Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Lost Black Wallet"
                  className="input-field"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted uppercase tracking-wider pl-1">Type</label>
                <div className="flex gap-4">
                  <label className="flex-1 group cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="lost"
                      className="hidden peer"
                      checked={formData.type === 'lost'}
                      onChange={handleChange}
                    />
                    <div className="text-center p-4 rounded-2xl border border-glass-border bg-input-bg peer-checked:border-rose-500/50 peer-checked:bg-rose-500/10 transition-all font-bold text-muted peer-checked:text-rose-400 group-hover:border-rose-500/30">
                      LOST
                    </div>
                  </label>
                  <label className="flex-1 group cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="found"
                      className="hidden peer"
                      checked={formData.type === 'found'}
                      onChange={handleChange}
                    />
                    <div className="text-center p-4 rounded-2xl border border-glass-border bg-input-bg peer-checked:border-emerald-500/50 peer-checked:bg-emerald-500/10 transition-all font-bold text-muted peer-checked:text-emerald-400 group-hover:border-emerald-500/30">
                      FOUND
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted uppercase tracking-wider pl-1">Location</label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="Where was it seen?"
                  className="input-field"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted uppercase tracking-wider pl-1">Date</label>
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

            <div className="space-y-6">
              <label className="text-sm font-bold text-muted uppercase tracking-wider pl-1">Item Image</label>
              <div className="glass-card !p-6 border-dashed border-2 border-glass-border bg-input-bg/30">
                <ImageUpload onUpload={handleImageUpload} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted uppercase tracking-wider pl-1">Description</label>
            <textarea
              name="description"
              required
              rows="4"
              placeholder="Provide more details like color, brand, or specific markings..."
              className="input-field min-h-[120px] resize-none"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary py-5 text-lg ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Reporting...</span>
                </div>
              ) : (
                <span>Report Item</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;

