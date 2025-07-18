/**
 * Enhanced Checkbox component with accessibility features
 */

import { memo, forwardRef, useCallback } from 'react';
import type { CheckboxProps } from '../../../types/components';
import './Checkbox.css';

const Checkbox = memo(
  forwardRef<HTMLInputElement, CheckboxProps>(
    (
      { checked, onChange, disabled = false, label, className = '', testId },
      ref
    ) => {
      const labelStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        gap: '8px',
        fontSize: '16px',
        lineHeight: '24px',
        color: disabled ? '#94a3b8' : '#1e293b',
        userSelect: 'none' as const,
      };

      const checkboxStyles = {
        width: '20px',
        height: '20px',
        border: '2px solid #e2e8f0',
        borderRadius: '4px',
        backgroundColor: checked ? '#3b82f6' : '#ffffff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        outline: 'none',
        transition: 'all 0.2s ease-in-out',
        appearance: 'none' as const,
        position: 'relative' as const,
        flexShrink: 0,
      };

      const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
          if (!disabled) {
            onChange(event.target.checked);
          }
        },
        [onChange, disabled]
      );

      return (
        <label style={labelStyles} className={className} data-testid={testId}>
          <input
            ref={ref}
            type='checkbox'
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            style={checkboxStyles}
            onFocus={e => {
              if (!disabled) {
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)';
                e.target.style.borderColor = '#3b82f6';
              }
            }}
            onBlur={e => {
              e.target.style.boxShadow = 'none';
              e.target.style.borderColor = '#e2e8f0';
            }}
          />
          {checked && (
            <svg
              style={{
                position: 'absolute',
                left: '4px',
                top: '4px',
                width: '12px',
                height: '12px',
                fill: 'white',
                pointerEvents: 'none',
              }}
              viewBox='0 0 12 12'
            >
              <path
                d='M10 3L4.5 8.5L2 6'
                stroke='white'
                strokeWidth='2'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          )}
          {label && <span>{label}</span>}
        </label>
      );
    }
  )
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
