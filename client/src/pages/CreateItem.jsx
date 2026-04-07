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
      await createItem(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create item. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 animate-slide-up">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-8 text-white">
          <h1 className="text-3xl font-bold">Report an Item</h1>
          <p className="mt-2 text-blue-100 opacity-90">Fill in the details to help the community find or return an item.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Item Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Lost Black Wallet"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                <div className="flex space-x-4">
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="type"
                      value="lost"
                      className="hidden peer"
                      checked={formData.type === 'lost'}
                      onChange={handleChange}
                    />
                    <div className="text-center p-3 rounded-xl border-2 border-gray-100 peer-checked:border-red-500 peer-checked:bg-red-50 cursor-pointer transition-all font-bold text-gray-500 peer-checked:text-red-600">
                      LOST
                    </div>
                  </label>
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="type"
                      value="found"
                      className="hidden peer"
                      checked={formData.type === 'found'}
                      onChange={handleChange}
                    />
                    <div className="text-center p-3 rounded-xl border-2 border-gray-100 peer-checked:border-green-500 peer-checked:bg-green-50 cursor-pointer transition-all font-bold text-gray-500 peer-checked:text-green-600">
                      FOUND
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="Where was it seen?"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <ImageUpload onUpload={handleImageUpload} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              required
              rows="4"
              placeholder="Provide more details like color, brand, or specific markings..."
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-2 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
                <span>Reporting...</span>
              </>
            ) : (
              <span>Report Item</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;

