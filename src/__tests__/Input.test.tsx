import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from '../components/atoms/Input/Input';

describe('Input', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with basic props', () => {
    render(<Input value='' placeholder='Enter text' onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<Input value='test value' onChange={mockOnChange} />);

    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    render(<Input value='' onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test input' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('test input');
  });

  it('calls onKeyDown when pressing keys', () => {
    const handleKeyDown = jest.fn();
    render(
      <Input value='' onChange={mockOnChange} onKeyDown={handleKeyDown} />
    );

    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(handleKeyDown).toHaveBeenCalledTimes(1);
    expect(handleKeyDown).toHaveBeenCalledWith('Enter');
  });

  it('calls onBlur when focus is lost', () => {
    const handleBlur = jest.fn();
    render(<Input value='' onChange={mockOnChange} onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input value='' onChange={mockOnChange} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('applies custom className', () => {
    render(<Input value='' onChange={mockOnChange} className='custom-class' />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('supports disabled state', () => {
    render(<Input value='' onChange={mockOnChange} disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('supports autoFocus', () => {
    render(<Input value='' onChange={mockOnChange} autoFocus />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveFocus();
  });

  it('supports maxLength attribute', () => {
    render(<Input value='' onChange={mockOnChange} maxLength={10} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('supports testId for testing', () => {
    render(<Input value='' onChange={mockOnChange} testId='test-input' />);

    const input = screen.getByTestId('test-input');
    expect(input).toBeInTheDocument();
  });
});
