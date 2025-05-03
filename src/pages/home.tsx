import CTA from '@/components/Home/CTA'
import Features from '@/components/Home/Features'
import Footer from '@/components/Home/Footer'
import HeroSection from '@/components/Home/HeroSection'
import HowItWorks from '@/components/Home/HowItWorks'
import WhyChooseUs from '@/components/Home/WhyChooseUs'

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center text-3xl text-black">
      <HeroSection />
      <Features />
      <WhyChooseUs />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  )
}

export default Home
