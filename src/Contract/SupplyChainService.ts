/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from 'ethers'
import { toast } from 'sonner'
import SupplyChainContract from './SupplyChainContract.json'

// ABI for the deployed contract
const CONTRACT_ABI = SupplyChainContract.abi

// The address where your contract is deployed
const CONTRACT_ADDRESS = '0x6Df268EE2305Ee71BBF1d8Cd4557ad8F5967bA52'

class Web3Service {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null
  private contract: ethers.Contract | null = null

  constructor() {
    this.initializeWeb3()
  }

  // Initialize Web3 provider and contract
  async initializeWeb3() {
    try {
      if (window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum)
        this.signer = await this.provider.getSigner()
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer)
        console.log('Web3 initialized successfully')
      } else {
        console.error('MetaMask is not installed')
        toast.error('MetaMask is not installed. Please install it to use blockchain features.')
      }
    } catch (error) {
      console.error('Error initializing Web3:', error)
      toast.error('Failed to connect to the blockchain. Please check your MetaMask configuration.')
    }
  }

  // Request account access if needed
  async connectWallet() {
    try {
      if (!window.ethereum) {
        toast.error('MetaMask is not installed. Please install it to use blockchain features.')
        return null
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' })
      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()

      const address = await this.signer.getAddress()
      console.log('Connected account:', address)

      return address
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet. Please try again.')
      return null
    }
  }

  // Register a new user (only admin)
  async registerUser(walletAddress: string, role: number) {
    try {
      if (!this.contract || !this.signer) {
        await this.initializeWeb3()
        if (!this.contract || !this.signer) {
          throw new Error('Contract or signer not initialized')
        }
      }
      console.log('Registering user with address:', walletAddress, 'and role:', role)
      const tx = await this.contract.registerUser(walletAddress, role)
      toast.info('Registering user on blockchain. Please wait for confirmation...')
      const receipt = await tx.wait()
      console.log('User registration receipt:', receipt)
      return receipt
    } catch (error) {
      console.error('Error registering user:', error)
      toast.error('Failed to register user on blockchain. Please try again.')
      throw error
    }
  }

  // Create a new order (only pharmacy)
  async createOrder(userId: string, pharmacyOutletId: string, vendorOrgId: string, amount: number) {
    try {
      if (!this.contract || !this.signer) {
        await this.initializeWeb3()
        if (!this.contract || !this.signer) {
          throw new Error('Contract or signer not initialized')
        }
      }

      const tx = await this.contract.createOrder(
        userId,
        pharmacyOutletId,
        vendorOrgId,
        ethers.parseEther(amount.toString())
      )
      toast.info('Creating order on blockchain. Please wait for confirmation...')
      const receipt = await tx.wait()
      console.log('Order creation receipt:', receipt)
      return receipt
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('Failed to create order on blockchain. Please try again.')
      throw error
    }
  }

  // Update order status (only supplier)
  async updateOrderStatus(orderId: number, newStatus: number) {
    try {
      if (!this.contract || !this.signer) {
        await this.initializeWeb3()
        if (!this.contract || !this.signer) {
          throw new Error('Contract or signer not initialized')
        }
      }

      const tx = await this.contract.updateOrderStatus(orderId, newStatus)
      toast.info('Updating order status. Please wait for confirmation...')
      const receipt = await tx.wait()
      console.log('Order status update receipt:', receipt)
      return receipt
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status. Please try again.')
      throw error
    }
  }

  // Update payment status
  async updatePaymentStatus(orderId: number, newStatus: number) {
    try {
      if (!this.contract || !this.signer) {
        await this.initializeWeb3()
        if (!this.contract || !this.signer) {
          throw new Error('Contract or signer not initialized')
        }
      }

      const tx = await this.contract.updatePaymentStatus(orderId, newStatus)
      toast.info('Updating payment status. Please wait for confirmation...')
      const receipt = await tx.wait()
      console.log('Payment status update receipt:', receipt)
      return receipt
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast.error('Failed to update payment status. Please try again.')
      throw error
    }
  }

  // Get order details
  async getOrder(orderId: number) {
    try {
      if (!this.contract) {
        await this.initializeWeb3()
        if (!this.contract) {
          throw new Error('Contract not initialized')
        }
      }

      const order = await this.contract.getOrder(orderId)
      return {
        id: order[0],
        userId: order[1],
        pharmacyOutletId: order[2],
        vendorOrgId: order[3],
        orderDate: new Date(Number(order[4]) * 1000),
        orderStatus: Number(order[5]),
        paymentStatus: Number(order[6]),
        amount: ethers.formatEther(order[7]),
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      throw error
    }
  }

  // Check if the current user has admin role
  async isCurrentUserAdmin() {
    try {
      await this.initializeWeb3()

      if (!this.contract || !this.signer) {
        return false
      }
      const address = await this.signer.getAddress()

      // Updated call to match your contract structure
      const user = await this.contract.users(address)

      // Check if the user exists and has admin role (1)
      return user && user.role === 1n
    } catch (error) {
      console.error('Error checking admin role:', error)
      return false
    }
  }

  // Add this helper function to check if an address is admin
  async isAdmin(address: string) {
    try {
      if (!this.contract) {
        await this.initializeWeb3()
        if (!this.contract) {
          return false
        }
      }

      const user = await this.contract.users(address)
      return user && user.role === 1n
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }

  // Check if the current user has supplier role
  async isCurrentUserSupplier() {
    try {
      if (!this.contract || !this.signer) {
        await this.initializeWeb3()
        if (!this.contract || !this.signer) {
          return false
        }
      }

      const address = await this.signer.getAddress()
      const role = await this.contract.users(address)
      return role.role === 2n // SUPPLIER = 2
    } catch (error) {
      console.error('Error checking supplier role:', error)
      return false
    }
  }

  // Check if the current user has pharmacy role
  async isCurrentUserPharmacy() {
    try {
      if (!this.contract || !this.signer) {
        await this.initializeWeb3()
        if (!this.contract || !this.signer) {
          return false
        }
      }

      const address = await this.signer.getAddress()
      const role = await this.contract.users(address)
      return role.role === 3n // PHARMACY = 3
    } catch (error) {
      console.error('Error checking pharmacy role:', error)
      return false
    }
  }
}

const web3Service = new Web3Service()
export default web3Service

declare global {
  interface Window {
    ethereum?: any
  }
}
