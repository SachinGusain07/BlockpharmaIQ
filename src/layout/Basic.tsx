import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { navLinks } from '../utils/navlinks'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const BasicLayout = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/setting')
      return
    }
  }, [isAuthenticated, navigate])

  return (
    <>
      <nav className="fixed top-4 right-0 left-0 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px; flex items-center justify-between rounded-full border-[#D1D1D1] bg-[#E6E6E6] px-4 py-2">
            <div className="h-10 w-10 rounded-full bg-[#353535]"></div>

            <div className="hidden items-center space-x-8 md:flex">
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
            <div>
              <div className="flex items-center space-x-3">
                <div className="relative flex gap-3">
                  <button className="rounded-full bg-[#353535] px-6 py-2 text-sm leading-5 font-medium text-white">
                    Sign up
                  </button>

                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
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
                  {showProfileMenu && (
                    <div
                      className="absolute -right-16 z-50 mt-3 w-40 rounded-md bg-[#f4f4f4] py-1 shadow-lg"
                      onMouseLeave={() => setShowProfileMenu(false)}
                    ></div>
                  )}
                </div>
              </div>
            </div>
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
      </nav>

      <div className="pt-24">
        <Outlet />
      </div>
    </>
  )
}

export default BasicLayout
