import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";

export default function FertilizerForm() {
  const { register, handleSubmit, reset } = useForm();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/fertilizer/predict`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Fertilizer recommendation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-1">
        Fertilizer Recommendation
      </h1>
      <p className="text-slate-400 text-xs mb-8">Analyze soil macronutrients and crop specifications to suggest ideal fertilizers.</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-md">
          <h2 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Soil & Crop Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nitrogen (N)</label>
                <input 
                  type="number" 
                  {...register("N", { required: true })} 
                  placeholder="e.g. 45" 
                  className="w-full bg-slate-950 border border-slate-850 focus:border-brand-500 rounded-lg p-2.5 text-xs text-white outline-none placeholder-slate-700" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Phosphorus (P)</label>
                <input 
                  type="number" 
                  {...register("P", { required: true })} 
                  placeholder="e.g. 28" 
                  className="w-full bg-slate-950 border border-slate-850 focus:border-brand-500 rounded-lg p-2.5 text-xs text-white outline-none placeholder-slate-700" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Potassium (K)</label>
                <input 
                  type="number" 
                  {...register("K", { required: true })} 
                  placeholder="e.g. 35" 
                  className="w-full bg-slate-950 border border-slate-850 focus:border-brand-500 rounded-lg p-2.5 text-xs text-white outline-none placeholder-slate-700" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Moisture (%)</label>
              <input 
                type="number" 
                {...register("moisture", { required: true })} 
                placeholder="e.g. 40" 
                className="w-full bg-slate-950 border border-slate-850 focus:border-brand-500 rounded-lg p-2.5 text-xs text-white outline-none placeholder-slate-700" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Soil Type</label>
                <select 
                  {...register("soilType", { required: true })}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-brand-500 rounded-lg p-2.5 text-xs text-white outline-none"
                >
                  <option value="Loamy">Loamy</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Clayey">Clayey</option>
                  <option value="Black">Black</option>
                  <option value="Red">Red</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Target Crop</label>
                <select 
                  {...register("cropType", { required: true })}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-brand-500 rounded-lg p-2.5 text-xs text-white outline-none"
                >
                  <option value="Rice">Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Maize">Maize</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Sugarcane">Sugarcane</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-600/30 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 mt-6 text-xs"
            >
              {loading ? "Analyzing Soil..." : "Get Recommendation"}
            </button>
          </form>
          {error && <div className="mt-4 p-3 bg-rose-950/30 border border-rose-900/50 text-rose-400 rounded-lg text-xs">{error}</div>}
        </div>

        {/* Results panel */}
        <div className="lg:col-span-7">
          {result ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-md space-y-6"
            >
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Analysis Complete ({result.confidence}% Confidence)
                </span>
                <h3 className="text-xl font-bold text-white mt-3">
                  Recommended: <span className="text-brand-400">{result.fertilizer}</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-lg">
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Soil Deficiency</span>
                  <span className="text-xs font-semibold text-rose-400">{result.deficiency}</span>
                </div>
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-lg">
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Target Crop</span>
                  <span className="text-xs font-semibold text-white">{result.cropType}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Application Instructions</h4>
                <p className="text-slate-300 text-xs leading-relaxed bg-slate-950 border border-slate-850 p-4 rounded-lg">
                  {result.application}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-brand-400 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 15c.67-.833 2.33-1 3 0"></path>
                  </svg>
                  Organic Alternative
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed bg-slate-950 border border-slate-850 p-4 rounded-lg">
                  {result.organic_solution}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500 flex flex-col items-center justify-center h-full min-h-[300px]">
              <svg className="w-10 h-10 text-slate-700 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
              <p className="text-xs max-w-sm">Submit the soil parameters form to get real-time chemical and organic fertilizer suggestions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
