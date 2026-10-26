/**
 * Reusable Reeley Brand Wordmark
 *
 * Characteristics:
 * - Thick, heavyweight typography (font-bold + font-display)
 * - Tight letter tracking (tracking-tighter)
 * - Faded, subtle aesthetic (text-dim/40 with smooth hover transition)
 *
 * Props:
 * - size: 'sm' (header) | 'md' (navbar) | 'lg' (sidebar) | 'xl' (watermark/footer)
 * - className: additional utility classes
 * - onClick: optional click handler
 */


interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => {};
}

const SIZES: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-4xl',
  xl: 'text-6xl sm:text-8xl md:text-9xl lg:text-[10rem]',
};

export default function Logo({
  size = 'md',
  className = '',
  onClick,
  ...props
}: LogoProps) {
  const sizeClasses = SIZES[size] || SIZES.md;
  const isClickable = Boolean(onClick);

  return (
    <span
      onClick={onClick}
      className={`font-extrabold tracking-tighter font-display leading-none select-none text-dim hover:text-dim/70 transition-colors duration-300 ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      } ${sizeClasses} ${className}`}
      {...props}
    >
      Reeley
    </span>
  );
}
