import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './pages/Login'
import Dashboard from './pages/Dashboard'
import Teams from './pages/Teams'
import Players from './pages/Players'
import Games from './pages/Games'
import Users from './pages/Users'
import Settings from './pages/Settings'
import Tournaments from './pages/Tournaments'
import TeamForm from './pages/TeamForm'
import TournamentForm from './pages/TournamentForm'
import GameForm from './pages/GameForm'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/add" element={<TeamForm />} />
        <Route path="/teams/edit/:id" element={<TeamForm />} />
        <Route path="/teams/view/:id" element={<TeamForm isViewOnly={true} />} />
        <Route path="/players" element={<Players />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/add" element={<GameForm />} />
        <Route path="/games/edit/:id" element={<GameForm />} />
        <Route path="/games/view/:id" element={<GameForm isViewOnly={true} />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournaments/create" element={<TournamentForm />} />
        <Route path="/tournaments/edit/:id" element={<TournamentForm />} />
        <Route path="/tournaments/view/:id" element={<TournamentForm isViewOnly={true} />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App

