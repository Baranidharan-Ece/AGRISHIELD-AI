import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path 
      ? "text-brand-400 bg-slate-900/60 border border-slate-800" 
      : "text-slate-400 hover:text-white hover:bg-slate-900/30 border border-transparent";
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-900 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path>
          </svg>
          <span className="font-bold text-lg tracking-tight text-white">
            AgriShield AI
          </span>
        </Link>

        {/* Navigation Links */}
        {token ? (
          <div className="hidden md:flex items-center gap-2">
            <Link to="/" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${isActive("/")}`}>
              Dashboard
            </Link>
            <Link to="/crop" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${isActive("/crop")}`}>
              Crop Recommendation
            </Link>
            <Link to="/fertilizer" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${isActive("/fertilizer")}`}>
              Fertilizer Recommendation
            </Link>
            <Link to="/disease" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${isActive("/disease")}`}>
              Disease Detection
            </Link>
            <Link to="/chat" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${isActive("/chat")}`}>
              AI Chatbot
            </Link>
            <Link to="/profile" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${isActive("/profile")}`}>
              Profile
            </Link>
            <Link to="/contact" className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${isActive("/contact")}`}>
              Contact Us
            </Link>
          </div>
        ) : null}

        {/* Auth / Profile actions */}
        <div className="flex items-center gap-3">
          {token ? (
            <div className="flex items-center gap-4">
              <span className="hidden lg:inline text-xs text-slate-500">
                Logged in as <span className="text-slate-300 font-medium">{user?.name || "User"}</span>
              </span>
              <button 
                onClick={handleLogout}
                className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1.5 text-slate-400 hover:text-white text-xs font-medium rounded-lg transition">
                Login
              </Link>
              <Link to="/signup" className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium rounded-lg transition">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile navigation row */}
      {token ? (
        <div className="md:hidden flex overflow-x-auto gap-2 mt-4 pt-3 border-t border-slate-900 scrollbar-none">
          <Link to="/" className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${isActive("/")}`}>
            Dashboard
          </Link>
          <Link to="/crop" className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${isActive("/crop")}`}>
            Crops
          </Link>
          <Link to="/fertilizer" className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${isActive("/fertilizer")}`}>
            Fertilizer
          </Link>
          <Link to="/disease" className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${isActive("/disease")}`}>
            Diseases
          </Link>
          <Link to="/chat" className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${isActive("/chat")}`}>
            Chatbot
          </Link>
          <Link to="/profile" className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${isActive("/profile")}`}>
            Profile
          </Link>
          <Link to="/contact" className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${isActive("/contact")}`}>
            Contact
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
