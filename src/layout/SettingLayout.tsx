import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { settingsLinks } from '../utils/settinglinks'
import { Suspense, useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const SettingsLayout = () => {
  const firstName = useSelector((state: RootState) => state.user.firstName)
  const lastName = useSelector((state: RootState) => state.user.lastName)
  const profilePicture = useSelector((state: RootState) => state.user.profilePic)
  const navigate = useNavigate()
  const location = useLocation()

  const fullImageUrl = useMemo(() => {
    return `${import.meta.env.VITE_API_URL}${profilePicture?.startsWith('/') ? profilePicture : '/' + profilePicture}`
  }, [profilePicture])

  console.log(fullImageUrl)
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 p-4 md:flex-row">
      <div className="flex min-h-[590px] w-full flex-col justify-between rounded-lg bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] md:w-64">
        <div>
          <h1 className="mb-6 text-3xl font-bold">Settings</h1>

          <nav className="mb-8">
            <ul className="space-y-2">
              {settingsLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className={`w-full rounded-md px-2 py-2 text-left text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-gray-100 font-medium text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center pt-4">
          <div className="h-16 w-16 overflow-hidden rounded-full">
            <img
              src={
                profilePicture
                  ? fullImageUrl
                  : 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?t=st=1742702207~exp=1742705807~hmac=9207348a8ce72f0d47502818d2b23bdefdd48bd855093018937ef3fde93a3013&w=740'
              }
              alt="profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-900">{firstName + ' ' + lastName}</p>
          </div>
        </div>
      </div>

      <Suspense
        key={location.pathname}
        fallback={<Skeleton className="flex-1 rounded-lg bg-[#f3f3f3] p-6" />}
      >
        <div className="flex-1 rounded-lg bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <Outlet />
        </div>
      </Suspense>
    </section>
  )
}

export default SettingsLayout
