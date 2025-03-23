interface ActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonAction: () => void;
  destructive?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  buttonText,
  buttonAction,
  destructive = false,
}) => {
  return (
    <div
      className="rounded-lg p-6 mb-6 border border-gray-100 shadow-[
    0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)]"
    >
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-500 text-sm mb-6">{description}</p>

      <div className="flex justify-end">
        <button
          onClick={buttonAction}
          className={`px-6 py-3 rounded-full text-xs text-white ${
            destructive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          } transition-colors`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ActionCard;
