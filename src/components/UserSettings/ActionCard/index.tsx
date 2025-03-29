interface ActionCardProps {
  title: string
  description: string
  buttonText: string
  buttonAction: () => void
  destructive?: boolean
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  buttonText,
  buttonAction,
  destructive = false,
}) => {
  return (
    <div className="shadow-[ 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)] mb-6 rounded-lg border border-gray-100 p-6">
      <h2 className="mb-2 text-2xl font-bold">{title}</h2>
      <p className="mb-6 text-sm text-gray-500">{description}</p>

      <div className="flex justify-end">
        <button
          onClick={buttonAction}
          className={`rounded-full px-6 py-3 text-xs text-white ${
            destructive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          } transition-colors`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default ActionCard
