import React, { useEffect, useRef } from 'react'
import { useConnectWallet } from '../../hooks/useConnectWallet'
import { toast } from 'sonner'
import { Wallet } from 'lucide-react'
import { useMeQuery } from '@/services/api'

const WalletConnector: React.FC = () => {
  const { account, chainId, isConnecting, error, connectWallet, disconnectWallet } =
    useConnectWallet()
  const { data: userData } = useMeQuery()
  const walletAddress = userData?.body.data.walletAddress

  const previousAccountRef = useRef<string | null>(null)

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

    if (account && account !== previousAccountRef.current) {
      if (walletAddress && account.toLowerCase() !== walletAddress.toLowerCase()) {
        toast.error('Invalid Wallet Address', {
          description: 'Please connect the wallet associated with your account.',
          action: {
            label: 'Disconnect',
            onClick: disconnectWallet,
          },
        })
      } else {
        toast.success('Wallet Connected', {
          description: `Connected to ${account.substring(0, 5)}...${account.substring(account.length - 4)}`,
          action: {
            label: 'Dismiss',
            onClick: () => toast.dismiss(),
          },
        })
      }
    }

    // Update the previous account ref
    previousAccountRef.current = account
  }, [error, account, walletAddress, disconnectWallet])

  const truncatedAddress = account
    ? `${account.substring(0, 5)}...${account.substring(account.length - 4)}`
    : null

  return (
    <div className="mr-5 font-sans text-sm">
      {account ? (
        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2 text-white transition-colors hover:bg-neutral-600"
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
            isConnecting
              ? 'cursor-not-allowed bg-neutral-950'
              : 'bg-neutral-950 hover:bg-neutral-600'
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
            <>
              <Wallet className="h-4 w-4 text-white" />
              <span>Connect Wallet</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default WalletConnector
