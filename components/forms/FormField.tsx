import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormFieldProps, ComponentProps } from '@/types';

interface FormFieldComponentProps extends FormFieldProps, ComponentProps {
  id: string;
  type?: string;
  value?: string;
  onChange?: () => void;
  placeholder?: string;
}

export function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className,
}: FormFieldComponentProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label
          htmlFor={id}
          className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''}
        >
          {label}
        </Label>
      )}
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className='text-sm text-red-500' role='alert'>
          {error}
        </p>
      )}
    </div>
  );
}
