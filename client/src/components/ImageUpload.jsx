import React, { useState } from 'react';

const ImageUpload = ({ onUpload }) => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        onUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-glass-border border-dashed rounded-3xl cursor-pointer bg-input-bg/30 hover:bg-input-bg/50 transition-all relative overflow-hidden group">
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <div className="bg-white/10 p-3 rounded-full border border-white/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 border border-indigo-500/20">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <p className="mb-2 text-sm text-muted"><span className="font-bold text-indigo-400">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-muted/60 uppercase tracking-widest font-bold">Square images look best</p>
            </div>
          )}
          <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
