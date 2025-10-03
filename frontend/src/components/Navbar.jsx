import { Link, NavLink } from "react-rounter-dom";

export default function Navbar() {
    const link = "px-3 py-2 rounded-md text-sm font-medium";
    const active = "bg-blue-600 text-white";
    const idle = "text-gray-700 hover:bg-gray-100";
    return (
        <header className = "border-b bg-white sticky top-0 z-40">
            <nav className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
                <Link to="/" className="text-xl font-extrabold text-blue-700">LifeLens</Link>
                <div className="flex items-center gap-1">
                    <NavLink to="/" end className={({isActive}) => `${link} ${isActive?active:idle}`}>Home</NavLink>
                    <NavLink to="/dashboard" className={({isActive}) => `${link} ${isActive?active:idle}`}>Dashboard</NavLink>
                    <NavLink to = "/analyzer" className = {({isActive}) => `${link} ${isActive?active:idle}`} > Image Analyzer </NavLink>
                </div>
            </nav>
        </header>
    );
}