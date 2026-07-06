import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, data);
      setSuccess("Account registered successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <svg className="w-10 h-10 text-brand-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path>
          </svg>
          <h2 className="text-3xl font-extrabold text-white mt-3">Register Account</h2>
          <p className="text-slate-400 text-sm mt-1">Get started with intelligent crop analytics</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/50 border border-rose-800/85 text-rose-400 text-sm rounded-xl mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-800/85 text-emerald-400 text-sm rounded-xl mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              {...register("name", { required: true })} 
              placeholder="John Doe" 
              className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl p-3 text-white placeholder-slate-600 outline-none transition" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              {...register("email", { required: true })} 
              type="email"
              placeholder="farmer@agrishield.com" 
              className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl p-3 text-white placeholder-slate-600 outline-none transition" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              {...register("password", { required: true })} 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl p-3 text-white placeholder-slate-600 outline-none transition" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white font-semibold rounded-xl transition flex items-center justify-center mt-6"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already registered?{" "}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
