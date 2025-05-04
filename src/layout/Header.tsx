import WalletConnector from '@/components/ConnectWallet'
import { useMeQuery } from '@/services/api'

interface HeaderProps {
  onToggleSidebar: () => void
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const user = useMeQuery()
  const role = user.data?.body.data.role
  return (
    <header className="z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        <button
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
          onClick={onToggleSidebar}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="md:flex-1"></div>
        <div className="h-10">{role !== 'ADMIN' ? <WalletConnector /> : null}</div>
      </div>
    </header>
  )
}

export default Header
