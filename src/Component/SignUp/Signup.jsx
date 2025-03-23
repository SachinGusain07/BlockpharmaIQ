import React from 'react'
import { useForm } from 'react-hook-form'
import { SiComma } from "react-icons/si";

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, watch, clearErrors, setValue } = useForm()

  const onSubmit = (data) => {
    console.log(data) // Logs the form details (full name, email, password, confirm password, and agreement)
  }

  return (
    <>
      <div className='hidden md:flex items-center justify-center w-[140vh] h-[75vh] bg-[#0A2C4B] rounded-[40px] shadow drop-shadow-lg text-white'>
        <div className='flex flex-row h-full w-1/2 justify-center items-center'>
          <div className='flex flex-col justify-center gap-11 h-3/4 w-3/4'>
            <div className='flex flex-col gap-4'>
              <h1 className='text-4xl font-semibold'>
                Learn From Best Instructors In The World
              </h1>
              <p className='text-[#C8C8C8] text-sm w-5/6 '>
                here is a new logo for the SAAS website named blockPharma which is related to the pharmaceutical and blockchain technology,
              </p>
            </div>

            <div className='bg-[#113e67] text-[#C8C8C8] rounded-xl p-3 text-sm flex-col justify-center items-center w-5/6'>
             <p className='flex flex-row gap-'><SiComma className='rotate-180 text-white p-0 m-0'/><SiComma className='p-0 m-0 rotate-180 text-white'/>
              </p>
              <p>here is a new logo for the SAAS website named.</p>
              <span>- John Doe</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className='flex flex-col items-center justify-center bg-[#FFFFFF] rounded-[38px] h-full w-1/2'>
          <h2 className='text-2xl text-black font-bold mb-4'>Create Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className='w-3/4'>
            
            {/* Full Name Field */}
            <div className='mb-4'>
              <input
                type='text'
                placeholder='Full Name'
                className='p-2 w-full border-b border-b-[#C8C8C8] outline-none text-black'
                {...register('fullName', { required: 'Full Name is required' })}
                onChange={(e) => {
                  setValue('fullName', e.target.value); // Update the form value explicitly
                  clearErrors('fullName'); // Clear error when user starts typing
                }}
              />
              {errors.fullName && <p className='text-red-500 text-sm'>{errors.fullName.message}</p>}
            </div>

            {/* Email Field */}
            <div className='mb-4'>
              <input
                type='email'
                placeholder='Email'
                className='p-2 w-full border-b border-b-[#C8C8C8] outline-none text-black'
                {...register('email', { required: 'Email is required' })}
                onChange={(e) => {
                  setValue('email', e.target.value); // Update the form value explicitly
                  clearErrors('email'); // Clear error when user starts typing
                }}
              />
              {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className='mb-4'>
              <input
                type='password'
                placeholder='Password'
                className='p-2 w-full border-b border-b-[#C8C8C8] outline-none text-black'
                {...register('password', { required: 'Password is required' })}
                onChange={(e) => {
                  setValue('password', e.target.value); // Update the form value explicitly
                  clearErrors('password'); // Clear error when user starts typing
                }}
              />
              {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className='mb-4'>
              <input
                type='password'
                placeholder='Confirm Password'
                className='p-2 w-full border-b border-b-[#C8C8C8] outline-none text-black'
                {...register('confirmPassword', {
                  required: 'Confirm Password is required',
                  validate: value => value === watch('password') || 'Passwords do not match'
                })}
                onChange={(e) => {
                  setValue('confirmPassword', e.target.value); // Update the form value explicitly
                  clearErrors('confirmPassword'); // Clear error when user starts typing
                }}
              />
              {errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms of Service and Privacy Policy Checkbox */}
            <div className='mb-4 flex items-center'>
              <input
                type='checkbox'
                className='mr-2'
                {...register('agree', { required: 'You must agree to the terms of service and privacy policy' })}
              />
              <label className='text-sm text-[#b9b7b7]'>
                I agree to the{' '}
                <span className='text-blue-500 cursor-pointer'>Terms of Service</span> and{' '}
                <span className='text-blue-500 cursor-pointer'>Privacy Policy</span>
              </label>
            </div>
            {errors.agree && <p className='text-red-500 text-sm'>{errors.agree.message}</p>}

            {/* Signup Button */}
            <button
              type='submit'
              className='w-full bg-[#0A2C4B] text-white p-2 rounded-xl hover:scale-105 active:scale-100 duration-500 ease-in-out'
            >
              Signup
            </button>
          </form>
          <p className='text-[#b9b7b7] pt-2'>Already have an account ?<span className='text-[#0A2C4B] font-semibold'>Login</span></p>
        </div>
      </div>













      {/* mobile version */}
      <div className='sm:flex md:hidden items-center justify-center w-[140vh] h-[75vh] rounded-[40px]  shadow drop-shadow-lg text-white'>
        <div className='flex flex-col items-center justify-center bg-[#FFFFFF] rounded-3xl h-full w-full m-9'>
          <h2 className='text-2xl text-black font-bold mb-4'>Create Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className='w-3/4'>
            
            {/* Full Name Field */}
            <div className='mb-4'>
              <input
                type='text'
                placeholder='Full Name'
                className='p-2 w-full border-b border-b-[#C8C8C8] outline-none text-black'
                {...register('fullName', { required: 'Full Name is required' })}
                onChange={(e) => {
                  setValue('fullName', e.target.value); // Update the form value explicitly
                  clearErrors('fullName'); // Clear error when user starts typing
                }}
              />
              {errors.fullName && <p className='text-red-500 text-sm'>{errors.fullName.message}</p>}
            </div>

            {/* Email Field */}
            <div className='mb-4'>
              <input
                type='email'
                placeholder='Email'
                className='p-2 w-full border-b border-b-[#C8C8C8] outline-none text-black'
                {...register('email', { required: 'Email is required' })}
                onChange={(e) => {
                  setValue('email', e.target.value); // Update the form value explicitly
                  clearErrors('email'); // Clear error when user starts typing
                }}
              />
              {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className='mb-4'>
              <input
                type='password'
                placeholder='Password'
                className='p-2 w-full border-b border-b-[#C8C8C8] outline-none text-black'
                {...register('password', { required: 'Password is required' })}
                onChange={(e) => {
                  setValue('password', e.target.value); // Update the form value explicitly
                  clearErrors('password'); // Clear error when user starts typing
                }}
              />
              {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className='mb-4'>
              <input
                type='password'
                placeholder='Confirm Password'
                className='p-2 w-full border-b border-b-[#C8C8C8] outline-none text-black'
                {...register('confirmPassword', {
                  required: 'Confirm Password is required',
                  validate: value => value === watch('password') || 'Passwords do not match'
                })}
                onChange={(e) => {
                  setValue('confirmPassword', e.target.value); // Update the form value explicitly
                  clearErrors('confirmPassword'); // Clear error when user starts typing
                }}
              />
              {errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms of Service and Privacy Policy Checkbox */}
            <div className='mb-4 flex items-center'>
              <input
                type='checkbox'
                className='mr-2'
                {...register('agree', { required: 'You must agree to the terms of service and privacy policy' })}
              />
              <label className='text-sm text-[#b9b7b7]'>
                I agree to the{' '}
                <span className='text-blue-500 cursor-pointer'>Terms of Service</span> and{' '}
                <span className='text-blue-500 cursor-pointer'>Privacy Policy</span>
              </label>
            </div>
            {errors.agree && <p className='text-red-500 text-sm'>{errors.agree.message}</p>}

            {/* Signup Button */}
            <button
              type='submit'
              className='w-full bg-[#0A2C4B] text-white p-2 rounded-xl hover:scale-105 active:scale-100 duration-500 ease-in-out'
            >
              Signup
            </button>
          </form>
          <p className='text-[#b9b7b7] pt-2'>Already have an account ?<span className='text-[#0A2C4B] font-semibold'>Login</span></p>
        </div>
      </div>
    </>
  )
}

export default Signup
