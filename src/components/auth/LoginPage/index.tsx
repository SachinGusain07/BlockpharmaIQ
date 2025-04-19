import { PasswordInput } from '@/components/ui/PasswordInput'
import { useLoginMutation } from '@/services/api'
import { setUser } from '@/store/reducers/userReducer'
import { useAppDispatch } from '@/store/store'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { RiDoubleQuotesL } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as yup from 'yup'

const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

type LoginFormData = yup.InferType<typeof loginSchema>

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  })

  const [loginUser, { isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onSubmit = async (formData: LoginFormData) => {
    try {
      const data = await loginUser(formData).unwrap()
      if (!data) {
        toast.error('Login failed. Please check your credentials.')
        return
      }

      toast.success('Login successful')
      dispatch(setUser({ data: data.body.data.user }))
      if (data.body.data.user.role === 'ADMIN') {
        toast.success('Welcome Admin!')
        navigate('/admin-dashboard')
      } else if (data.body.data.user.role === 'SUPPLIER') {
        toast.success('Welcome Supplier!')
        navigate('/supplier-dashboard')
      } else if (data.body.data.user.role === 'PHARMACY') {
        toast.success('Welcome Pharmacy!')
        navigate('/pharmacy-dashboard')
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.')
      console.error('Login error:', error)
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
                  Welcome Back to BlockPharma
                </h1>
                <p className="text-sm text-[#C8C8C8]">
                  Access your pharmaceutical blockchain platform with secure credentials.
                </p>
              </div>

              <div className="rounded-xl bg-[#16395bb5] p-4 text-sm text-[#C8C8C8]">
                <div className="flex">
                  <RiDoubleQuotesL size={36} className="rotate-180 text-white" />
                </div>
                <p className="mt-1">Secure access to your pharmaceutical blockchain solutions.</p>
                <span className="block pt-1 font-medium">- BlockPharma Team</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center p-4 md:p-6 lg:w-1/2 lg:rounded-r-[40px] lg:p-8">
          <h2 className="mb-6 w-full max-w-md text-center text-2xl font-bold text-neutral-900 md:text-left">
            Login to Your Account
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
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

            <div className="mb-6 flex justify-end">
              <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="focus:ring-opacity-50 mt-5 w-full rounded-xl bg-[#0A2C4B] py-3 text-sm font-medium text-white transition-all hover:bg-[#113e67] focus:ring-2 focus:ring-[#0A2C4B] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Logging In...' : 'Login'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-[#b9b7b7] md:text-left">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-[#0A2C4B] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
