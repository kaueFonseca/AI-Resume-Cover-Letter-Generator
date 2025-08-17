import * as React from 'react';

// Use React's built-in types for button attributes.
// This automatically gives us `onClick`, `type`, `disabled`, `className`, etc.
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // We can add our own custom props here if we wanted, e.g., variant: 'primary' | 'secondary'
  // But for now, we just need the standard button props.
  children: React.ReactNode; // Use React.ReactNode to allow any valid element as children
}

// Use React.forwardRef if you ever need to pass a ref to the button, which is good practice.
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={`h-12 w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none ${className}`}
        ref={ref}
        {...props} // Spread all other props (like type, onClick, disabled) onto the button
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;