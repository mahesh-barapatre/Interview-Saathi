const Alert = ({ message, type = "error", onClose }) => {
  const bgColors = {
    error: "bg-red-100 border-red-500 text-red-900",
    success: "bg-green-100 border-green-500 text-green-900",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-900",
    info: "bg-blue-100 border-blue-500 text-blue-900",
  };

  return (
    <div
      className={`flex items-center justify-between p-4 border-l-4 rounded-lg shadow-md ${bgColors[type]}`}
    >
      <span className="font-medium">{message}</span>
      <button
        className="text-xl text-gray-700 hover:text-gray-900"
        onClick={onClose}
      >
        ✖
      </button>
    </div>
  );
};

export default Alert;
