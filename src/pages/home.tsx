import Features from '@/components/Home/features'
import LandingComp from '@/components/Home/LandingComp'
import Keys from '@/components/Home/keys'
import WhyHowSection from '@/components/Home/WhyHowSection'
import WhyChooseUs from '@/components/Home/WhyChooseUs'




const Home = () => {
  return (
    <div className=''>
      <LandingComp/>
      <div className=''>
        <Features/>
      </div>
      <div className=' '>
        <Keys/>
      </div>
      <div className=' '>
        <WhyChooseUs/>
      </div>
      <div className=''>
        <WhyHowSection/>
      </div>
      
    </div>
  )
}

export default Home