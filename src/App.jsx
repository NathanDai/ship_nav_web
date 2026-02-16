import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MailTable from './components/MailTable';
import ShipSchedule from './components/ShipSchedule';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={<MailTable />} />
          <Route path="/schedule" element={<ShipSchedule />} />
          <Route path="*" element={<MailTable />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
