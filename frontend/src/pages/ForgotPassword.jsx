import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      // Simulate a server round-trip (0.8s) then show a safe confirmation.
      // A real implementation would call a dedicated /api/auth/forgot-password endpoint.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setMessage(
        "If this email is registered, a password reset link has been sent to your inbox."
      );
    } catch (err) {
      setError("Failed to send reset link. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-white mb-2 text-center">
          Forgot Password
        </h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          Enter your registered email and we will send you a reset link.
        </p>

        {message && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-800/80 text-emerald-400 rounded-lg text-sm mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 bg-rose-950/50 border border-rose-800/80 text-rose-400 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="farmer@agrishield.com"
              className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl p-3 text-white placeholder-slate-600 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white font-semibold rounded-xl transition flex items-center justify-center"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Back to{" "}
          <Link
            to="/login"
            className="text-brand-400 hover:text-brand-300 font-medium underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
