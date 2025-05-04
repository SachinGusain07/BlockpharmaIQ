import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import heroImage from '../../assests/heroImage.png'

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const imageRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [10, 0])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const headingVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: 'easeInOut',
      },
    },
  }
  return (
    <>
      <div className="mt-16 flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div
          className="flex w-full max-w-5xl flex-col items-center justify-center gap-4 text-center"
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          variants={headingVariants}
        >
          <h1 className="font-plusJakarta text-[90px] leading-tight font-extrabold md:leading-[11vh]">
            Experience the future <br /> of medicine with BlockPharma.
          </h1>
          <p className="font-plusJakarta text-base leading-tight font-medium text-gray-500 md:text-lg">
            Transparent, secure, and efficient pharmaceutical supply chain management.
          </p>
          <motion.button
            className="mt-4 w-auto rounded-lg bg-black px-16 py-2 text-base font-medium text-white hover:bg-neutral-900"
            whileHover="hover"
            whileTap="tap"
          >
            Try a Demo
          </motion.button>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        viewport={{ once: true }}
        className="relative mt-8 flex w-full max-w-6xl flex-col items-center justify-center border-gray-200"
      >
        <motion.div
          ref={imageRef}
          style={{
            scale,
            rotateX,
            transformOrigin: 'bottom center',
          }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          viewport={{ once: false, margin: '-50px' }}
          className="relative z-10 w-full p-5"
        >
          <img
            src={heroImage}
            alt="Hero"
            className="relative z-10 rounded-lg border shadow-2xl shadow-gray-500/20 backdrop-blur-3xl"
          />
        </motion.div>
      </motion.div>
    </>
  )
}

export default HeroSection
