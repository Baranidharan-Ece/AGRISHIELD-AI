import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function ResetPassword() {
  const { register, handleSubmit } = useForm();
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError("");
    setMessage("");
    try {
      // Mock reset password success
      setTimeout(() => {
        setMessage("Password updated successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }, 1000);
    } catch (err) {
      setError("Failed to reset password. Link may have expired.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-white mb-2 text-center">Reset Password</h2>
        <p className="text-slate-400 text-sm text-center mb-6">Enter your new password below.</p>
        
        {message && <div className="p-3 bg-emerald-950/50 border border-emerald-800/80 text-emerald-400 rounded-lg text-sm mb-4">{message}</div>}
        {error && <div className="p-3 bg-rose-950/50 border border-rose-800/80 text-rose-400 rounded-lg text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">New Password</label>
            <input 
              {...register("password", { required: true })} 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl p-3 text-white placeholder-slate-600 outline-none transition" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Confirm New Password</label>
            <input 
              {...register("confirmPassword", { required: true })} 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl p-3 text-white placeholder-slate-600 outline-none transition" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white font-semibold rounded-xl transition flex items-center justify-center"
          >
            {loading ? "Resetting..." : "Save Password"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-400">
          Back to{" "}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
