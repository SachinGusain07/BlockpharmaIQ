import { mainNavItems, profileNavItems } from '@/utils/pharmacyLayoutLinks'
import { BellIcon } from '@heroicons/react/24/outline'
import { LogOutIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

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
          </div>

          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-1">
              {mainNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`group flex items-center rounded-xl p-3 text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        location.pathname === item.path
                          ? 'text-indigo-500'
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                    <span>{item.name}</span>
                    {location.pathname === item.path && (
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
                    window.location.reload()
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
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
