// src/layout/BasicLayout.tsx
import { RootState } from '@/store/store'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { navLinks } from '../utils/navlinks'

const BasicLayout = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { role } = useSelector((state: RootState) => state.user)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (isAuthenticated && role) {
      const redirectMap = {
        ADMIN: '/admin-dashboard',
        SUPPLIER: '/supplier-dashboard',
        PHARMACY: '/pharmacy-dashboard',
      }

      const redirectPath = redirectMap[role as keyof typeof redirectMap]

      if (redirectPath) {
        navigate(redirectPath, { replace: true })
      } else {
        console.log('Unknown role detected:', role)
        navigate('/access-denied', { replace: true })
      }
    }
  }, [role, isAuthenticated, navigate])

  return (
    <>
      <nav className="fixed top-4 right-0 left-0 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between rounded-full border border-[#D1D1D1] bg-white/30 px-4 py-2 shadow-[rgba(35,35,40,0.1)] backdrop-blur-md backdrop-saturate-150">
            <div className="h-10 w-10 rounded-full bg-[#353535]"></div>

            <div className="absolute left-1/2 hidden -translate-x-1/2 transform items-center space-x-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm leading-5 font-medium text-[#353535] hover:text-gray-900"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/signup')}
                className="rounded-full bg-[#353535] px-6 py-2 text-sm leading-5 font-medium text-white"
              >
                Sign up
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="mx-4 mt-2 rounded-lg bg-white p-4 text-sm font-medium shadow-lg md:hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block py-2 text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="pt-24">
        <Outlet />
      </div>
    </>
  )
}

export default BasicLayout
