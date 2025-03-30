"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const Features = () => {
  // Create refs for the elements we want to animate
  const bottomSectionRef = useRef(null)
  const buttonRef = useRef(null)
  const textRef = useRef(null)
  const featuresContainerRef = useRef(null)
  const featureItemsRef = useRef([])  

  // Set up animations when component mounts
  useEffect(() => {
    // Make sure the bottom section is visible by default
    gsap.set(bottomSectionRef.current, {
      opacity: 1,
      y: 0,
      clearProps: "all", // Clear any previous GSAP properties
    })

    // Create hover animations
    const hoverTimeline = gsap.timeline({ paused: true })

    hoverTimeline
      .to(bottomSectionRef.current, {
        backgroundImage: "linear-gradient(to left, #ffffff, #a3a3a3)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        scale: 1.02,
        duration: 0.6,
        ease: "power2.out",
      })
      .to(
        buttonRef.current,
        {
          backgroundColor: "#333",
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.3",
      )
      .to(
        textRef.current,
        {
          
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.3",
      )

    // Add event listeners for hover
    const section = bottomSectionRef.current 

    const handleMouseEnter = () => {
      hoverTimeline.play()
    }

    const handleMouseLeave = () => {
      hoverTimeline.reverse()
    }

    section.addEventListener("mouseenter", handleMouseEnter)
    section.addEventListener("mouseleave", handleMouseLeave)

    // Add scroll animations for feature items
    featureItemsRef.current.forEach((item, index) => {
      gsap.fromTo(
        item,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top bottom-=100",
            toggleActions: "play none none none",
          },
          delay: index * 0.1, // Stagger the animations
        },
      )
    })

    // Add scroll animation for bottom section
    gsap.fromTo(
      bottomSectionRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bottomSectionRef.current,
          start: "top bottom-=50",
          toggleActions: "play none none none",
        },
      },
    )

    // Cleanup function to remove event listeners
    return () => {
      section.removeEventListener("mouseenter", handleMouseEnter)
      section.removeEventListener("mouseleave", handleMouseLeave)

      // Kill all ScrollTrigger instances to prevent memory leaks
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const features = [
    {
      id: "01",
      title: "AI-Driven Demand Forecasting",
      description:
        "Predict medicine demand using advanced ML models like SARIMA & LSTM, ensuring optimal inventory levels.",
      dark: true,
    },
    {
      id: "02",
      title: "Blockchain-Powered Transparency",
      description: "Record-level transaction security on the blockchain, preventing counterfeiting and ensuring trust.",
      dark: false,
    },
    {
      id: "03",
      title: "Automated Inventory Optimization",
      description: "Leverage smart contracts for automated reordering and real-time price adjustments.",
      dark: false,
    },
    {
      id: "04",
      title: "Secure & Tamper-Proof Data",
      description: "Decentralized data sharing enhances security, reducing risks of fraud and inefficiencies.",
      dark: false,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-[#F2F2F2] px-4 md:px-12 py-16">
      {/* Outer wrapper */}
      <div className="flex flex-col justify-start items-start w-full max-w-7xl">
        {/* Section title */}
        <div className="flex flex-col justify-start items-start mb-12">
          <div className="text-gray-800 text-sm py-2">
            <div className="flex flex-row bg-gradient-to-l from-[#f2f2f2] to-green-600 font-semibold w-24 rounded-xl justify-center items-center gap-1 px-2 py-1">
              <div className="w-3 h-3 flex flex-col justify-center items-center rounded-full bg-white z-10"></div>
              <span>features</span>
            </div>
          </div>

          {/* Subtitle */}
          <h2 className="text-black mt-2 text-3xl md:text-4xl font-bold px-0 max-w-2xl">
            Effortlessly Process Continues Supply
          </h2>
        </div>
      </div>

      {/* Feature items */}
      <div
        ref={featuresContainerRef}
        className="flex flex-row flex-wrap justify-center items-stretch gap-6 w-full max-w-7xl mb-20"
      >
        {features.map((feature, index) => (
          <div
            key={feature.id}
            ref={(el) => (featureItemsRef.current[index]= el  )}
            className={`relative feature-item h-auto min-h-[300px] w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] ${
              feature.dark ? "bg-black text-white" : "bg-white text-gray-800"
            } p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl`}
          >
            {/* Ensuring full height container */}
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="text-2xl font-bold mb-2 opacity-50">{feature.id}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              </div>
              {/* Description taking full remaining height */}
              <p className="text-sm opacity-80">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom section with GSAP animations - fixed to be always visible */}
      <div
        ref={bottomSectionRef}
        className="w-full max-w-7xl bg-gradient-to-l from-[#bfbebe] to-[#ffffff] font-semibold rounded-xl flex flex-col md:flex-row px-7 py-8 items-center justify-between gap-6 cursor-pointer transition-all duration-300 shadow-md"
      >
        <p ref={textRef} className="text-base md:text-xl text-center md:text-left">
          We combine AI & blockchain to bring you an innovative solution tailored for the pharmaceutical industry.
        </p>
        <button
          ref={buttonRef}
          className="px-6 py-3 bg-black text-white rounded-md transition-all duration-300 hover:bg-gray-800 whitespace-nowrap"
        >
          Start Now
        </button>
      </div>
    </div>
  )
}

export default Features

