/**
 * AI Assistance Disclosure
 * Tool: Cursor (GPT-5.6 Sol Medium)
 * Scope: Assisted with frontend implementation, debugging and UI refinement.
 * Author review: The generated code was reviewed, tested, and iteratively refined by the author through follow-up instructions.
 */

import { useState } from 'react'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import AppNavigation, { type UserMode } from './components/AppNavigation'
import AccountPage from './pages/AccountPage.tsx'
import CreateSupplierPage from './pages/CreateSupplierPage.tsx'
import EditSupplierPage from './pages/EditSupplierPage.tsx'
import HomePage from './pages/HomePage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import MyRequestsPage from './pages/MyRequestsPage.tsx'
import MyTasksPage from './pages/MyTasksPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import RequestCreationPage from './pages/RequestCreationPage.tsx'
import SupplierDetailPage from './pages/SupplierDetailPage.tsx'
import SupplierListPage from './pages/SupplierListPage'
import theme from './theme'

// TODO: Replace this preview value with role information from the team's User Service/auth integration.
const TEMPORARY_IS_ADMIN = false

const requesterPageBackground = {
  bgcolor: '#F3F5F7',
  backgroundImage:
    'radial-gradient(circle at 0% 0%, rgba(23, 63, 95, 0.07) 0%, rgba(243, 245, 247, 0) 34%)',
}

const courierPageBackground = {
  bgcolor: '#F2F6F5',
  backgroundImage:
    'radial-gradient(circle at 0% 0%, rgba(31, 98, 94, 0.08) 0%, rgba(242, 246, 245, 0) 34%)',
}

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const isPublicPage =
    location.pathname === '/login' || location.pathname === '/register'
  // TODO: Load and persist the active mode through the team's User Service.
  const [mode, setMode] = useState<UserMode>('requester')
  const pageBackground =
    mode === 'courier' ? courierPageBackground : requesterPageBackground

  function handleModeChange(newMode: UserMode) {
    if (newMode === mode) {
      return
    }

    setMode(newMode)
    navigate('/home')
  }

  return (
    <Box
      sx={{
        minHeight: '100svh',
        ...pageBackground,
        pb: isPublicPage ? 0 : { xs: 8, md: 0 },
      }}
    >
      {!isPublicPage && (
        <AppNavigation mode={mode} onModeChange={handleModeChange} />
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<HomePage mode={mode} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/requests" element={<MyRequestsPage mode={mode} />} />
        <Route path="/requests/new" element={<RequestCreationPage mode={mode} />} />
        <Route
          path="/my-tasks"
          element={
            mode === 'courier' ? (
              <MyTasksPage />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />
        <Route path="/account" element={<AccountPage />} />
        <Route
          path="/suppliers"
          element={<SupplierListPage isAdmin={TEMPORARY_IS_ADMIN} />}
        />
        <Route path="/suppliers/new" element={<CreateSupplierPage />} />
        <Route
          path="/suppliers/:supplierId/edit"
          element={<EditSupplierPage />}
        />
        <Route
          path="/suppliers/:supplierId"
          element={<SupplierDetailPage isAdmin={TEMPORARY_IS_ADMIN} mode={mode} />}
        />
      </Routes>
    </Box>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
