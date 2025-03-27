import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Features = () => {
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
      description:
        "Record-level transaction security on the blockchain, preventing counterfeiting and ensuring trust.",
      dark: false,
    },
    {
      id: "03",
      title: "Automated Inventory Optimization",
      description:
        "Leverage smart contracts for automated reordering and real-time price adjustments.",
      dark: false,
    },
    {
      id: "04",
      title: "Secure & Tamper-Proof Data",
      description:
        "Decentralized data sharing enhances security, reducing risks of fraud and inefficiencies.",
      dark: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F2F2] px-12 py-8">
      {/* Outer wrapper */}
      <div>
        {/* Section title */}
        <div className="text-gray-800 text-sm py-2">
          <div className="px-5 flex flex-row bg-gradient-to-l from-[#f2f2f2] to-green-600 font-semibold w-24 rounded-xl justify-center items-center gap-2">
            <div className="w-3 h-3 flex flex-col justify-center items-center rounded-full bg-white"></div>
            features
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-black mt-2 text-3xl font-bold w-[60vw]">
          Effortlessly Process Continues Supply
        </p>
      </div>

      {/* Feature items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`relative feature-item h-[40vh] w-[35vh] ${
              feature.dark ? "bg-black text-white" : "bg-white text-gray-800"
            } p-4 rounded-lg shadow-md transition-transform transform hover:scale-105`}
          >
            <div className="pl-56">
              <div>{feature.id}</div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm mt-4">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom section */}
      <div className="w-full bg-gradient-to-l from-[#bfbebe] to-[#ffffff] font-semibold rounded-lg flex flex-row px-7 mt-20 justify-between gap-2 py-4">
        <p>
          We combine AI & blockchain to bring you an innovative solution
          tailored for the pharmaceutical industry.
        </p>
        <button className="px-4 py-2 bg-black text-white rounded-sm">
          Start
        </button>
      </div>
    </div>
  );
};

export default Features;
