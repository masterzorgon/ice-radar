import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'secondary' | 'ghost' | 'donate';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  pulse?: boolean;
}

// Chunky 8-bit retro terminal button styles
// Instant hover state (no transitions), inverted colors on hover
const variantStyles = {
  primary: 'text-accent border-2 border-accent bg-transparent hover:bg-accent hover:text-background',
  danger: 'text-danger border-2 border-danger bg-transparent hover:bg-danger hover:text-background',
  secondary: 'text-accent-muted border-2 border-accent-dim bg-transparent hover:border-accent hover:text-accent',
  ghost: 'text-accent-muted border-2 border-transparent hover:text-accent hover:border-accent-dim',
  donate: 'text-pink-400 border-2 border-pink-400 bg-transparent hover:bg-pink-400 hover:text-background',
};

// Pixel-perfect sizes (multiples of 8)
const sizeStyles = {
  sm: 'py-1 px-2',
  md: 'py-2 px-4',
  lg: 'py-3 px-6',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      icon,
      iconPosition = 'left',
      pulse = false,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // 8-bit chunky button base styles
    // No transition, instant hover, uppercase text, letter-spacing
    const baseStyles = 'text-[8px] tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2 font-mono';
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
    const widthStyles = fullWidth ? 'w-full' : '';
    const pulseStyles = pulse ? 'pixel-pulse' : '';

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${pulseStyles} ${className}`}
        {...props}
      >
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
