const FormElement = ({
  elementID,
  elementType,
  elementPlaceholder,
  value,
  onChange,
}) => (
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
      placeholder={elementPlaceholder}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
    />
  </div>
);

export default FormElement;
