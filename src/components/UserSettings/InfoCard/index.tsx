interface InfoCardProps {
  title?: string
  fields: { label: string; value: string }[]
  onEdit: () => void
}

const InfoCard: React.FC<InfoCardProps> = ({ title, fields, onEdit }) => {
  return (
    <div className="mb-6 h-full rounded-lg p-6">
      <div className="mb-6 flex items-center justify-between">
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        <button
          onClick={onEdit}
          className="flex items-center rounded-full border border-gray-300 px-4 py-2 text-xs text-gray-500 transition-colors hover:bg-gray-50"
        >
          Edit
          <span className="ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
        {fields.map((field, index) => (
          <div key={index} className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-900">{field.label}</label>
            <span className="text-sm font-medium text-gray-400">{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InfoCard
