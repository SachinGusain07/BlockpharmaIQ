import { lazy } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import Authenticated from './layout/Authenticated'
import BasicLayout from './layout/Basic'
import PharmacyLayout from './layout/PharmacyLayout'
import SettingLayout from './layout/SettingLayout'
import Home from './pages/home'

import { useSelector } from 'react-redux'
import ProfileCompletionForm from './components/auth/CompleteProfile'
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
        {/* Public Route */}
        <Route element={<BasicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Authenticated />}>
          <Route path="/setting" element={<SettingLayout />}>
            <Route index element={<ProfileInformation />} />
            <Route path="account" element={<AccountSettings />} />
            <Route path="password" element={<ChangePassword />} />
            <Route path="update" element={<UpdateProfile />} />
          </Route>
        </Route>

        <Route element={<PharmacyLayout />}>
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/blockchain" element={<BlockchainPage />} />
          <Route path="/settings" element={<PharmacySetting />} />
        </Route>

        <Route path="/complete-profile" element={<ProfileCompletionForm />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
