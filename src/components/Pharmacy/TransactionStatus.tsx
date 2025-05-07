import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export const TransactionStatus = ({
  status,
  message,
  hash,
}: {
  status: 'idle' | 'processing' | 'success' | 'error'
  message: string
  hash?: string
}) => {
  if (status === 'idle') return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-md p-4 ${
        status === 'processing'
          ? 'bg-yellow-50'
          : status === 'success'
            ? 'bg-green-50'
            : 'bg-red-50'
      }`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {status === 'processing' && <ClockIcon className="h-5 w-5 text-yellow-400" />}
          {status === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-400" />}
          {status === 'error' && <XCircleIcon className="h-5 w-5 text-red-400" />}
        </div>
        <div className="ml-3">
          <h3
            className={`text-sm font-medium ${
              status === 'processing'
                ? 'text-yellow-800'
                : status === 'success'
                  ? 'text-green-800'
                  : 'text-red-800'
            }`}
          >
            Blockchain Transaction {status.charAt(0).toUpperCase() + status.slice(1)}
          </h3>
          <div
            className={`mt-2 text-sm ${
              status === 'processing'
                ? 'text-yellow-700'
                : status === 'success'
                  ? 'text-green-700'
                  : 'text-red-700'
            }`}
          >
            <p>{message}</p>
            {hash && (
              <a
                href={`https://polygonscan.com/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <DocumentTextIcon className="mr-1 -ml-0.5 h-4 w-4" />
                View on Polygon Explorer
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
