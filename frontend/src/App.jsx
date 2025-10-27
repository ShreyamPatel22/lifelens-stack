import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ImageAnalyzer from "./pages/ImageAnalyzer";


function Navbar() {
  // helper for active link styles

  const linkClass = ({ isActive }) =>
    "px-2 py-1 rounded-md hover:bg-gray-100 " + (isActive ? "text-blue-700 font-semibold" : "text-gray-700");

  return (
    <header className = "border-b bg-white/70 backdrop-blur">
      <nav className = "mx-auto max-w-6xl flex items-center justify-between p-4">
        <NavLink to= "/" className="text-2xl font-bold text-blue-600"> LifeLens </NavLink>
        <div className= "flex items-center gap-4">
          <NavLink to="/" className= {linkClass} end >Home</NavLink>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/analyze" className={linkClass}>Image Analyzer</NavLink>
        </div>
      </nav>
    </header>
  );
}

// Testing 

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="mx-auto max-w-6xl p-6">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/report" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyze" element={<ImageAnalyzer />} />
        </Routes>
      </main>
    </Router>
  )
}
