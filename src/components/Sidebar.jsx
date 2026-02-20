import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Mail,
  Calendar,
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
          <a href="#" className="nav-item disabled" onClick={(e) => e.preventDefault()}>
            <LayoutDashboard size={20} />
            <span>仪表盘</span>
          </a>
          <NavLink to="/mails" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Mail size={20} />
            <span>邮件列表</span>
          </NavLink>
          <NavLink to="/schedule" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Calendar size={20} />
            <span>船舶排期</span>
          </NavLink>
          <a href="#" className="nav-item disabled" onClick={(e) => e.preventDefault()}>
            <Users size={20} />
            <span>客户管理</span>
          </a>
          <a href="#" className="nav-item disabled" onClick={(e) => e.preventDefault()}>
            <BarChart2 size={20} />
            <span>数据分析</span>
          </a>
        </div>

        <div className="nav-group bottom-group">
          <a href="#" className="nav-item disabled" onClick={(e) => e.preventDefault()}>
            <Settings size={20} />
            <span>系统设置</span>
          </a>
          <a href="#" className="nav-item disabled" onClick={(e) => e.preventDefault()}>
            <HelpCircle size={20} />
            <span>帮助与支持</span>
          </a>

          <div className="nav-item darkmode-toggle">
            <div className="toggle-label">
              <Moon size={20} />
              <span>深色模式</span>
            </div>
            <div className="toggle-switch"></div>
          </div>
        </div>
      </nav>

      <div className="user-profile">
        <div className="user-info">
          <a href="#" className="nav-item logout">
            <LogOut size={20} />
            <span>退出登录</span>
          </a>
        </div>
        <div className="version-info">
          v1.2.0 • AI租船
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
