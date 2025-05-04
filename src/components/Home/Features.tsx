import { motion } from 'motion/react'
import rightArrow from '../../assests/right-arrow.svg'
const processSlides = [
  {
    title: 'AI-Driven Demand Forecasting',
    description: 'Predict medicine demand using AI and ML to ensure optimal inventory.',
  },
  {
    title: 'Blockchain-Powered Transparency',
    description: 'Record every transaction securely, preventing counterfeiting and ensuring trust.',
  },
  {
    title: 'Optimized Inventory Management',
    description: 'Leverage smart contracts for real-time pricing and inventory adjustments.',
  },
  {
    title: 'Secure & Tamper-Proof Data',
    description: 'Decentralized data sharing ensures security and reduces inefficiencies.',
  },
]

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
        duration: 0.6,
      },
    },
  }

  return (
    <div className="mt-16 h-screen w-full max-w-6xl p-5">
      <div className="flex w-full items-center">
        <h3 className="w-[35%] text-4xl font-extrabold">
          Effortlessly Process <br /> Continues Supply
        </h3>
        <div className="h-[1px] w-[65%] border" />
      </div>
      <motion.div
        className="mt-16 flex w-full items-center justify-between gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {processSlides.map((slide, index) => (
          <motion.div key={index} variants={cardVariants}>
            <FeatureCard index={index} title={slide.title} description={slide.description} />
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-10 flex w-full items-center justify-between gap-5 rounded-2xl bg-gradient-to-r from-[#F9F9F9] to-[#E6E6E6] p-3 text-base font-medium text-gray-500">
        <h3>
          We combine AI & blockchain to bring you an innovative solution tailored for the
          pharmaceutical industry.
        </h3>
        <div className="flex items-center justify-between gap-2 rounded-full bg-black px-2 py-2 text-white">
          <h3>Start Now</h3>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <img src={rightArrow} className="h-7 w-7" />
          </div>
        </div>
      </div>
    </div>
  )
}

const FeatureCard = (props: { title: string; description: string; index: number }) => {
  return (
    <div
      className={`flex h-96 w-full flex-col justify-between rounded-3xl p-6 shadow transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${props.index === 0 ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-black'}`}
    >
      <div>
        <h3 className="text-xl font-bold">{`${'0' + (props.index + 1)}.`}</h3>
        <h3 className="mt-2 text-xl font-bold">{props.title}</h3>
      </div>
      <p className="mt-4 text-sm font-medium">{props.description}</p>
    </div>
  )
}

export default Features
