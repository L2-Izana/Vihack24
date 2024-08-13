const FormElement = ({ elementID, elementType }) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={elementID}
        className="block text-sm font-medium text-gray-700"
      >
        {elementID.charAt(0).toUpperCase() + elementID.slice(1)}
      </label>
      <input
        id={elementID}
        type={elementType}
        placeholder={`Enter your ${elementID}`}
        className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
    </div>
  );
};

export default FormElement;
