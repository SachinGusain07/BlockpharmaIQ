import blend from '../../assests/blend.svg'

const HowItWorks = () => {
  return (
    <div
      id="how-it-works"
      className="mt-8 flex w-full max-w-6xl flex-col items-center justify-center space-y-12 p-5"
    >
      <h3 className="text-5xl font-extrabold">How it works</h3>
      <img src={blend} alt="" className="h-[650px] w-full" />
    </div>
  )
}

export default HowItWorks
