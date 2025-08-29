import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  email?: boolean;
  phone?: boolean;
  medicare?: boolean;
  date?: boolean;
  min?: number;
  max?: number;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  rules: ValidationRules
) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return 'This field is required';
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      return null;
    }

    // Email validation
    if (rule.email && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    // Phone validation (Australian format)
    if (rule.phone && typeof value === 'string') {
      const phoneRegex = /^(\+61|0)[2-9]\d{8}$/;
      const cleanPhone = value.replace(/\s/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        return 'Please enter a valid Australian phone number';
      }
    }

    // Medicare number validation
    if (rule.medicare && typeof value === 'string') {
      const medicareRegex = /^\d{10}$/;
      const cleanMedicare = value.replace(/\s/g, '');
      if (!medicareRegex.test(cleanMedicare)) {
        return 'Medicare number must be 10 digits';
      }
    }

    // Date validation
    if (rule.date && typeof value === 'string') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return 'Please enter a valid date';
      }
      if (date > new Date()) {
        return 'Date cannot be in the future';
      }
    }

    // Length validation
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return `Minimum length is ${rule.minLength} characters`;
    }

    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return `Maximum length is ${rule.maxLength} characters`;
    }

    // Number range validation
    if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
      return `Value must be at least ${rule.min}`;
    }

    if (rule.max !== undefined && typeof value === 'number' && value > rule.max) {
      return `Value must be no more than ${rule.max}`;
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return 'Invalid format';
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules]);

  const validateAll = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach((fieldName) => {
      const error = validateField(fieldName, getNestedValue(data, fieldName));
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(rules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return isValid;
  }, [data, rules, validateField]);

  const updateField = useCallback((name: string, value: any) => {
    setData(prev => setNestedValue({ ...prev }, name, value));
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on change
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error || '' }));
  }, [validateField]);

  const updateNestedField = useCallback((path: string, value: any) => {
    setData(prev => setNestedValue({ ...prev }, path, value));
    setTouched(prev => ({ ...prev, [path]: true }));
    
    // Validate field on change
    const error = validateField(path, value);
    setErrors(prev => ({ ...prev, [path]: error || '' }));
  }, [validateField]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialData]);

  const getFieldError = useCallback((name: string): string | null => {
    return touched[name] ? errors[name] || null : null;
  }, [errors, touched]);

  const handleSubmit = useCallback(async (
    onSubmit: (data: T) => Promise<void>,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    if (!validateAll()) {
      return false;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      if (onError) onError(error as Error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [data, validateAll]);

  return {
    data,
    errors,
    touched,
    isSubmitting,
    updateField,
    updateNestedField,
    validateAll,
    reset,
    getFieldError,
    handleSubmit,
    isValid: Object.keys(errors).filter(key => errors[key]).length === 0,
  };
}

// Helper functions for nested object manipulation
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current) || typeof current[keys[i]] !== 'object') {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
  return obj;
}