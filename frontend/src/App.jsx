import { BrowserRouter as Router, Routes, Route, Outlet, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import CropForm from "./pages/CropForm";
import FertilizerForm from "./pages/FertilizerForm";
import DiseaseDetection from "./pages/DiseaseDetection";
import Chatbot from "./pages/Chatbot";
import ContactUs from "./pages/ContactUs";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// App Layout with Navbar
function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

// 404 Page Component (Clean Enterprise Style, No Emojis)
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <svg className="w-12 h-12 text-slate-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
      <h2 className="text-2xl font-bold text-white mb-2">404 - Page Off Limits</h2>
      <p className="text-slate-400 text-sm max-w-sm mb-6">The field you are looking for has been harvested or does not exist.</p>
      <Link to="/" className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition">
        Return to Dashboard
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public auth routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected routes wrapped in App Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/crop" element={<CropForm />} />
          <Route path="/fertilizer" element={<FertilizerForm />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/contact" element={<ContactUs />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
