/* eslint-disable @typescript-eslint/no-explicit-any */
import { userFormContextSchema } from '@/types/validations'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { RiCheckLine, RiUploadCloud2Line, RiUser3Line } from 'react-icons/ri'
import { Button } from '../ui/button'

enum ROLES {
  ADMIN = 'ADMIN',
  PHARMACY = 'PHARMACY',
  SUPPLIER = 'SUPPLIER',
  USER = 'USER',
}

interface IAddress {
  id: string
  userId: string
  street: string
  city: string
  state: string
  country: string
  zipCode: string
  createdAt: string
  updatedAt: string
}

interface IUser {
  id: string
  firstName: string
  lastName: string
  email: string
  password?: string
  confirmPassword?: string
  isProfileCompleted: boolean
  role: ROLES | string
  active: boolean
  phoneNumber: string
  profilePic?: string
  street?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  Address?: IAddress
  VendorOwner?: any
  VendorOrganization?: any
  Pharmacist?: any
  PharmacyOutlet?: any
  Orders?: any
  createdAt: string
}

interface IUserFormData extends Partial<IUser> {
  password?: string
  confirmPassword?: string
}

interface UserFormProps {
  initialData?: Partial<IUser>
  onSubmit: (data: Partial<IUserFormData>, profileData?: FormData) => void
  onCancel: () => void
  isCreating?: boolean
}

const UserForm: React.FC<UserFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isCreating = false,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileFile, setProfileFile] = useState<File | null>(null)

  const formMethods = useForm({
    resolver: yupResolver(userFormContextSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      phoneNumber: '',
      ...initialData,
    },
    mode: 'onChange',
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    trigger,
  } = formMethods

  const selectedRole = watch('role')

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
      })
    }
  }, [initialData, reset, isCreating])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const nextStep = async () => {
    const isStepValid = await trigger([
      'firstName',
      'lastName',
      'email',
      'role',
      'phoneNumber',
      'password',
      'confirmPassword',
    ])

    if (isStepValid) {
      setActiveStep(2)
    }
  }

  const prevStep = () => {
    setActiveStep(1)
  }

  const onFormSubmit = async (data: IUserFormData) => {
    try {
      if (isCreating) {
        const profileFormData = new FormData()
        if (data.phoneNumber) profileFormData.append('phoneNumber', data.phoneNumber)
        if (data.street) profileFormData.append('street', data.street)
        if (data.city) profileFormData.append('city', data.city)
        if (data.state) profileFormData.append('state', data.state)
        if (data.country) profileFormData.append('country', data.country)
        if (data.zipCode) profileFormData.append('zipCode', data.zipCode)
        if (data.role) profileFormData.append('role', data.role)
        if (profileFile) profileFormData.append('profilePic', profileFile)
        console.log('Form data:', profileFormData)
        onSubmit(data, profileFormData)
      } else {
        onSubmit(data)
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {activeStep === 1 && (
          <div className="animate-fadeIn">
            <h3 className="mb-6 text-xl font-semibold text-neutral-900">
              {isCreating ? 'Basic Information' : 'User Information'}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`mt-1 block w-full rounded-md border ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                    />
                  )}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`mt-1 block w-full rounded-md border ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                    />
                  )}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    className={`mt-1 block w-full rounded-md border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                  />
                )}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {isCreating && (
              <>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        className={`mt-1 block w-full rounded-md border ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                      />
                    )}
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        className={`mt-1 block w-full rounded-md border ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div
                    className={`flex overflow-hidden rounded-lg border ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    } focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}
                  >
                    <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500">
                      +91
                    </span>
                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="tel"
                          placeholder="Enter your phone number"
                          className="w-full border-none p-3 text-sm outline-none"
                        />
                      )}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="mt-6 mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Select Role
                  </label>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <label
                      className={`flex cursor-pointer flex-col rounded-lg border p-4 transition-all hover:border-blue-500 hover:shadow-sm ${
                        selectedRole === 'ADMIN'
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="mb-2 flex items-center">
                        <Controller
                          name="role"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="radio"
                              value="ADMIN"
                              checked={field.value === 'ADMIN'}
                              className="hidden"
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          )}
                        />
                        <div
                          className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border ${
                            selectedRole === 'ADMIN' ? 'border-blue-500' : 'border-gray-300'
                          }`}
                        >
                          {selectedRole === 'ADMIN' && (
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <span className="font-medium">Admin</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Admins have full access to the dashboard.
                      </p>
                    </label>

                    <label
                      className={`flex cursor-pointer flex-col rounded-lg border p-4 transition-all hover:border-blue-500 hover:shadow-sm ${
                        selectedRole === 'PHARMACY'
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="mb-2 flex items-center">
                        <Controller
                          name="role"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="radio"
                              value="PHARMACY"
                              checked={field.value === 'PHARMACY'}
                              className="hidden"
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          )}
                        />
                        <div
                          className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border ${
                            selectedRole === 'PHARMACY' ? 'border-blue-500' : 'border-gray-300'
                          }`}
                        >
                          {selectedRole === 'PHARMACY' && (
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <span className="font-medium">Pharmacy</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Management of retail pharmacy operations
                      </p>
                    </label>

                    <label
                      className={`flex cursor-pointer flex-col rounded-lg border p-4 transition-all hover:border-blue-500 hover:shadow-sm ${
                        selectedRole === 'SUPPLIER'
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="mb-2 flex items-center">
                        <Controller
                          name="role"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="radio"
                              value="SUPPLIER"
                              checked={field.value === 'SUPPLIER'}
                              className="hidden"
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          )}
                        />
                        <div
                          className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border ${
                            selectedRole === 'SUPPLIER' ? 'border-blue-500' : 'border-gray-300'
                          }`}
                        >
                          {selectedRole === 'SUPPLIER' && (
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <span className="font-medium">Distributor</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Supply chain and distribution services
                      </p>
                    </label>
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
                  )}
                </div>

                <div className="mt-6 mb-6 flex flex-col items-center">
                  <div className="group relative mb-4 h-24 w-24 overflow-hidden rounded-full bg-gray-100">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <RiUser3Line size={48} />
                      </div>
                    )}
                    <label
                      htmlFor="profilePic"
                      className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <RiUploadCloud2Line size={28} className="text-white" />
                    </label>
                    <input
                      type="file"
                      id="profilePic"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <label
                    htmlFor="profilePic"
                    className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Upload profile picture
                  </label>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Continue to Address
                  </Button>
                </div>
              </>
            )}

            {!isCreating && (
              <>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`mt-1 block w-full rounded-md border ${
                          errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                      />
                    )}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.role ? 'border-red-500' : 'border-gray-300'
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                      >
                        <option value="">Select a role</option>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPPLIER">Supplier</option>
                        <option value="PHARMACY">Pharmacy</option>
                      </select>
                    )}
                  />
                  {errors.role && (
                    <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="default">
                    Update User
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {activeStep === 2 && isCreating && (
          <div className="animate-fadeIn">
            <h3 className="mb-6 text-xl font-semibold text-neutral-900">Address Information</h3>

            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <Controller
                name="street"
                control={control}
                rules={{ required: 'Street address is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter your street address"
                    className={`w-full rounded-lg border ${
                      errors.street ? 'border-red-500' : 'border-gray-300'
                    } p-3 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                  />
                )}
              />
              {errors.street && (
                <p className="mt-1 text-xs text-red-500">{errors.street.message}</p>
              )}
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">City</label>
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: 'City is required' }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter your city"
                      className={`w-full rounded-lg border ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      } p-3 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  )}
                />
                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">State</label>
                <Controller
                  name="state"
                  control={control}
                  rules={{ required: 'State is required' }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter your state"
                      className={`w-full rounded-lg border ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      } p-3 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  )}
                />
                {errors.state && (
                  <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Country</label>
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: 'Country is required' }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter your country"
                      className={`w-full rounded-lg border ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      } p-3 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  )}
                />
                {errors.country && (
                  <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Zip Code</label>
                <Controller
                  name="zipCode"
                  control={control}
                  rules={{ required: 'Zip code is required' }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter your zip code"
                      className={`w-full rounded-lg border ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-300'
                      } p-3 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  )}
                />
                {errors.zipCode && (
                  <p className="mt-1 text-xs text-red-500">{errors.zipCode.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={prevStep}
                variant="outline"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
              >
                Back
              </Button>

              <Button
                type="submit"
                variant="default"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700"
              >
                Complete Setup
                <RiCheckLine size={18} />
              </Button>
            </div>
          </div>
        )}
      </form>
    </FormProvider>
  )
}

export default UserForm
