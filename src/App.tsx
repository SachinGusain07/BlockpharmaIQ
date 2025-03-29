import { lazy } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import Authenticated from './layout/Authenticated'
import BasicLayout from './layout/Basic'
import SettingLayout from './layout/SettingLayout'
import Home from './pages/home'

const ProfileInformation = lazy(() => import('./pages/profile-info'))
const AccountSettings = lazy(() => import('./pages/account-setting'))
const ChangePassword = lazy(() => import('./pages/change-password'))
const UpdateProfile = lazy(() => import('./pages/update-profile'))
const NotFound = lazy(() => import('./pages/not-found'))
const Signup = lazy(() => import('./pages/signup'))

export const App = () => {
  return (
    <Router basename="/">
      <Routes>
        {/* Public Route */}
        <Route element={<BasicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes using Authenticated Layout */}
        <Route element={<Authenticated />}>
          <Route element={<SettingLayout />}>
            <Route path="/setting" element={<ProfileInformation />} />
            <Route path="/setting/account" element={<AccountSettings />} />
            <Route path="/setting/password" element={<ChangePassword />} />
            <Route path="/setting/update" element={<UpdateProfile />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
