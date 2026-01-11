import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'secondary' | 'ghost' | 'donate';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  pulse?: boolean;
}

const variantStyles = {
  primary: 'text-accent border border-accent/30 bg-accent/10 hover:bg-accent/20',
  danger: 'text-danger border border-danger/50 bg-danger/20 hover:bg-danger/30',
  secondary: 'text-foreground/70 border border-transparent hover:border-accent-dim/30 hover:text-foreground',
  ghost: 'text-foreground/50 hover:text-foreground border border-transparent',
  donate: 'text-pink-400 border border-pink-500/50 bg-pink-500/20 hover:bg-pink-500/30',
};

const sizeStyles = {
  sm: 'py-1 px-3',
  md: 'py-1.5 px-4',
  lg: 'py-2 px-5',
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
    const baseStyles = 'text-xs transition-colors cursor-pointer flex items-center justify-center gap-2';
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
    const widthStyles = fullWidth ? 'w-full' : '';
    const pulseStyles = pulse ? 'animate-pulse hover:animate-none' : '';

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
