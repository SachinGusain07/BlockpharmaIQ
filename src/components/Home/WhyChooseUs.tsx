import React from 'react'
import doctor from '../../assests/Doctor rushing.svg'
import Geolocation from '../../assests/Geolocation.svg'
import health from '../../assests/Health monitoring.svg'
import Blockchain from '../../assests/blockchain technologies.svg'
import CloudComputing from '../../assests/cloud computing.svg'

type CardProps = {
  title: string
  description: string
  icon: React.ReactNode
}

const Card: React.FC<CardProps> = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-6 transition-transform duration-200 hover:scale-[1.02]">
      <div className="flex h-48 items-center justify-center">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}

const WhyChooseUs: React.FC = () => {
  const topCards = [
    {
      title: 'Next–Gen Technology',
      description:
        'We combine AI & blockchain to bring you an innovative solution tailored for the pharmaceutical industry.',
      icon: <img src={Blockchain} alt="Next-Gen" className="h-48 w-48" />,
    },
    {
      title: 'Eliminating Counterfeit Drugs',
      description:
        'Blockchain-based verification ensures that all medicines in your inventory are 100% authentic.',
      icon: <img src={Geolocation} alt="Counterfeit" className="h-48 w-48" />,
    },
    {
      title: 'Cost & Waste Reduction',
      description: 'Our demand forecasting prevents overstocking and stockouts, minimizing losses.',
      icon: <img src={doctor} alt="Cost Reduction" className="h-48 w-48" />,
    },
  ]

  const bottomCards = [
    {
      title: 'Data Privacy & Security',
      description:
        'End-to-end encryption ensures that your business data remains secure and confidential.',
      icon: <img src={health} alt="Privacy" className="h-48 w-48" />,
    },
    {
      title: 'Seamless Integration',
      description: 'Our system easily integrates with existing pharmacy management software.',
      icon: <img src={CloudComputing} alt="Integration" className="h-48 w-48" />,
    },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-6">
      <h2 className="text-4xl font-extrabold text-gray-800">Why Choose Us?</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topCards.map((card, idx) => (
          <Card key={idx} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {bottomCards.map((card, idx) => (
          <Card key={idx} {...card} />
        ))}
      </div>
    </div>
  )
}

export default WhyChooseUs
