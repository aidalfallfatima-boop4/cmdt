import type { ReactElement } from 'react'
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth'
import { Layout } from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Production from './pages/Production'
import Secteurs from './pages/Secteurs'
import SecteurDetail from './pages/SecteurDetail'
import Egrenage from './pages/Egrenage'
import Finance from './pages/Finance'
import Forecasting from './pages/Forecasting'
import Risks from './pages/Risks'
import Copilot from './pages/Copilot'
import Scenarios from './pages/Scenarios'
import Reports from './pages/Reports'
import BassinMap from './pages/BassinMap'
import Roadmap from './pages/Roadmap'
import About from './pages/About'

function RequireAuth({ children }: { children: ReactElement }) {
  const { session } = useAuth()
  const location = useLocation()
  if (!session) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/accueil" element={<Landing />} />
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/production" element={<Production />} />
            <Route path="/secteurs" element={<Secteurs />} />
            <Route path="/secteurs/:id" element={<SecteurDetail />} />
            <Route path="/egrenage" element={<Egrenage />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/previsions" element={<Forecasting />} />
            <Route path="/risques" element={<Risks />} />
            <Route path="/copilot" element={<Copilot />} />
            <Route path="/scenarios" element={<Scenarios />} />
            <Route path="/rapports" element={<Reports />} />
            <Route path="/bassin" element={<BassinMap />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/a-propos" element={<About />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
