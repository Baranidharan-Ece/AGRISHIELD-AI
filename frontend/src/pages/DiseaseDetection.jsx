import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function DiseaseDetection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return setError("Please select an image first");
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/disease/detect`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        }
      );
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error detecting disease. Make sure it is a valid leaf image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-1">
        Plant Disease Detection
      </h1>
      <p className="text-slate-400 text-xs mb-8">Upload a photograph of crop leaves to analyze symptoms and discover organic treatments.</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-md">
          <h2 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Leaf Image</h2>
          
          <div className="space-y-4">
            {preview ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img src={preview} alt="Leaf preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900 border border-slate-800 hover:bg-rose-950 hover:text-rose-400 hover:border-rose-900 text-slate-400 rounded-lg transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-800 hover:border-brand-500 rounded-xl cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition">
                <svg className="w-8 h-8 text-slate-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="text-xs font-semibold text-slate-400">Click to upload photo</span>
                <span className="text-[10px] text-slate-600 mt-1 uppercase tracking-wider">JPEG, PNG or WEBP (Max 5MB)</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            )}

            <button 
              onClick={handleUpload} 
              disabled={loading || !file}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-600/30 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 mt-4 text-xs"
            >
              {loading ? "Analyzing Leaf Image..." : "Upload & Analyze"}
            </button>
          </div>
          {error && <div className="mt-4 p-3 bg-rose-950/30 border border-rose-900/50 text-rose-400 rounded-lg text-xs">{error}</div>}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7">
          {result ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-md space-y-6"
            >
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Diagnosis Found ({result.confidence}% Confidence)
                </span>
                <h3 className="text-xl font-bold text-white mt-3">
                  Condition: <span className="text-brand-400">{result.disease}</span>
                </h3>
              </div>

              <div className="bg-slate-950 border border-slate-850 p-4 rounded-lg">
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Likely Causes</span>
                <p className="text-slate-300 text-xs leading-relaxed">{result.causes}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-lg">
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Chemical Treatment</span>
                  <p className="text-slate-300 text-xs leading-relaxed">{result.treatment}</p>
                </div>
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-lg">
                  <h4 className="text-[10px] font-bold text-brand-400 flex items-center gap-1.5 uppercase tracking-wider mb-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 15c.67-.833 2.33-1 3 0"></path>
                    </svg>
                    Organic Solution
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">{result.organic_solution}</p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-850 p-4 rounded-lg">
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Future Prevention</span>
                <p className="text-slate-300 text-xs leading-relaxed">{result.prevention}</p>
              </div>
            </motion.div>
          ) : (
            <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500 flex flex-col items-center justify-center h-full min-h-[300px]">
              <svg className="w-10 h-10 text-slate-700 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 15c.67-.833 2.33-1 3 0"></path>
              </svg>
              <p className="text-xs max-w-sm">Select and analyze leaf photographs to automatically diagnose health concerns and organic recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
