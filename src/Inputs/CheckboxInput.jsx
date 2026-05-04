import { useEffect, useState } from "react";

export default function Checkbox({ 
  label = "Checkbox", 
  value,
  checked = JSON.parse(sessionStorage.getItem(label)) || false,
  onChange = () => {} 
}) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = (e) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    onChange(newChecked, value, e);
    localStorage.setItem(label,newChecked)
    sessionStorage.setItem(label,newChecked)
  };

  return (
    <label className="flex items-center space-x-3 cursor-pointer group p-1 hover:bg-cyan-50 rounded">
      <span className="select-none">{label}:</span>
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          className="sr-only"
        />
        <div className={`w-5 h-5 border-2 rounded transition-colors duration-200
          ${isChecked 
            ? 'bg-blue-500 border-blue-500' 
            : 'bg-white border-gray-300 group-hover:border-blue-400'
          }`}
        >
          {isChecked && (
            <svg 
              className="w-4 h-4 text-white" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
        </div>
      </div>
    </label>
  );
}