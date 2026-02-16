import { useState } from 'react'
import MainLayout from './components/Layout/MainLayout'
import Dashboard from './components/Dashboard/Dashboard'
import PipelineComparison from './components/Dashboard/PipelineComparison'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('All Requests')

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'All Requests' ? (
        <Dashboard />
      ) : activeTab === 'My Request' ? (
        <PipelineComparison />
      ) : (
        <div className="dashboard-placeholder">
          <h1>{activeTab}</h1>
          <p>This section is under construction.</p>
          <div className="glass-card">
            <p>Content for "{activeTab}" will appear here.</p>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default App
