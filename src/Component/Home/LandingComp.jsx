import React, { useEffect } from 'react';
import { PackageOpen } from 'lucide-react';
import { BookCheck } from 'lucide-react';
import { HeartHandshake } from 'lucide-react';
import gsap from 'gsap';

const LandingComp = () => {
  useEffect(() => {
    // Animate each feature item with fromTo to control start and end state
    gsap.fromTo(
      '.feature-item',
      {
        y: 100, // Start position (below)
        opacity: 0, // Start as transparent
      },
      {
        y: 0, // Final position (original)
        opacity: 1, // End as fully visible
        stagger: 0.3, // Stagger the animations for each item
        duration: 1.5,
        ease: 'power4.out', // Smooth easing
      }
    );
    gsap.fromTo(
      '.heading',
      {
        y: -50, // Start position (above)
        opacity: 0, // Start as transparent
      },
      {
        y: 0, // Final position (original)
        opacity: 1, // End as fully visible
        stagger: 0.3, // Stagger the animations for each item
        duration: 2,
        ease: 'power4.out', // Smooth easing
      }
    );
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-6 md:gap-10">
      <div className="flex flex-col gap-4 justify-center items-center w-[65%] text-center heading">
        <h1 className="text-[5vh] md:text-[10vh] font-extrabold font-plusJakarta leading-tight md:leading-[10vh]">
          Experience the future of medicine with BlockPharma.
        </h1>
        <p className="font-plusJakarta leading-tight">
          Transparent, secure, and efficient pharmaceutical supply chain management.
        </p>
        {/* Apply the btn-hover and color-7 class here */}
        <button className="btn-hover bg-black color-7 px-4 w-30 text-white rounded-lg py-2">
          Try a Demo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-[90%] px-4">
        {/* Add 'feature-item' class to each feature */}
        <div className="feature-item flex flex-col justify-center text-black items-center gap-2">
          <div className="bg-gray-300 flex w-20 h-20 items-center justify-center rounded-xl">
            <PackageOpen size={36} className="p-5" />
          </div>
          <p className="text-center">
            Prevents stockouts and overstocking, ensuring pharmacies maintain optimal inventory levels.
          </p>
        </div>

        <div className="feature-item flex flex-col justify-center text-black items-center gap-2">
          <div className="bg-gray-300 flex w-20 h-20 items-center justify-center rounded-xl">
            <HeartHandshake size={36} className="p-5" />
          </div>
          <p className="text-center">
            Eliminates counterfeit drugs by verifying the source and integrity of medicines.
          </p>
        </div>

        <div className="feature-item flex flex-col justify-center text-black items-center gap-2">
          <div className="bg-gray-300 flex w-20 h-20 items-center justify-center rounded-xl">
            <BookCheck size={36} className="p-5" />
          </div>
          <p className="text-center">
            Dynamically adjusts pricing and supply chain operations to maximize efficiency.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingComp;
