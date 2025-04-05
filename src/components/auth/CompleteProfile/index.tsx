import { useCompleteProfileMutation } from '@/services/api'
import { RootState, useAppSelector } from '@/store/store'
import { CompleteProfileFormData, completeProfileSchema } from '@/types/validations'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { RiCheckLine, RiUploadCloud2Line, RiUser3Line } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const ProfileCompletionForm: React.FC = () => {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState<number>(1)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const isProfileCompleted = useAppSelector((state) => state.user.isProfileCompleted)
  const [completeProfile, { isLoading: isProfileCompleting }] = useCompleteProfileMutation()
  const user = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (isProfileCompleted) {
      navigate('/inventory')
    }
  }, [isAuthenticated, navigate, isProfileCompleted, user])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CompleteProfileFormData>({
    resolver: yupResolver(completeProfileSchema),
    defaultValues: {
      phoneNumber: '',
      street: '',
    },
  })

  // const user = useAppSelector((state) => state.user)

  const watchedValues = watch()

  const calculateProgress = () => {
    const fields = ['phoneNumber', 'street', 'city', 'state', 'country', 'zipCode', 'role']
    const filledFields = fields.filter(
      (field) => watchedValues[field as keyof CompleteProfileFormData]
    )
    return Math.round((filledFields.length / fields.length) * 100)
  }

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
    setActiveStep(2)
  }

  const prevStep = () => {
    setActiveStep(1)
  }

  const onSubmit = async (data: CompleteProfileFormData) => {
    try {
      console.log('Form data:', data)
      const formData = new FormData()

      formData.append('phoneNumber', data.phoneNumber)
      formData.append('street', data.street)
      formData.append('city', data.city)
      formData.append('state', data.state)
      formData.append('country', data.country)
      formData.append('zipCode', data.zipCode)
      formData.append('role', data.role)

      console.log(profileFile)
      if (profileFile) {
        formData.append('profilePic', profileFile)
      }
      console.log('Form data with image:', formData)
      await completeProfile(formData).unwrap()

      toast.success('Profile completed successfully')
      navigate('/inventory')
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Error completing profile. Please try again.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="h-full w-full max-w-7xl overflow-hidden rounded-xl bg-white shadow-xl md:rounded-[30px] lg:flex">
        <div className="hidden lg:flex lg:w-5/12 lg:bg-gradient-to-br lg:from-[#0A2C4B] lg:to-[#16395b] lg:text-white">
          <div className="flex h-full w-full flex-col items-center justify-between p-8">
            <div className="h-full w-full">
              <div className="mb-12 flex h-14 items-center">
                <span className="text-2xl font-bold text-white">BlockPharma</span>
              </div>

              <div className="flex flex-col gap-6">
                <h1 className="text-4xl leading-tight font-bold tracking-tight">
                  Complete Your <br />
                  <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                    BlockPharma Profile
                  </span>
                </h1>
                <p className="text-[#C8C8C8]">
                  Add your details to unlock the full potential of our pharmaceutical blockchain
                  platform.
                </p>
              </div>
            </div>

            <div className="w-full space-y-8">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-300"></div>
                  <div className="h-2 w-2 rounded-full bg-blue-300/60"></div>
                  <div className="h-2 w-2 rounded-full bg-blue-300/30"></div>
                </div>
                <p className="text-sm text-[#C8C8C8]">Secure & Encrypted</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col p-6 md:p-8 lg:w-7/12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">Profile Setup</h2>
          </div>

          <div className="mb-8">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-700">Profile Completion</span>
              <span className="text-sm font-medium text-neutral-700">{calculateProgress()}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0A2C4B] to-blue-400 transition-all duration-500"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {activeStep === 1 && (
              <div className="animate-fadeIn">
                <h3 className="mb-6 text-xl font-semibold text-neutral-900">
                  Personal Information
                </h3>

                <div className="mb-6 flex flex-col items-center">
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
                      {...register('profilePic')}
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

                <div className="mb-6">
                  <label
                    htmlFor="phoneNumber"
                    className="mb-1.5 block text-sm font-medium text-neutral-700"
                  >
                    Phone Number
                  </label>
                  <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-[#0A2C4B] focus-within:ring-1 focus-within:ring-[#0A2C4B]">
                    <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500">
                      +91
                    </span>
                    <input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="w-full border-none p-3 text-sm outline-none"
                      {...register('phoneNumber')}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="mb-8">
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Select Your Role
                  </label>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <label
                      className={`flex cursor-pointer flex-col rounded-lg border p-4 transition-all hover:border-[#0A2C4B] hover:shadow-sm ${watchedValues.role === 'ADMIN' ? 'border-[#0A2C4B] bg-blue-50 shadow-sm' : 'border-gray-200'}`}
                    >
                      <div className="mb-2 flex items-center">
                        <input
                          type="radio"
                          value="ADMIN"
                          className="hidden"
                          {...register('role')}
                        />
                        <div
                          className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border ${watchedValues.role === 'ADMIN' ? 'border-[#0A2C4B]' : 'border-gray-300'}`}
                        >
                          {watchedValues.role === 'ADMIN' && (
                            <div className="h-3 w-3 rounded-full bg-[#0A2C4B]"></div>
                          )}
                        </div>
                        <span className="font-medium">Manufacturer</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Production and creation of pharmaceutical products
                      </p>
                    </label>

                    <label
                      className={`flex cursor-pointer flex-col rounded-lg border p-4 transition-all hover:border-[#0A2C4B] hover:shadow-sm ${watchedValues.role === 'PHARMACY' ? 'border-[#0A2C4B] bg-blue-50 shadow-sm' : 'border-gray-200'}`}
                    >
                      <div className="mb-2 flex items-center">
                        <input
                          type="radio"
                          value="PHARMACY"
                          className="hidden"
                          {...register('role')}
                        />
                        <div
                          className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border ${watchedValues.role === 'PHARMACY' ? 'border-[#0A2C4B]' : 'border-gray-300'}`}
                        >
                          {watchedValues.role === 'PHARMACY' && (
                            <div className="h-3 w-3 rounded-full bg-[#0A2C4B]"></div>
                          )}
                        </div>
                        <span className="font-medium">Pharmacy Owner</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Management of retail pharmacy operations
                      </p>
                    </label>

                    <label
                      className={`flex cursor-pointer flex-col rounded-lg border p-4 transition-all hover:border-[#0A2C4B] hover:shadow-sm ${watchedValues.role === 'SUPPLIER' ? 'border-[#0A2C4B] bg-blue-50 shadow-sm' : 'border-gray-200'}`}
                    >
                      <div className="mb-2 flex items-center">
                        <input
                          type="radio"
                          value="SUPPLIER"
                          className="hidden"
                          {...register('role')}
                        />
                        <div
                          className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border ${watchedValues.role === 'SUPPLIER' ? 'border-[#0A2C4B]' : 'border-gray-300'}`}
                        >
                          {watchedValues.role === 'SUPPLIER' && (
                            <div className="h-3 w-3 rounded-full bg-[#0A2C4B]"></div>
                          )}
                        </div>
                        <span className="font-medium">Vendor / Distributor</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Supply chain and distribution services
                      </p>
                    </label>
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="rounded-lg bg-[#0A2C4B] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#113e67] focus:ring-2 focus:ring-[#0A2C4B] focus:ring-offset-2 focus:outline-none"
                  >
                    Continue to Address
                  </button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="animate-fadeIn">
                <h3 className="mb-6 text-xl font-semibold text-neutral-900">Address Information</h3>

                <div className="mb-4">
                  <label
                    htmlFor="street"
                    className="mb-1.5 block text-sm font-medium text-neutral-700"
                  >
                    Street Address
                  </label>
                  <input
                    id="street"
                    type="text"
                    placeholder="Enter your street address"
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-[#0A2C4B] focus:ring-1 focus:ring-[#0A2C4B] focus:outline-none"
                    {...register('street')}
                  />
                  {errors.street && (
                    <p className="mt-1 text-sm text-red-500">{errors.street.message}</p>
                  )}
                </div>

                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder="Enter your city"
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-[#0A2C4B] focus:ring-1 focus:ring-[#0A2C4B] focus:outline-none"
                      {...register('city')}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                      State
                    </label>
                    <input
                      id="state"
                      type="text"
                      placeholder="Enter your state"
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-[#0A2C4B] focus:ring-1 focus:ring-[#0A2C4B] focus:outline-none"
                      {...register('state')}
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="country"
                      className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                      Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      placeholder="Enter your country"
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-[#0A2C4B] focus:ring-1 focus:ring-[#0A2C4B] focus:outline-none"
                      {...register('country')}
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="zipCode"
                      className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                      Zip Code
                    </label>
                    <input
                      id="zipCode"
                      type="text"
                      placeholder="Enter your zip code"
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-[#0A2C4B] focus:ring-1 focus:ring-[#0A2C4B] focus:outline-none"
                      {...register('zipCode')}
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-500">{errors.zipCode.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isProfileCompleting}
                    className="disabled:bg-opacity-70 flex items-center gap-2 rounded-lg bg-[#0A2C4B] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#113e67] focus:ring-2 focus:ring-[#0A2C4B] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed"
                  >
                    {isProfileCompleting ? (
                      'Submitting...'
                    ) : (
                      <>
                        Complete Setup
                        <RiCheckLine size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileCompletionForm
