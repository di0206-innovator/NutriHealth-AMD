import { Outlet, NavLink } from 'react-router-dom';
import { Home, Camera, History } from 'lucide-react';

export default function Layout() {
  return (
    <div className="app-layout">
      <div className="page-container">
        <Outlet />
      </div>
      
      <nav className="mobile-nav-container" aria-label="Main Navigation">
        <div className="mobile-nav-dock">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            aria-label="Home Dashboard">
            <Home size={22} strokeWidth={2.5} />
            <span className="nav-label sr-only">Home</span>
            {/* Nav indicator via CSS relative positioning */}
          </NavLink>
          
          <NavLink 
            to="/analyze" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            aria-label="Analyse Meal">
            <Camera size={22} strokeWidth={2.5} />
            <span className="nav-label sr-only">Analyse</span>
          </NavLink>
          
          <NavLink 
            to="/history" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            aria-label="Meal History">
            <History size={22} strokeWidth={2.5} />
            <span className="nav-label sr-only">History</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
