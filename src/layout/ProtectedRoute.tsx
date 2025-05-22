import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RootState } from '@/store/store'
import AccessDenied from '@/components/AccessDenied'
import Loader from '@/components/ui/Loader'
import { useMeQuery } from '@/services/api'

interface ProtectedRouteProps {
  roles: string[]
  children?: React.ReactNode
}

const ProtectedRoute = ({ roles, children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { role } = useSelector((state: RootState) => state.user)
  const { data, isLoading, isError } = useMeQuery()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (isError || data?.status === 401) {
    localStorage.clear()
    return <Navigate to="/login" replace />
  }

  if (!isAuthenticated || !data) {
    return <Navigate to="/login" replace />
  }

  if (role && !roles.includes(role)) {
    return <AccessDenied />
  }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
