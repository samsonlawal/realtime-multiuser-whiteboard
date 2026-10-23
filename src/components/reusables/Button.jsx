const VARIANTS = {
  primary: 'bg-brand hover:bg-brand-hover text-white shadow-sm border-transparent',
  white: 'bg-white hover:bg-zinc-100 text-black shadow-sm border-transparent',
  secondary: 'bg-card hover:bg-card-hover hover:border-subtle-hover text-heading border-subtle shadow-sm',
  outline: 'bg-transparent hover:bg-card-hover hover:border-subtle-hover text-heading border-subtle',
  ghost: 'bg-transparent hover:bg-card-hover text-muted hover:text-heading border-transparent',
};

const SIZES = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-[13px]',
  lg: 'h-12 px-6 text-base',
};

/**
 * Reusable Button component with unified height, padding, and variant styles.
 *
 * Props:
 * - variant: 'primary' | 'white' | 'secondary' | 'outline' | 'ghost'
 * - size: 'sm' | 'md' | 'lg'
 * - fullWidth: boolean
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center gap-1 font-medium rounded-md border transition-colors cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-poppins duration-300 box-border';

  const variantClasses = VARIANTS[variant] || VARIANTS.primary;
  const sizeClasses = SIZES[size] || SIZES.md;
  const widthClasses = fullWidth ? 'w-full' : 'w-auto';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
