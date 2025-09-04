import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ImageAnalyzer from "./pages/ImageAnalyzer";

function Navbar() {
  return (
    <header className = "border-b bg-white/70 backdrop-blur">
      <nav className = "mx-auto max-w-6xl flex item-center justify-between p-4">
        <Link to= "/" className="text-2xl font-bold text-blue-600"> LifeLens </Link>
        <div className= "flex items-center gap-4">
          <Link to="/" className= "hover:underline">Home</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/analyze" className="hover:underline">Image Analyzer</Link>
        </div>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="mx-auto max-w-6xl p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyze" element={<ImageAnalyzer />} />
        </Routes>
      </main>
    </Router>
  )
}
