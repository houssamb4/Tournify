import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tournaments from './pages/Tournaments'
import Users from './pages/Users'
import Moderation from './pages/Moderation'
import Finance from './pages/Finance'
import Settings from './pages/Settings'
import Teams from './pages/Teams'
import Games from './pages/Games'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tournaments" element={<Tournaments />} />
      <Route path="/users" element={<Users />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/moderation" element={<Moderation />} />
      <Route path="/Games" element={<Games />} />
      <Route path="/finance" element={<Finance />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App

