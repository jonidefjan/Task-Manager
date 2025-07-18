/**
 * Enhanced Button component with variants and accessibility features
 */

import { memo, forwardRef } from 'react';
import type { ButtonProps } from '../../../types/components';
import './Button.css';

const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        children,
        variant = 'primary',
        size = 'medium',
        disabled = false,
        type = 'button',
        onClick,
        className = '',
        testId,
      },
      ref
    ) => {
      const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        textDecoration: 'none',
        outline: 'none',
        fontFamily: 'inherit',
        boxSizing: 'border-box' as const,
      };

      const variantStyles = {
        primary: {
          backgroundColor: disabled ? '#94a3b8' : '#3b82f6',
          color: '#ffffff',
          boxShadow: disabled ? 'none' : '0 2px 4px rgba(59, 130, 246, 0.3)',
        },
        secondary: {
          backgroundColor: disabled ? '#f1f5f9' : '#f8fafc',
          color: disabled ? '#94a3b8' : '#475569',
          border: `2px solid ${disabled ? '#e2e8f0' : '#e2e8f0'}`,
        },
        danger: {
          backgroundColor: disabled ? '#94a3b8' : '#ef4444',
          color: '#ffffff',
          boxShadow: disabled ? 'none' : '0 2px 4px rgba(239, 68, 68, 0.3)',
        },
      };

      const sizeStyles = {
        small: {
          padding: '8px 16px',
          fontSize: '14px',
          minHeight: '36px',
        },
        medium: {
          padding: '12px 24px',
          fontSize: '16px',
          minHeight: '44px',
        },
        large: {
          padding: '16px 32px',
          fontSize: '18px',
          minHeight: '52px',
        },
      };

      const combinedStyles = {
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
      };

      const handleClick = () => {
        if (!disabled && onClick) {
          onClick();
        }
      };

      return (
        <button
          ref={ref}
          type={type}
          disabled={disabled}
          onClick={handleClick}
          className={className}
          data-testid={testId}
          style={combinedStyles}
          onMouseEnter={e => {
            if (!disabled) {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(-1px)';
              if (variant === 'primary') {
                target.style.backgroundColor = '#2563eb';
              } else if (variant === 'secondary') {
                target.style.backgroundColor = '#f1f5f9';
              } else if (variant === 'danger') {
                target.style.backgroundColor = '#dc2626';
              }
            }
          }}
          onMouseLeave={e => {
            if (!disabled) {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(0)';
              Object.assign(target.style, combinedStyles);
            }
          }}
          onFocus={e => {
            if (!disabled) {
              e.target.style.boxShadow = `0 0 0 3px ${
                variant === 'primary'
                  ? 'rgba(59, 130, 246, 0.3)'
                  : variant === 'danger'
                    ? 'rgba(239, 68, 68, 0.3)'
                    : 'rgba(71, 85, 105, 0.3)'
              }`;
            }
          }}
          onBlur={e => {
            Object.assign(e.target.style, combinedStyles);
          }}
        >
          {children}
        </button>
      );
    }
  )
);

Button.displayName = 'Button';

export { Button };
