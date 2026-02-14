import MainLayout from './components/Layout/MainLayout'

function App() {
  return (
    <MainLayout>
      <div className="dashboard-placeholder">
        <h1>Welcome back, John</h1>
        <p>Select a tab above to get started.</p>

        <div className="glass-card">
          <h2>Dashboard Overview</h2>
          <p>Your recent activities and pending actions will appear here.</p>
        </div>
      </div>
    </MainLayout>
  )
}

export default App
