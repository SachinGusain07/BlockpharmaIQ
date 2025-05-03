import { FaArrowRight } from 'react-icons/fa6'
const CTA = () => {
  return (
    <div className="flex h-96 w-full items-center justify-center bg-black">
      <div className="flex max-w-6xl flex-col items-center justify-center gap-5">
        <h1 className="text-5xl font-bold text-white">
          Ready to Optimize Your Pharmacy's Inventory?
        </h1>
        <p className="text-center text-lg font-medium text-white">
          Join us in transforming the pharmaceutical supply chain with AI & Blockchain!
        </p>
        <div className="flex items-center justify-between gap-2 rounded-full bg-white px-2 py-2 text-black">
          <h3 className="px-2 text-lg font-bold">Start Now</h3>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black p-2 text-white">
            <FaArrowRight className="h-7 w-7" color="white" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CTA
