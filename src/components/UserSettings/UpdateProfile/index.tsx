import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useEffect } from 'react'

const UpdateProfile = () => {
  const updateSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().required('Email is required').email('Invalid email address'),
    phoneNumber: yup.string().matches(/^[0-9+-]+$/, 'Please enter a valid phone number'),
    street: yup.string().required('Street address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    country: yup.string().required('Country is required'),
    zipCode: yup.string().required('Zip code is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters'),
  })

  type UpdateFormData = yup.InferType<typeof updateSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateFormData>({
    resolver: yupResolver(updateSchema),
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/me')
        const userData = response.data

        reset({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          street: userData.street,
          city: userData.city,
          state: userData.state,
          country: userData.country,
          zipCode: userData.zipCode,
        })
      } catch (error) {
        console.error('Failed to load user data', error)
      }
    }

    fetchUserData()
  }, [reset])

  const onSubmit = async (data: UpdateFormData) => {
    try {
      const payload = {
        ...data,
        ...(data.password ? { password: data.password } : {}),
      }

      await api.put('/users/me', payload)
      console.log('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile', error)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl rounded-lg bg-white p-6">
      <h1 className="mb-10 text-3xl font-bold">Update Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* First Name */}
          <div className="space-y-2">
            <label htmlFor="firstName" className="sr-only">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="First Name"
              className="w-full border-b border-gray-300 px-3 py-2 placeholder:text-sm placeholder:font-medium focus:border-gray-500 focus:outline-none"
              {...register('firstName')}
            />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label htmlFor="lastName" className="sr-only">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Last Name"
              className="w-full border-b border-gray-300 px-3 py-2 placeholder:text-sm placeholder:font-medium focus:border-gray-500 focus:outline-none"
              {...register('lastName')}
            />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              className="w-full border-b border-gray-300 px-3 py-2 placeholder:text-sm placeholder:font-medium focus:border-gray-500 focus:outline-none"
              {...register('email')}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="sr-only">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              placeholder="Phone Number"
              className="w-full border-b border-gray-300 px-3 py-2 placeholder:text-sm placeholder:font-medium focus:border-gray-500 focus:outline-none"
              {...register('phoneNumber')}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <label htmlFor="street" className="sr-only">
              Street Address
            </label>
            <input
              id="street"
              type="text"
              placeholder="Street Address"
              className="w-full border-b border-gray-300 px-3 py-2 placeholder:text-sm placeholder:font-medium focus:border-gray-500 focus:outline-none"
              {...register('street')}
            />
            {errors.street && <p className="text-sm text-red-500">{errors.street.message}</p>}
          </div>

          {/* City */}
          <div className="space-y-2">
            <label htmlFor="city" className="sr-only">
              City
            </label>
            <input
              id="city"
              type="text"
              placeholder="City"
              className="w-full border-b border-gray-300 px-3 py-2 placeholder:text-sm placeholder:font-medium focus:border-gray-500 focus:outline-none"
              {...register('city')}
            />
            {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
          </div>

          {/* State */}
          <div className="space-y-2">
            <label htmlFor="state" className="sr-only">
              State
            </label>
            <input
              id="state"
              type="text"
              placeholder="State"
              className="w-full border-b border-gray-300 px-3 py-2 placeholder:text-sm placeholder:font-medium focus:border-gray-500 focus:outline-none"
              {...register('state')}
            />
            {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label htmlFor="country" className="sr-only">
              Country
            </label>
            <input
              id="country"
              type="text"
              placeholder="Country"
              className="w-full border-b border-gray-300 px-3 py-2 placeholder:text-sm placeholder:font-medium focus:border-gray-500 focus:outline-none"
              {...register('country')}
            />
            {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
          </div>

          {/* Zip Code */}
          <div className="space-y-2">
            <label htmlFor="zipCode" className="sr-only">
              Zip Code
            </label>
            <input
              id="zipCode"
              type="text"
              placeholder="Zip Code"
              className="w-full border-b border-gray-300 px-3 py-2 placeholder:text-sm placeholder:font-medium focus:border-gray-500 focus:outline-none"
              {...register('zipCode')}
            />
            {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode.message}</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-black px-6 py-3 text-xs font-medium text-white transition-colors hover:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateProfile
