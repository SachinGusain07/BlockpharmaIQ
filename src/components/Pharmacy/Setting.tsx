import {
  BellIcon,
  BuildingStorefrontIcon,
  CreditCardIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
              <UserCircleIcon className="h-8 w-8 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
              <p className="text-sm text-gray-500">Manage your personal information</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                defaultValue="Pharmacy Owner"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                defaultValue="owner@pharmacy.com"
              />
            </div>
            <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
              Update Profile
            </button>
          </div>
        </div>

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
              <input
                type="text"
                className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                defaultValue="City Health Pharmacy"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue="Health City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue="HC1234"
                />
              </div>
            </div>
            <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
              Save Business Info
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <BellIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-500">Alert preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Low Stock Alerts</p>
                <p className="text-xs text-gray-500">Get notified when inventory is low</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-indigo-600 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
              </label>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Order Updates</p>
                <p className="text-xs text-gray-500">Notifications about shipments</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-indigo-600 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
              </label>
            </div>
            <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
              Save Preferences
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <CreditCardIcon className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Subscription</h3>
              <p className="text-sm text-gray-500">Plan and billing information</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg bg-indigo-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-indigo-800">Premium Plan</h4>
                  <p className="text-sm text-indigo-600">All features included</p>
                </div>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
                  Active
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold">
                $49<span className="text-sm font-normal text-gray-500">/month</span>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-700">Next billing</p>
              <p className="text-sm text-gray-500">November 15, 2023</p>
              <p className="mt-2 text-sm font-medium text-gray-700">Payment method</p>
              <p className="text-sm text-gray-500">Visa ending in 4242</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
                Update Payment
              </button>
              <button className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none">
                Cancel Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
