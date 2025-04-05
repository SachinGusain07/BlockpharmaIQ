import { PasswordInput } from '@/components/ui/PasswordInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { RiDoubleQuotesL } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useRegisterMutation } from '@/services/api'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

// Updated Yup validation schema
const signupSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  agree: yup
    .boolean()
    .oneOf([true], 'You must accept the terms')
    .transform((value) => value === true || value === 'on')
    .required('You must accept the terms'),
})

type FormData = yup.InferType<typeof signupSchema>

const Signup = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      agree: true,
    },
  })

  const [registerUser, isLoading] = useRegisterMutation()
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/setting')
      return
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (formData: FormData) => {
    try {
      const data = await registerUser(formData).unwrap()
      if (data) {
        toast.success('Registration successful')
        reset()
        navigate('/login')
      }
    } catch (error) {
      toast.error('Registration failed')
      console.log(error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-7xl rounded-xl bg-white shadow-lg md:h-[75vh] md:overflow-hidden md:rounded-[40px] lg:flex">
        <div className="hidden lg:flex lg:h-full lg:w-1/2 lg:bg-[#0A2C4B] lg:text-white">
          <div className="flex h-full w-full items-center justify-center p-4 md:p-8">
            <div className="flex h-3/4 w-full flex-col justify-between gap-8 px-4 md:w-3/4">
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl leading-tight font-bold tracking-normal md:text-4xl">
                  Learn From Best Instructors In The World
                </h1>
                <p className="text-sm text-[#C8C8C8]">
                  Here is a new logo for the SAAS website named blockPharma which is related to the
                  pharmaceutical and blockchain technology.
                </p>
              </div>

              <div className="rounded-xl bg-[#16395bb5] p-4 text-sm text-[#C8C8C8]">
                <div className="flex">
                  <RiDoubleQuotesL size={36} className="rotate-180 text-white" />
                </div>
                <p className="mt-1">Here is a new logo for the SAAS website named.</p>
                <span className="block pt-1 font-medium">- John Doe</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center p-4 md:p-6 lg:w-1/2 lg:rounded-r-[40px] lg:p-8">
          <h2 className="mb-6 w-full max-w-md text-center text-2xl font-bold text-neutral-900 md:text-left">
            Create Account
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  className={`w-full border-b p-2 text-sm font-medium text-neutral-900 outline-none placeholder:font-medium ${
                    errors.firstName ? 'border-red-500' : 'border-[#C8C8C8]'
                  }`}
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  className={`w-full border-b p-2 text-sm font-medium text-neutral-900 outline-none placeholder:font-medium ${
                    errors.lastName ? 'border-red-500' : 'border-[#C8C8C8]'
                  }`}
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className={`w-full border-b p-2 text-sm font-medium text-neutral-900 outline-none placeholder:font-medium ${
                  errors.email ? 'border-red-500' : 'border-[#C8C8C8]'
                }`}
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <PasswordInput
              name="password"
              register={register}
              error={errors.password}
              placeholder="Password"
              showToggle
            />
            <PasswordInput
              name="confirmPassword"
              register={register}
              error={errors.confirmPassword}
              placeholder="Confirm Password"
              showToggle
            />

            <div className="mb-6 flex items-start">
              <input type="checkbox" id="agree" className="mt-1 mr-2" {...register('agree')} />
              <label htmlFor="agree" className="text-sm text-[#b9b7b7]">
                I agree to the{' '}
                <Link to="#" className="text-blue-500 hover:underline">
                  Terms of Service{' '}
                </Link>
                and{' '}
                <Link to="#" className="text-blue-500 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agree && (
              <p className="-mt-4 mb-4 text-sm text-red-500">{errors.agree.message}</p>
            )}
            <button
              type="submit"
              className="focus:ring-opacity-50 mt-5 w-full rounded-xl bg-[#0A2C4B] py-3 text-sm font-medium text-white transition-all hover:bg-[#113e67] focus:ring-2 focus:ring-[#0A2C4B] focus:outline-none"
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-[#b9b7b7] md:text-left">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#0A2C4B] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
