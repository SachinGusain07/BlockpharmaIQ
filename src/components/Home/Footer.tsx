import { RiFacebookBoxFill, RiInstagramFill, RiTwitterXFill } from 'react-icons/ri'

const Footer = () => {
  return (
    <footer className="w-full bg-white py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col justify-between p-5 md:flex-row">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-800 uppercase">Navigation</h3>
          <ul className="space-y-1">
            <li className="text-sm text-gray-600">Home</li>
            <li className="text-sm text-gray-600">About</li>
            <li className="text-sm text-gray-600">Contact</li>
            <li className="text-sm text-gray-600">Features</li>
            <li className="text-sm text-gray-600">Privacy Policy</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-800 uppercase">Blockpharma</h3>
          <ul>
            <li className="text-sm text-gray-600">How it works ?</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-800 uppercase">Socials</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <RiFacebookBoxFill className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600">Facebook</p>
            </div>
            <div className="flex items-center gap-2">
              <RiTwitterXFill className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600">Twitter</p>
            </div>
            <div className="flex items-center gap-2">
              <RiInstagramFill className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600">Instagram</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-5 text-left">
        <p className="text-4xl font-bold text-black">© 2025</p>
        <p className="text-6xl font-bold text-black">BLOCKPHARMA</p>
      </div>
    </footer>
  )
}

export default Footer
