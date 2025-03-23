import React from 'react'
import { useForm } from 'react-hook-form'
import { SiComma } from "react-icons/si";


const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = (data) => {
      console.log(data) // Logs the form details (email and password)
    }
  
    return (
      <>
      <div className='hidden md:flex items-center justify-center w-[140vh] h-[75vh] bg-[#0A2C4B] rounded-[40px] shadow-xl text-white'>
        <div className='sm:hidden md:flex flex-row h-full w-1/2 justify-center items-center '>
          <div className=' flex flex-col justify-center gap-11 h-3/4 w-3/4'>
            <div className='flex flex-col gap-6'>
            <h1 className='text-4xl font-semibold'>
              Learn From Best Instructors In The World
            </h1>
            <p className='text-[#C8C8C8] text-sm w-5/6 '>
              here is a new logo for the SAAS website named blockPharma which is related to the pharmaceutical and blockchain technology,
            </p>
            </div>
  
            <div className='bg-[#113e67]  text-[#C8C8C8] rounded-xl text-sm p-3 flex-col justify-center items-center w-5/6'>
            <p className='flex flex-row gap-'><SiComma className='rotate-180 text-white p-0 m-0'/><SiComma className='p-0 m-0 rotate-180 text-white'/>
            </p>
              <p className=''>here is a new logo for the SAAS website named.</p>
              <span>- John Doe</span>
            </div>
          </div>
        </div>
  
        {/* Form Section */}
        <div className='flex flex-col items-center justify-center bg-[#FFFFFF] rounded-[38px] h-full w-1/2'>
        <h2 className='text-2xl text-black font-bold mb-4'>Welcome Back</h2>
          <form onSubmit={handleSubmit(onSubmit)} className='w-3/4'>
            
  
           
            <div className='mb-4'>
              <input
                type='email'
                placeholder='Email'
                className='p-2 w-full border-b  border-b-[#C8C8C8] outline-none text-black'
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
            </div>
  
            
            <div className='mb-4'>
              <input
                type='password'
                placeholder='Password'
                className='p-2 w-full border-b  border-b-[#C8C8C8] outline-none text-black'
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
            </div>
  
            
            <button
              type='submit'
              className='w-full bg-[#0A2C4B] text-white p-2 hover:scale-105 active:scale-100 duration-500 rounded-xl'
            >
              Login
            </button>
          </form>
          <p className='text-[#C8C8C8]'>Don’t have an account ?  <span className='text-[#0A2C4B] hover:scale-105 visited:text-cyan-800 cursor-pointer active:scale-100 rounded-xl duration-300'>Signup</span></p>
        </div>
      </div>









      
      
      {/* mobile view */}


      <div className='sm:flex md:hidden items-center justify-center w-[140vh] h-[75vh] rounded-[40px] text-white '>
        
  
        {/* Form Section */}
        <div className='flex flex-col items-center justify-center bg-[#FFFFFF] rounded-[38px] h-full w-full m-6 shadow-2xl'>
        <h2 className='text-2xl text-black font-bold mb-4'>Welcome Back</h2>
          <form onSubmit={handleSubmit(onSubmit)} className='w-3/4'>
            
  
           
            <div className='mb-4'>
              <input
                type='email'
                placeholder='Email'
                className='p-2 w-full border-b  border-b-[#C8C8C8] outline-none text-black'
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
            </div>
  
            
            <div className='mb-4'>
              <input
                type='password'
                placeholder='Password'
                className='p-2 w-full border-b  border-b-[#C8C8C8] outline-none text-black'
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
            </div>
  
            
            <button
              type='submit'
              className='w-full bg-[#0A2C4B] text-white p-2 hover:scale-105 active:scale-100 rounded-xl duration-300'
            >
              Login
            </button>
          </form>
          <p className='text-[#C8C8C8]'>Don’t have an account ?  <span className='text-[#0A2C4B] hover:scale-105 active:scale-100 rounded-xl duration-300'>Signup</span></p>
        </div>
      </div>




      
      </>
    )
}

export default Login
