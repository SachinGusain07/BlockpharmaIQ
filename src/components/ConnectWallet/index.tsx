import React, { useEffect } from 'react'
import { useConnectWallet } from '../../hooks/useConnectWallet'
import { toast } from 'sonner'

const WalletConnector: React.FC = () => {
  const { account, chainId, isConnecting, error, connectWallet, disconnectWallet } =
    useConnectWallet()

  useEffect(() => {
    if (error) {
      toast.error('Wallet Connection Error', {
        description: error.includes('detected')
          ? error
          : 'Please install a wallet extension like MetaMask.',
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      })
    }
  }, [error])

  const truncatedAddress = account
    ? `${account.substring(0, 5)}...${account.substring(account.length - 4)}`
    : null

  return (
    <div className="font-sans text-sm">
      {account ? (
        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-white transition-colors hover:bg-neutral-600"
            onClick={disconnectWallet}
            title={`Connected to chain ID: ${chainId}`}
          >
            <span className="font-medium">{truncatedAddress}</span>
            <span className="h-2 w-2 rounded-full bg-white"></span>
          </button>
        </div>
      ) : (
        <button
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-white transition-colors ${
            isConnecting ? 'cursor-not-allowed bg-gray-400' : 'bg-neutral-500 hover:bg-neutral-600'
          }`}
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <svg
                className="h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Connecting...
            </>
          ) : (
            'Connect Wallet'
          )}
        </button>
      )}
      {/* {error && <div className="mt-2 text-xs text-red-500">{error}</div>} */}
    </div>
  )
}

export default WalletConnector
