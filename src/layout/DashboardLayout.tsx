// src/layout/DashboardLayout.tsx
import { useLogoutMutation } from '@/services/api'
import { resetTokens } from '@/store/reducers/authReducer'
import { RootState } from '@/store/store'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Header from './Header'
import Sidebar from './Sidebar'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [logout] = useLogoutMutation()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  const handleLogout = () => {
    localStorage.clear()
    logout()
    navigate('/login')
    dispatch(resetTokens())
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return (
    <div className="flex h-screen bg-neutral-50 shadow-xl backdrop-blur-3xl">
      <Sidebar sidebarOpen={sidebarOpen} onLogout={handleLogout} />

      <div className="flex flex-1 flex-col">
        <Header onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
