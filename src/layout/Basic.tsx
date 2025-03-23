// BasicLayout.jsx
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { navLinks } from "../utils/navlinks";

const BasicLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(true);
    if (isAuthenticated) {
      navigate("/setting");
    }
  }, [isAuthenticated, navigate]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-[#E6E6E6] border-[#D1D1D1] rounded-full flex items-center justify-between box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px; px-4 py-2">
            <div className="w-10 h-10 bg-[#353535] rounded-full"></div>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-[#353535] font-medium text-sm leading-5 hover:text-gray-900"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <div className="relative flex gap-3">
                  <button className="px-6 py-2 rounded-full text-white font-medium text-sm leading-5 bg-[#353535]">
                    Sign up
                  </button>

                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden"
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
                        d={
                          isMenuOpen
                            ? "M6 18L18 6M6 6l12 12"
                            : "M4 6h16M4 12h16M4 18h16"
                        }
                      />
                    </svg>
                  </button>
                  {showProfileMenu && (
                    <div
                      className="absolute -right-16 mt-3 w-40 bg-[#f4f4f4] rounded-md shadow-lg py-1 z-50"
                      onMouseLeave={() => setShowProfileMenu(false)}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white mt-2 mx-4 font-medium text-sm rounded-lg shadow-lg p-4">
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
  );
};

export default BasicLayout;
