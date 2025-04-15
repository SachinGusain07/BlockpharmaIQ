import { lazy } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import BasicLayout from './layout/BasicLayout'
import DashboardLayout from './layout/DashboardLayout'
import Home from './pages/home'

import { useSelector } from 'react-redux'
import AccessDenied from './components/AccessDenied'
import SuperAdminDashboard from './components/SuperAdmin/Dashboard'
import Pharmacies from './components/SuperAdmin/Pharmacy'
import Suppliers from './components/SuperAdmin/Supplier'
import Users from './components/SuperAdmin/User'
import Dashboard from './components/Supplier/Dashboard'
import OrderHistoryPage from './components/Supplier/OrderHistory'
import SupplierOrdersPage from './components/Supplier/SupplierOrders'
import Loader from './components/ui/Loader'
import Login from './pages/login'
import Signup from './pages/signup'
import { useMeQuery } from './services/api'
import { RootState } from './store/store'

const ProfileInformation = lazy(() => import('./pages/profile-info'))
const AccountSettings = lazy(() => import('./pages/account-setting'))
const ChangePassword = lazy(() => import('./pages/change-password'))
const UpdateProfile = lazy(() => import('./pages/update-profile'))
const NotFound = lazy(() => import('./pages/not-found'))
const InventoryPage = lazy(() => import('./pages/inventory'))
const AnalyticsPage = lazy(() => import('./pages/analytics'))
const OrdersPage = lazy(() => import('./pages/order'))
const BlockchainPage = lazy(() => import('./pages/blockchain'))
const PharmacySetting = lazy(() => import('./pages/pharmacy-setting'))

export const App = () => {
  const user = useSelector((state: RootState) => state.user)
  const { data: userData, isLoading } = useMeQuery()

  if (!user) {
    return <Navigate to="/login" />
  }

  if (isLoading && userData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<BasicLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/setting"
          element={<DashboardLayout roleAccess={['ADMIN', 'SUPPLIER', 'PHARMACY']} />}
        >
          <Route index element={<ProfileInformation />} />
          <Route path="account" element={<AccountSettings />} />
          <Route path="password" element={<ChangePassword />} />
          <Route path="update" element={<UpdateProfile />} />
        </Route>

        <Route element={<DashboardLayout roleAccess={['ADMIN', 'SUPPLIER', 'PHARMACY']} />}>
          <Route path="/supplier-dashboard" element={<Dashboard />} />
          <Route path="/pending-orders" element={<SupplierOrdersPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/shipments" element={<Dashboard />} />
          <Route path="/customers" element={<Dashboard />} />
        </Route>

        <Route element={<DashboardLayout roleAccess={['ADMIN', 'PHARMACY', 'SUPPLIER']} />}>
          <Route path="/pharmacy-dashboard" element={<InventoryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/blockchain" element={<BlockchainPage />} />
          <Route path="/settings" element={<PharmacySetting />} />
        </Route>

        <Route element={<DashboardLayout roleAccess={['ADMIN']} />}>
          <Route path="/admin-dashboard" element={<SuperAdminDashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/pharmacies" element={<Pharmacies />} />
          <Route path="/suppliers" element={<Suppliers />} />
        </Route>

        <Route path="*" element={<NotFound />} />
        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
    </Router>
  )
}
