import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <svg width="600" height="400" viewBox="0 0 600 400">
        <text x="50%" y="50%" fontSize="120" fontWeight="bold" fill="#333" textAnchor="middle">
          404
        </text>
        <circle
          cx="300"
          cy="200"
          r="150"
          fill="none"
          stroke="#333"
          strokeWidth="2"
          strokeDasharray="10,10"
        />
        <path d="M150 200 Q 300 50 450 200" fill="none" stroke="#333" strokeWidth="2" />
        <path d="M280 180 Q 300 160 320 180 Q 300 200 280 180" fill="#333" />
        <line
          x1="260"
          y1="220"
          x2="340"
          y2="220"
          stroke="#333"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800">Oops! Page Not Found</h2>

      <button
        onClick={() => navigate('/')}
        className="rounded-md bg-neutral-900 px-6 py-3 text-lg text-white transition hover:bg-neutral-600"
      >
        Back to Home
      </button>
    </div>
  )
}

export default NotFound
