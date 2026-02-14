import React from 'react';
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
          <a href="#" className="nav-item">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item active">
            <Package size={20} />
            <span>邮件列表</span>
          </a>
          <a href="#" className="nav-item">
            <ShoppingCart size={20} />
            <span>Orders</span>
          </a>
          <a href="#" className="nav-item">
            <Users size={20} />
            <span>Customers</span>
          </a>
          <a href="#" className="nav-item">
            <BarChart2 size={20} />
            <span>Analytics</span>
          </a>
        </div>

        <div className="nav-group bottom-group">
          <a href="#" className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </a>
          <a href="#" className="nav-item">
            <HelpCircle size={20} />
            <span>Help & Support</span>
          </a>

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
