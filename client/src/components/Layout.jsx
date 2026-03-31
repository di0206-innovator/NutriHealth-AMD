import { Outlet, NavLink } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app-shell">
      <div className="content-area">
        <Outlet />
      </div>
      <nav className="bottom-nav glass-panel" aria-label="Main Navigation">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          aria-label="Home Dashboard">
          <span className="nav-icon" aria-hidden="true">🏠</span>
          <span className="nav-label">Home</span>
        </NavLink>
        <NavLink 
          to="/analyze" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          aria-label="Analyse Meal">
          <span className="nav-icon nav-center-icon" aria-hidden="true">📸</span>
          <span className="nav-label sr-only">Analyse</span>
        </NavLink>
        <NavLink 
          to="/history" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          aria-label="Meal History">
          <span className="nav-icon" aria-hidden="true">📋</span>
          <span className="nav-label">History</span>
        </NavLink>
      </nav>
    </div>
  );
}
