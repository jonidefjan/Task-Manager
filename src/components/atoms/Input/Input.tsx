/**
 * Enhanced Input component with validation and accessibility features
 */

import { memo, forwardRef, useCallback } from 'react';
import type { InputProps } from '../../../types/components';
import './Input.css';

const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(
    (
      {
        value,
        placeholder,
        disabled = false,
        autoFocus = false,
        maxLength,
        onChange,
        onBlur,
        onKeyDown,
        className = '',
        testId,
      },
      ref
    ) => {
      const baseStyles = {
        width: '100%',
        padding: '12px 16px',
        fontSize: '16px',
        lineHeight: '24px',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        backgroundColor: disabled ? '#f8fafc' : '#ffffff',
        color: disabled ? '#94a3b8' : '#1e293b',
        outline: 'none',
        transition: 'all 0.2s ease-in-out',
        fontFamily: 'inherit',
        boxSizing: 'border-box' as const,
      };

      const focusStyles = {
        ...baseStyles,
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      };

      const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
          if (!disabled) {
            onChange(event.target.value);
          }
        },
        [onChange, disabled]
      );

      const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
          if (onKeyDown) {
            onKeyDown(event.key);
          }
        },
        [onKeyDown]
      );

      const handleBlur = useCallback(() => {
        if (onBlur) {
          onBlur();
        }
      }, [onBlur]);

      return (
        <input
          ref={ref}
          type='text'
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          maxLength={maxLength}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={className}
          data-testid={testId}
          style={baseStyles}
          onFocus={e => {
            Object.assign(e.target.style, focusStyles);
          }}
          onBlurCapture={e => {
            Object.assign(e.target.style, baseStyles);
          }}
          aria-label={placeholder}
        />
      );
    }
  )
);

Input.displayName = 'Input';

export { Input };
