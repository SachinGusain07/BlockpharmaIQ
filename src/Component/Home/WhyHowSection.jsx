import React from 'react';
import { motion } from 'framer-motion';

const WhyHowSection = () => {
  return (
   
 <div>
        <div className="min-h-screen flex flex-col bg-[#000000] px-12 py-8">
            <div  className='w-full h-full'>
                <img src = "/HowItWorks.png" alt = "HowItWorks" className='object-contain'></img>
            </div>

      <footer className="text-center mt-16 bg-black text-white py-10 h-[40vh] flex flex-col justify-center items-center  shadow-lg gap-7">
        <h2 className="text-3xl font-bold">Ready to Optimize Your Inventory?</h2>
        <p className="mt-2">Let us transform the pharmaceutical supply chain with AI & Blockchain!</p>
        <button className="bg-white hover:bg-neutral-300 text-black font-bold py-2 px-6 rounded-full mt-4 w-24 h-6">Start Now</button>
      </footer>
    </div>
    </div>
  );
};

export default WhyHowSection;
