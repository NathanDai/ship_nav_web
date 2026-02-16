import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  Moon
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">船</div>
        <span className="logo-text">租船AI</span>
      </div>

      <nav className="nav-menu">
        <div className="nav-group">
          <p className="nav-header">菜单</p>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Package size={20} />
            <span>邮件列表</span>
          </NavLink>
          <NavLink to="/schedule" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <ShoppingCart size={20} />
            <span>船舶排期</span>
          </NavLink>
          <NavLink to="/customers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>Customers</span>
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BarChart2 size={20} />
            <span>Analytics</span>
          </NavLink>
        </div>

        <div className="nav-group bottom-group">
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
          <NavLink to="/help" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <HelpCircle size={20} />
            <span>Help & Support</span>
          </NavLink>

          <div className="nav-item darkmode-toggle">
            <div className="toggle-label">
              <Moon size={20} />
              <span>Darkmode</span>
            </div>
            <div className="toggle-switch"></div>
          </div>
        </div>
      </nav>

      <div className="user-profile">
        <div className="user-info">
          <a href="#" className="nav-item logout">
            <LogOut size={20} />
            <span>Log Out</span>
          </a>
        </div>
        <div className="version-info">
          v1.2.0 • Terms
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
