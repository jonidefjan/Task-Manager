import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Checkbox } from '../components/atoms/Checkbox/Checkbox';

describe('Checkbox', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with basic props', () => {
    render(<Checkbox checked={false} onChange={mockOnChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('displays checked state correctly', () => {
    render(<Checkbox checked={true} onChange={mockOnChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onChange when clicked', () => {
    render(<Checkbox checked={false} onChange={mockOnChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('toggles state correctly', () => {
    const { rerender } = render(
      <Checkbox checked={false} onChange={mockOnChange} />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith(true);

    rerender(<Checkbox checked={true} onChange={mockOnChange} />);
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith(false);
  });

  it('renders with label', () => {
    render(
      <Checkbox checked={false} onChange={mockOnChange} label='Test label' />
    );

    const label = screen.getByText('Test label');
    expect(label).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('supports disabled state', () => {
    render(<Checkbox checked={false} onChange={mockOnChange} disabled />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('applies custom className', () => {
    render(
      <Checkbox
        checked={false}
        onChange={mockOnChange}
        className='custom-class'
      />
    );

    const container = screen.getByRole('checkbox').closest('label');
    expect(container).toHaveClass('custom-class');
  });

  it('supports testId for testing', () => {
    render(
      <Checkbox
        checked={false}
        onChange={mockOnChange}
        testId='test-checkbox'
      />
    );

    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <Checkbox
        checked={false}
        onChange={mockOnChange}
        label='Accessible checkbox'
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('type', 'checkbox');

    const label = screen.getByText('Accessible checkbox');
    expect(label).toBeInTheDocument();
  });

  it('label click toggles checkbox', () => {
    render(
      <Checkbox checked={false} onChange={mockOnChange} label='Click me' />
    );

    const label = screen.getByText('Click me');
    fireEvent.click(label);

    expect(mockOnChange).toHaveBeenCalledWith(true);
  });
});
