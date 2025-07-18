/**
 * Test suite for Button component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/atoms/Button/Button';

describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Button variant='primary'>Primary</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveStyle({ backgroundColor: '#3b82f6' });

    rerender(<Button variant='secondary'>Secondary</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveStyle({ backgroundColor: '#f8fafc' });

    rerender(<Button variant='danger'>Danger</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveStyle({ backgroundColor: '#ef4444' });
  });

  it('handles disabled state', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies size styles correctly', () => {
    const { rerender } = render(<Button size='small'>Small</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveStyle({
      padding: '8px 16px',
      fontSize: '14px',
    });

    rerender(<Button size='medium'>Medium</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveStyle({
      padding: '12px 24px',
      fontSize: '16px',
    });

    rerender(<Button size='large'>Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveStyle({
      padding: '16px 32px',
      fontSize: '18px',
    });
  });

  it('handles clicks correctly', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Button</Button>);

    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('sets correct accessibility attributes', () => {
    render(<Button testId='test-button'>Accessible Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-testid', 'test-button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('supports different button types', () => {
    const { rerender } = render(<Button type='submit'>Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

    rerender(<Button type='button'>Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});
