import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

const Blockchain = () => {
  // Sample blockchain verification data
  const verificationData = [
    {
      id: '0x4a3b...8c2d',
      medicine: 'Paracetamol',
      brand: 'Tylenol',
      status: 'verified',
      manufacturer: 'Johnson & Johnson',
      manufactured: '2023-05-15',
      expiry: '2025-05-15',
      transactions: [
        { from: 'Manufacturer', to: 'Distributor', date: '2023-06-10', txHash: '0x1a2b...3c4d' },
        { from: 'Distributor', to: 'Pharmacy', date: '2023-06-25', txHash: '0x5e6f...7g8h' },
      ],
    },
    {
      id: '0x5b4c...9d1e',
      medicine: 'Amoxicillin',
      brand: 'Amoxil',
      status: 'verified',
      manufacturer: 'Pfizer',
      manufactured: '2023-03-20',
      expiry: '2024-09-20',
      transactions: [
        { from: 'Manufacturer', to: 'Distributor', date: '2023-04-05', txHash: '0x9i8j...7k6l' },
        { from: 'Distributor', to: 'Wholesaler', date: '2023-04-15', txHash: '0x3m4n...5o6p' },
        { from: 'Wholesaler', to: 'Pharmacy', date: '2023-05-01', txHash: '0x7q8r...9s0t' },
      ],
    },
    {
      id: '0x6d5e...0f2a',
      medicine: 'Atorvastatin',
      brand: 'Lipitor',
      status: 'pending',
      manufacturer: 'Novartis',
      manufactured: '2023-07-10',
      expiry: '2025-07-10',
      transactions: [
        { from: 'Manufacturer', to: 'Distributor', date: '2023-08-01', txHash: '0x2u1v...3w4x' },
      ],
    },
  ]

  const verifyBatch = (id: string) => {
    // In a real app, this would interact with the blockchain
    alert(`Verifying batch ${id} on blockchain...`)
  }

  // Animation variants
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  }

  const stepVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'backOut',
      },
    }),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold text-gray-800">Blockchain Verification</h2>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-md hover:bg-indigo-700"
        >
          <ArrowPathIcon className="mr-2 h-5 w-5" />
          Sync with Blockchain
        </motion.button>
      </motion.div>

      {/* Verification Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium tracking-wider text-gray-500 uppercase">
                  Medicine
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium tracking-wider text-gray-500 uppercase">
                  Manufacturer
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium tracking-wider text-gray-500 uppercase">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium tracking-wider text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium tracking-wider text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {verificationData.map((item) => (
                  <motion.tr
                    key={item.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                          <ShieldCheckIcon className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{item.medicine}</div>
                          <div className="text-sm text-gray-500">{item.brand}</div>
                          <div className="font-mono text-xs text-gray-400">Batch: {item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {item.manufacturer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Made: {item.manufactured}</div>
                      <div className="text-sm text-gray-500">Expires: {item.expiry}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'verified' ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          <CheckCircleIcon className="mr-1 h-4 w-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          <XCircleIcon className="mr-1 h-4 w-4" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => verifyBatch(item.id)}
                          className="rounded-md bg-indigo-50 px-3 py-1 text-indigo-600 hover:bg-indigo-100"
                        >
                          Verify
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center rounded-md bg-gray-50 px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          View Chain <ChevronRightIcon className="ml-1 h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h3 className="mb-6 text-lg font-medium text-gray-900">Supply Chain Visualization</h3>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center justify-center space-x-8">
            {['Manufacturer', 'Distributor', 'Wholesaler', 'Pharmacy'].map((step, index) => (
              <motion.div
                key={step}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={stepVariants}
                className="relative flex flex-col items-center"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm ${
                    index < 2
                      ? 'border border-indigo-200 bg-indigo-100 text-indigo-600'
                      : 'border border-gray-200 bg-gray-100 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="mt-2 text-sm font-medium">{step}</div>
                {index < 3 && (
                  <div className="absolute top-4 left-24 h-0.5 w-14 -translate-y-1/2 transform">
                    &rarr;
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 rounded-lg bg-indigo-50 p-4"
          >
            <h4 className="mb-3 text-sm font-medium text-indigo-800">Sample Transaction</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <p className="text-xs font-medium text-gray-500">Transaction Hash</p>
                <p className="font-mono text-sm">0x4a3b...8c2d</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">From</p>
                <p className="text-sm">Distributor</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">To</p>
                <p className="text-sm">Pharmacy</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Date</p>
                <p className="text-sm">2023-06-25</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Blockchain
