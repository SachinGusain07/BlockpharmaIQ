/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react'

type WalletState = {
  account: string | null
  chainId: string | null
  isConnecting: boolean
  error: string | null
}

type ConnectWalletReturnType = WalletState & {
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

export function useConnectWallet(): ConnectWalletReturnType {
  const [state, setState] = useState<WalletState>({
    account: null,
    chainId: null,
    isConnecting: false,
    error: null,
  })

  const getEthereum = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return window.ethereum
    }
    return null
  }

  // Check if wallet is connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      const ethereum = getEthereum()
      if (ethereum) {
        try {
          const accounts = await ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            const chainId = await ethereum.request({ method: 'eth_chainId' })
            setState({
              account: accounts[0],
              chainId,
              isConnecting: false,
              error: null,
            })
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err)
        }
      }
    }

    checkWalletConnection()
  }, [])

  // Handle chain changes
  useEffect(() => {
    const ethereum = getEthereum()

    if (!ethereum) return

    const handleChainChanged = (chainId: string) => {
      setState((prev) => ({ ...prev, chainId }))
    }

    const handleAccountsChanged = (accounts: string[]) => {
      setState((prev) => ({
        ...prev,
        account: accounts[0] || null,
        error: accounts.length === 0 ? 'Wallet disconnected' : null,
      }))
    }

    ethereum.on('chainChanged', handleChainChanged)
    ethereum.on('accountsChanged', handleAccountsChanged)

    return () => {
      ethereum.removeListener('chainChanged', handleChainChanged)
      ethereum.removeListener('accountsChanged', handleAccountsChanged)
    }
  }, [])

  const connectWallet = useCallback(async () => {
    const ethereum = getEthereum()
    if (!ethereum) {
      setState((prev) => ({
        ...prev,
        error: 'No Ethereum wallet detected. Please install MetaMask.',
      }))
      return
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      const chainId = await ethereum.request({ method: 'eth_chainId' })

      setState({
        account: accounts[0],
        chainId,
        isConnecting: false,
        error: null,
      })
    } catch (err) {
      console.error('Error connecting wallet:', err)
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: err instanceof Error ? err.message : 'Failed to connect wallet',
      }))
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    setState({
      account: null,
      chainId: null,
      isConnecting: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    connectWallet,
    disconnectWallet,
  }
}
