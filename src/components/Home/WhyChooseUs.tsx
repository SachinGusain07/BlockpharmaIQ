const WhyChooseUs = () => {

    const FeatureCards = [
      {
        title: "Next-Gen Technology",
        description:
          "We combine AI & blockchain to bring you an innovative solution tailored for the pharmaceutical industry.",
        icon: "/WhyChooseUS/Next_Gen.svg",
      },
      {
        title: "Eliminating Counterfeit Drugs",
        description: "Blockchain-based verification ensures that all medicines in your inventory are 100% authentic.",
        icon: "/WhyChooseUS/EleminateCounterFieting.svg",
        highlighted: true,
      },
      {
        title: "Cost & Waste Reduction",
        description: "Our demand forecasting prevents overstocking and stockouts, minimizing losses.",
        icon: "/WhyChooseUS/CostAndWasteReduction.svg",
      },
    ]
  
    const featureCard2 = [
      {
        title: "Data Privacy & Security",
        description: "End-to-end encryption ensures that your business data remains secure and confidential.",
        icon: "/WhyChooseUS/DataPrivacyAndSecurity.svg",
      },
      {
        title: "Seamless Integration",
        description: "Our system easily integrates with existing pharmacy management software.",
        icon: "/WhyChooseUS/SeamlessIntegration.svg",
      },
    ]
  
    return (
      <div className="bg-gray-100  px-4 md:px-8 flex flex-col justify-center items-center gap-12 py-6">
        <h2 className="text-4xl font-bold mb-12 max-w-6xl mx-auto">Why Choose Us?</h2>
  
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {FeatureCards.map((card, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 flex flex-col items-center shadow-sm ${
                card.highlighted ? "border-2 border-blue-500" : ""
              }`}
            >
              <div className="w-32 h-32 mb-4 flex items-center justify-center">
                <img
                  src={card.icon || "/placeholder.svg?height=150&width=150"}
                  alt={card.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm text-center">{card.description}</p>
            </div>
          ))}
        </div>
  
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureCard2.map((card, index) => (
            <div key={index} className="bg-white rounded-xl p-6 flex flex-col items-center shadow-sm">
              <div className="w-32 h-32 mb-4 flex items-center justify-center">
                <img
                  src={card.icon || "/placeholder.svg?height=150&width=150"}
                  alt={card.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm text-center">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default WhyChooseUs
  
  