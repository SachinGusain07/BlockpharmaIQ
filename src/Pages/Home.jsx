import React from 'react'
import LandingComp from '../Component/Home/LandingComp'
import Features from '../Component/Home/Features'
import WhyHowSection from '../Component/Home/WhyHowSection'


const Home = () => {
  return (
    <div className=''>
      <LandingComp/>
      <div className=''>
        <Features/>
      </div>
      <div className=''>
        <WhyHowSection/>
      </div>
    </div>
  )
}

export default Home
