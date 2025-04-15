import AccessDenied from '@/components/AccessDenied'
import { resetTokens } from '@/store/reducers/authReducer'
import { RootState } from '@/store/store'
import {
  adminNavItems,
  pharmacyNavItems,
  profileNavItems,
  supplierNavItems,
} from '@/utils/sidebarNavigationLinks'
import { BellIcon } from '@heroicons/react/24/outline'
import { LogOutIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

interface roleAccessProps {
  roleAccess: string[]
}

const DashboardLayout = ({ roleAccess }: roleAccessProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const userRole = useSelector((state: RootState) => state.user.role)

  const getNavItemsByRole = () => {
    if (roleAccess.includes(userRole?.toString() || '')) {
      switch (userRole) {
        case 'ADMIN':
          return adminNavItems
        case 'SUPPLIER':
          return supplierNavItems
        case 'PHARMACY':
          return pharmacyNavItems
        case 'USER':
          return null
        default:
          return null
      }
    }
    return null
  }

  useEffect(() => {
    console.log('Current user role:', userRole)
    console.log('Role access list:', roleAccess)
    console.log('Is role included:', roleAccess.includes(userRole?.toString() || ''))
  }, [userRole, roleAccess])

  const roleNavItems = getNavItemsByRole()

  const getDashboardTitle = () => {
    switch (userRole) {
      case 'ADMIN':
        return 'Admin Dashboard'
      case 'SUPPLIER':
        return 'Supplier Portal'
      case 'PHARMACY':
        return 'Pharmacy Dashboard'
      default:
        return 'BlockPharma-IQ'
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (!userRole || !roleAccess.includes(userRole.toString())) {
    console.log('Access denied - Role:', userRole, 'Allowed roles:', roleAccess)
    return <AccessDenied />
  }

  return (
    <div className="flex h-screen bg-neutral-50 shadow-xl backdrop-blur-3xl">
      <div
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-72 border-r border-gray-200 bg-white/95 backdrop-blur-lg transition-all duration-300 ease-in-out md:static md:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-100 p-6">
            <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
              BlockPharma-IQ
            </h1>
            <p className="text-xs text-gray-400">Inventory Intelligence Platform</p>
            <p className="mt-1 text-sm font-medium text-indigo-600 capitalize">
              {getDashboardTitle()}
            </p>
          </div>

          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-1">
              {roleNavItems?.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`group flex items-center rounded-xl p-3 text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path ||
                      (item.path.endsWith('/') && location.pathname === item.path.slice(0, -1)) ||
                      (!item.path.endsWith('/') && location.pathname === `${item.path}/`)
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        location.pathname === item.path ||
                        (item.path.endsWith('/') && location.pathname === item.path.slice(0, -1)) ||
                        (!item.path.endsWith('/') && location.pathname === `${item.path}/`)
                          ? 'text-indigo-500'
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                    <span>{item.name}</span>
                    {(location.pathname === item.path ||
                      (item.path.endsWith('/') && location.pathname === item.path.slice(0, -1)) ||
                      (!item.path.endsWith('/') && location.pathname === `${item.path}/`)) && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-indigo-500"></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-gray-100 p-4">
            <ul className="space-y-1">
              {profileNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`group flex items-center rounded-xl p-3 text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-gray-50 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        location.pathname === item.path
                          ? 'text-gray-700'
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  className="group flex w-full items-center rounded-xl p-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => {
                    localStorage.clear()
                    navigate('/login')
                    dispatch(resetTokens())
                  }}
                >
                  <LogOutIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-600" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <button
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="md:flex-1"></div>
            <button className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
        </header>
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
