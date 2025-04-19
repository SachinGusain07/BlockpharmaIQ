import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { RootState } from '@/store/store'
import {
  adminNavItems,
  pharmacyNavItems,
  profileNavItems,
  supplierNavItems,
} from '@/utils/sidebarNavigationLinks'
import { LogOutIcon } from 'lucide-react'

interface SidebarProps {
  sidebarOpen: boolean
  onLogout: () => void
}

const Sidebar = ({ sidebarOpen, onLogout }: SidebarProps) => {
  const location = useLocation()
  const userRole = useSelector((state: RootState) => state.user.role)
  console.log('userRole', userRole);
  const getNavItemsByRole = () => {
    switch (userRole) {
      case 'ADMIN':
        return adminNavItems
      case 'SUPPLIER':
        return supplierNavItems
      case 'PHARMACY':
        return pharmacyNavItems
      default:
        return null
    }
  }

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

  return (
    <div
      className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white/95 backdrop-blur-lg transition-all duration-300 ease-in-out md:static md:translate-x-0`}
    >
      <div className="flex h-full min-h-screen flex-col">
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
                onClick={onLogout}
              >
                <LogOutIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-600" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
