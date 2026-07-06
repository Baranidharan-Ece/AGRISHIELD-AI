import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CropForm() {
  const { register, handleSubmit } = useForm();
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
        `${import.meta.env.VITE_API_URL}/crop/predict`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Crop prediction failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-1">
        Crop Recommendation
      </h1>
      <p className="text-slate-400 text-xs mb-8">Enter environmental conditions and soil analysis to suggest the most profitable crop.</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-md">
          <h2 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Soil & Environment</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nitrogen (N)</label>
                <input 
                  type="number" 
                  {...register("N", { required: true })} 
                  placeholder="e.g. 90" 
                  className="w-full bg-slate-950 border border-slate-850 focus:border-brand-500 rounded-lg p-2.5 text-xs text-white outline-none placeholder-slate-700" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Phosphorus (P)</label>
                <input 
                  type="number" 
                  {...register("P", { required: true })} 
                  placeholder="e.g. 42" 
                  className="w-full bg-slate-950 border border-slate-855 focus:border-brand-500 rounded-lg p-2.5 text-xs text-white outline-none placeholder-slate-700" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Potassium (K)</label>
                <input 
                  type="number" 
                  {...register("K", { required: true })} 
                  placeholder="e.g. 43" 
                  className="w-full bg-slate-950 border border-slate-855 focus:border-brand-500 rounded-lg p-2.5 text-xs text-white outline-none placeholder-slate-700" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Temp (°C)</label>
                <input 
                  type="number" 
                  step="any"
                  {...register("temperature", { required: true })} 
                  placeholder="e.g. 25.5" 
                  className="w-full bg-slate-950 border border-slate-855 focus:border-brand-500 rounded-lg p-2.5 text-xs text-white outline-none placeholder-slate-700" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Humidity (%)</label>
                <input 
                  type="number" 
                  step="any"
                  {...register("humidity", { required: true })} 
                  placeholder="e.g. 80" 
                  className="w-full bg-slate-950 border border-slate-855 focus:border-brand-500 rounded-lg p-2.5 text-xs text-white outline-none placeholder-slate-700" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">pH Level</label>
                <input 
                  type="number" 
                  step="any"
                  {...register("ph", { required: true })} 
                  placeholder="e.g. 6.5" 
                  className="w-full bg-slate-950 border border-slate-855 focus:border-brand-500 rounded-lg p-2.5 text-xs text-white outline-none placeholder-slate-700" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Rainfall (mm)</label>
                <input 
                  type="number" 
                  step="any"
                  {...register("rainfall", { required: true })} 
                  placeholder="e.g. 200" 
                  className="w-full bg-slate-950 border border-slate-855 focus:border-brand-500 rounded-lg p-2.5 text-xs text-white outline-none placeholder-slate-700" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
                <input 
                  type="text" 
                  {...register("location", { required: true })} 
                  placeholder="e.g. Chennai" 
                  className="w-full bg-slate-950 border border-slate-855 focus:border-brand-500 rounded-lg p-2.5 text-xs text-white outline-none placeholder-slate-700" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Soil Type</label>
                <input 
                  type="text" 
                  {...register("soilType", { required: true })} 
                  placeholder="e.g. Clayey" 
                  className="w-full bg-slate-950 border border-slate-855 focus:border-brand-500 rounded-lg p-2.5 text-xs text-white outline-none placeholder-slate-700" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-600/30 text-white font-semibold rounded-lg transition flex items-center justify-center text-xs mt-6"
            >
              {loading ? "Analyzing Parameters..." : "Predict Best Crop"}
            </button>
          </form>
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
                  Recommendation Found ({result.confidence}% Confidence)
                </span>
                <h3 className="text-xl font-bold text-white mt-3">
                  Recommended Crop: <span className="text-brand-400">{result.crop}</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg text-center">
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Season</span>
                  <span className="text-xs font-semibold text-white">{result.season}</span>
                </div>
                <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg text-center">
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Water Need</span>
                  <span className="text-xs font-semibold text-white">{result.water}</span>
                </div>
                <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg text-center">
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Fertilizer</span>
                  <span className="text-xs font-semibold text-white">{result.fertilizer}</span>
                </div>
                <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg text-center">
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Yield / Ha</span>
                  <span className="text-xs font-semibold text-white">{result.yield}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cultivation Guide</h4>
                <p className="text-slate-300 text-xs leading-relaxed bg-slate-950 border border-slate-850 p-4 rounded-lg">
                  {result.tips}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500 flex flex-col items-center justify-center h-full min-h-[300px]">
              <svg className="w-10 h-10 text-slate-700 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <p className="text-xs max-w-sm">Enter Nitrogen, Phosphorus, Potassium, and other parameters to find the ideal crop recommendation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
