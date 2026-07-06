import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Error fetching profile data");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
        <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        User Profile
      </h1>
      <p className="text-slate-400 text-xs mb-8">Manage your account details and view your registration status.</p>

      {loading ? (
        <div className="animate-pulse bg-slate-900 border border-slate-800 p-8 rounded-xl h-48">
          <div className="h-6 bg-slate-800 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-800 rounded w-2/3"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-950/50 border border-rose-900/50 text-rose-400 rounded-xl text-xs">{error}</div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-md space-y-6"
        >
          <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
            <div className="w-14 h-14 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-2xl text-brand-400 font-extrabold">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{user?.name}</h3>
              <p className="text-[10px] font-semibold text-brand-400 uppercase tracking-wider bg-brand-950/30 border border-brand-900/50 px-2 py-0.5 rounded inline-block mt-1">
                Registered Farmer
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</span>
              <span className="text-slate-200 text-sm font-medium">{user?.email}</span>
            </div>
            <div>
              <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Account Created</span>
              <span className="text-slate-200 text-sm font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
