import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLock, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi'

const AccessDenied: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <FiLock className="h-8 w-8 text-red-600" />
          </div>

          <h1 className="mb-2 text-2xl font-bold text-gray-800">Access Denied</h1>

          <div className="mb-4 flex items-center rounded border border-amber-200 bg-amber-50 p-2 text-amber-700">
            <FiAlertTriangle className="mr-2" />
            <p className="text-sm">You don't have permission to access this page</p>
          </div>

          <p className="mb-6 text-gray-600">
            Please contact your administrator if you believe this is an error.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              <FiArrowLeft className="mr-2" />
              Go Back
            </button>

            <button
              onClick={() => navigate('/')}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessDenied
