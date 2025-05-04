import { useMeQuery } from '@/services/api'
import {
  BuildingStorefrontIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline'

const Settings = () => {
  const userData = useMeQuery()
  const user = userData?.data?.body.data
  const ownerName = `${user?.firstName} ${user?.lastName}`

  const PharmacyDetails = user?.pharmacyOutlets?.[0] ?? null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Owner Information */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <UserCircleIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Owner Information</h3>
              <p className="text-sm text-gray-500">Account details</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                <span>{ownerName}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                <EnvelopeIcon className="mr-2 h-4 w-4" />
                <span>{user?.email}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="mt-1 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                <PhoneIcon className="mr-2 h-4 w-4" />
                <span>{user?.phoneNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pharmacy Details */}
        {PharmacyDetails && (
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
                <BuildingStorefrontIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Pharmacy Details</h3>
                <p className="text-sm text-gray-500">Business information</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Pharmacy Name</label>
                <div className="mt-1 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                  <span>{PharmacyDetails.businessName}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <div className="mt-1 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    <span>{PharmacyDetails.street}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <div className="mt-1 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                    <span>{PharmacyDetails.city}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <div className="mt-1 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                    <span>{PharmacyDetails.state}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                  <div className="mt-1 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                    <span>{PharmacyDetails.pincode}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <div className="mt-1 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                    <PhoneIcon className="mr-2 h-4 w-4" />
                    <span>{PharmacyDetails.phoneNumber}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                    <EnvelopeIcon className="mr-2 h-4 w-4" />
                    <span>{PharmacyDetails.email}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <div className="mt-1 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                    <GlobeAltIcon className="mr-2 h-4 w-4" />
                    <a
                      href={PharmacyDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {PharmacyDetails.website}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">GSTIN</label>
                  <div className="mt-1 flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                    <IdentificationIcon className="mr-2 h-4 w-4" />
                    <span>{PharmacyDetails.gstin}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings
