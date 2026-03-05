import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button', { name: 'Click me' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<Button variant='destructive'>Delete</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-destructive');

    rerender(<Button variant='outline'>Cancel</Button>);
    expect(button.className).toContain('border');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Button size='sm'>Small</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('h-8');

    rerender(<Button size='lg'>Large</Button>);
    expect(button.className).toContain('h-10');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.className).toContain('disabled:pointer-events-none');
  });
});
