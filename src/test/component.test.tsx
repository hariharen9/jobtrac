import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/utils';

// Simple test component to verify React Testing Library setup
const TestComponent = ({ text }: { text: string }) => (
  <div data-testid="test-component">
    <h1>{text}</h1>
    <button>Click me</button>
  </div>
);

describe('React Testing Library Setup', () => {
  it('should render a test component', () => {
    render(<TestComponent text="Hello World" />);
    
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should find elements by test id', () => {
    render(<TestComponent text="Test" />);
    
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('should handle multiple renders', () => {
    const { rerender } = render(<TestComponent text="First" />);
    expect(screen.getByText('First')).toBeInTheDocument();
    
    rerender(<TestComponent text="Second" />);
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.queryByText('First')).not.toBeInTheDocument();
  });

  it('should handle component props', () => {
    render(<TestComponent text="Props Test" />);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Props Test');
  });

  it('should work with queries', () => {
    render(<TestComponent text="Query Test" />);
    
    // getBy - throws error if not found
    expect(screen.getByText('Query Test')).toBeInTheDocument();
    
    // queryBy - returns null if not found
    expect(screen.queryByText('Not Found')).toBeNull();
    
    // findBy - async, returns promise
    expect(screen.findByText('Query Test')).resolves.toBeInTheDocument();
  });
});