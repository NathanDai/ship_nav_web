import React from 'react';
import Sidebar from './components/Sidebar';
import MailTable from './components/MailTable';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <Sidebar />
      <MailTable />
    </div>
  );
}

export default App;
