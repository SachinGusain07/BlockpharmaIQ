import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const UpdateProfile = () => {
  const updateSchema = yup.object({
    fullName: yup.string().required('Full name is required'),
    email: yup.string().required('Email is required').email('Invalid email address'),
    phone: yup.string().matches(/^[0-9+-]+$/, 'Please enter a valid phone number'),
  })

  type UpdateFormData = yup.InferType<typeof updateSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateSchema),
  })

  const onSubmit = (data: UpdateFormData) => {
    console.log('Form submitted:', data)
  }

  return (
    <div className="mx-auto w-full max-w-4xl rounded-lg bg-white p-6">
      <h1 className="mb-10 text-3xl font-bold">Update Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="fullName" className="sr-only">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Full Name"
              className="w-full border-b border-gray-300 px-3 py-2 placeholder:text-sm placeholder:font-medium focus:border-gray-500 focus:outline-none"
              {...register('fullName')}
            />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
          </div>

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
        </div>

        <div>
          <label htmlFor="phone" className="sr-only">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="Phone number"
            className="w-full border-b border-gray-300 px-3 py-2 placeholder:text-sm placeholder:font-medium focus:border-gray-500 focus:outline-none"
            {...register('phone')}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-black px-6 py-3 text-xs font-medium text-white transition-colors hover:bg-gray-800"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateProfile
