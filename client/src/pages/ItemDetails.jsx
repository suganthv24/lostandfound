import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, contactFound } from '../services/itemApi';
import Loader from '../components/Loader';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getItemById(id);
        setItem(data);
      } catch (err) {
        setError('Item not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleContact = async () => {
    try {
      setContactLoading(true);
      await contactFound(id);
      setContactSuccess(true);
    } catch (err) {
      alert('Failed to send contact info. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-800">{error}</h2>
      <button onClick={() => navigate('/')} className="mt-4 text-blue-600 font-bold hover:underline">Back to Home</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 animate-fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row shadow-blue-100">
        <div className="md:w-1/2 h-[400px] md:h-auto overflow-hidden">
          <img 
            src={item.image || 'https://via.placeholder.com/800x600?text=No+Image'} 
            alt={item.title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
        
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
              item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}>
              {item.type}
            </span>
            <span className="text-xs font-bold text-gray-400">ID: {item._id.slice(-8)}</span>
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">{item.title}</h1>
          
          <div className="space-y-4 mb-8 text-gray-600">
            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-2xl mr-4">📍</span>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Location</p>
                <p className="font-semibold text-gray-800">{item.location}</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-2xl mr-4">📅</span>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Date Reported</p>
                <p className="font-semibold text-gray-800">{new Date(item.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500 italic">
              "{item.description}"
            </p>
          </div>

          <div className="mt-auto">
            {contactSuccess ? (
              <div className="bg-green-100 text-green-700 p-4 rounded-xl font-bold text-center border-2 border-green-200 animate-bounce">
                🎉 Contact notification sent to the owner!
              </div>
            ) : (
              <button
                onClick={handleContact}
                disabled={contactLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-2xl transition-all shadow-xl shadow-blue-200 active:scale-95 flex items-center justify-center space-x-2"
              >
                {contactLoading ? (
                   <svg className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
                ) : (
                  <>
                    <span className="text-xl mr-2">✉️</span>
                    <span>I Found This! Contact Owner</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;

