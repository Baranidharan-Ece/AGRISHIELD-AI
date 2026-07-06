import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [location, setLocation] = useState("Chennai");
  const [weatherLoading, setWeatherLoading] = useState(false);

  const fetchWeather = (loc) => {
    setWeatherLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/weather`, { location: loc })
      .then((res) => {
        setWeather(res.data);
        setWeatherLoading(false);
      })
      .catch(() => {
        console.log("Error fetching weather");
        setWeatherLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPredictions(res.data))
      .catch(() => console.log("Error fetching predictions"));

    fetchWeather(location);
  }, []);

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeather(location);
    }
  };

  // Process data for Recharts (confidence ratings over time)
  const chartData = predictions
    .slice()
    .reverse()
    .map((p) => ({
      date: new Date(p.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      confidence: parseFloat(p.result?.confidence || 0),
      type: p.type.toUpperCase(),
    }));

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path>
            </svg>
            AgriShield Dashboard
          </h1>
          <p className="text-slate-400 text-xs mt-1">Real-time weather analytics and recommendation history.</p>
        </div>

        {/* Weather Location Search */}
        <form onSubmit={handleLocationSubmit} className="flex gap-2 shrink-0">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search Location..."
            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-brand-500"
          />
          <button type="submit" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-xs font-semibold transition">
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weather Card */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
              <svg className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
              </svg>
              Weather: <span className="text-brand-400">{weather?.location || location}</span>
            </h2>
            {weatherLoading ? (
              <div className="animate-pulse space-y-3 py-4">
                <div className="h-6 bg-slate-800 rounded w-2/3"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              </div>
            ) : weather ? (
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between items-center bg-slate-950/50 border border-slate-850 p-3 rounded-lg">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    Temperature
                  </span>
                  <span className="font-bold text-white text-sm">{weather.temperature} °C</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/50 border border-slate-850 p-3 rounded-lg">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    Humidity
                  </span>
                  <span className="font-bold text-white text-sm">{weather.humidity} %</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/50 border border-slate-850 p-3 rounded-lg">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                    Hourly Rainfall
                  </span>
                  <span className="font-bold text-white text-sm">{weather.rainfall} mm</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/50 border border-slate-850 p-3 rounded-lg">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    Wind Speed
                  </span>
                  <span className="font-bold text-white text-sm">{weather.wind_speed} m/s</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs text-center py-6 border border-dashed border-slate-800 rounded-lg">Weather data unavailable</p>
            )}
          </div>
          <div className="text-[9px] text-slate-600 mt-6 uppercase tracking-wider font-semibold text-center border-t border-slate-850 pt-4">
            Provided via AgriShield API
          </div>
        </div>

        {/* Prediction Chart */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-md">
          <h2 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Confidence Trends</h2>
          <div className="h-[230px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "8px", color: "#e2e8f0", fontSize: "11px" }}
                  />
                  <Line type="monotone" dataKey="confidence" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 3, fill: "#0f172a", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                No recommendation trends recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Predictions List */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-md">
        <h2 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Recent Activity</h2>
        {predictions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
            No history logs found. Visit Crop or Fertilizer pages to run predictions.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predictions.slice(0, 6).map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-950 border border-slate-850 p-4 rounded-lg flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      p.type === "crop" ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50" :
                      p.type === "fertilizer" ? "bg-brand-950/40 text-brand-400 border-brand-900/50" :
                      "bg-blue-950/40 text-blue-400 border-blue-900/50"
                    }`}>
                      {p.type}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {p.type === "crop" && (
                    <div className="mt-2 text-white">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Recommended Crop</p>
                      <h4 className="text-sm font-bold text-white">{p.result?.crop}</h4>
                    </div>
                  )}

                  {p.type === "fertilizer" && (
                    <div className="mt-2 text-white">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Fertilizer Solution</p>
                      <h4 className="text-sm font-bold text-white">{p.result?.fertilizer}</h4>
                    </div>
                  )}

                  {p.type === "disease" && (
                    <div className="mt-2 text-white">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Diagnosed Condition</p>
                      <h4 className="text-sm font-bold text-white">{p.result?.disease}</h4>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-850 flex justify-between items-center text-xs">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Confidence</span>
                  <span className="font-bold text-emerald-400 text-xs">{p.result?.confidence}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
