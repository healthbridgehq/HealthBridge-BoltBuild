import React from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'number' | 'textarea' | 'select';
  value: any;
  onChange: (name: string, value: any) => void;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  min?: string | number;
  max?: string | number;
  icon?: React.ReactNode;
  helpText?: string;
  showPasswordToggle?: boolean;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder,
  options,
  rows = 3,
  min,
  max,
  icon,
  helpText,
  showPasswordToggle = false
}: FormFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  const baseInputClasses = `
    w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500
    ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}
    ${icon ? 'pl-10' : ''}
    ${showPasswordToggle ? 'pr-10' : ''}
  `;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            rows={rows}
            className={baseInputClasses}
            required={required}
          />
        );

      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            disabled={disabled}
            className={baseInputClasses}
            required={required}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type={inputType}
            id={name}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(name, type === 'number' ? Number(e.target.value) : e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            min={min}
            max={max}
            className={baseInputClasses}
            required={required}
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        {renderInput()}
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      
      {error && (
        <div className="flex items-center space-x-1 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}