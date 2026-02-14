import MainLayout from './components/Layout/MainLayout'

function App() {
  return (
    <MainLayout>
      <div className="dashboard-placeholder">
        <h1>Welcome back, John</h1>
        <p>Select a tab above to get started.</p>

        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2>Dashboard Overview</h2>
          <p>Your recent activities and pending actions will appear here.</p>
        </div>
      </div>
    </MainLayout>
  )
}

export default App
