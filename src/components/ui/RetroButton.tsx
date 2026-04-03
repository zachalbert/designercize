import type { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonColor = 'blue' | 'pink' | 'yellow' | 'red' | 'green';

interface RetroButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  color: ButtonColor;
  selected?: boolean;
  small?: boolean;
  children: ReactNode;
}

export function RetroButton({
  color,
  selected = false,
  small = false,
  children,
  className = '',
  disabled,
  ...props
}: RetroButtonProps) {
  const classes = [
    'retro-btn',
    `retro-btn--${color}`,
    small && 'retro-btn--small',
    selected && 'selected',
    disabled && 'retro-btn--disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type="button" className={classes} disabled={disabled} {...props}>
      <span className="retro-btn__text">{children}</span>
    </button>
  );
}
