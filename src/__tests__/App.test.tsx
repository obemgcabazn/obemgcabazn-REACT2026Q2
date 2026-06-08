import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { useFormResults } from '../Store/Store';
import type { FormResult } from '../Store/Store';

vi.mock('../components/Modal', () => ({
  default: ({
    children,
    onClose,
  }: {
    children: React.ReactNode;
    onClose: () => void;
  }) => (
    <div data-testid="modal">
      <button aria-label="close-modal" onClick={onClose}>
        Close
      </button>
      {children}
    </div>
  ),
}));

vi.mock('../components/UncontrolledForm', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="uncontrolled-form">
      <button onClick={onClose}>UC Submit</button>
    </div>
  ),
}));

vi.mock('../components/ReactHookForm', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="rhf-form">
      <button onClick={onClose}>RHF Submit</button>
    </div>
  ),
}));

const makeResult = (source: 'uncontrolled' | 'rhf'): FormResult => ({
  source,
  name: 'Alice',
  age: 25,
  email: 'alice@example.com',
  country: 'Germany',
  privacy: true,
  image: '',
  password: 'Secret1!',
});

describe('App', () => {
  beforeEach(() => {
    useFormResults.setState({ formsResults: [] });
  });

  it('renders both action buttons', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /open react hook form/i })
    ).toBeInTheDocument();
  });

  it('renders two result sections with headings', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /uncontrolled form/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /react hook form/i })
    ).toBeInTheDocument();
  });

  it('opens uncontrolled form modal on button click', () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();
  });

  it('opens RHF modal on button click', () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole('button', { name: /open react hook form/i })
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('rhf-form')).toBeInTheDocument();
  });

  it('switching to uncontrolled form closes RHF modal', () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole('button', { name: /open react hook form/i })
    );
    expect(screen.getByTestId('rhf-form')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    );
    expect(screen.queryByTestId('rhf-form')).not.toBeInTheDocument();
    expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();
  });

  it('switching to RHF modal closes uncontrolled form', () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    );
    expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /open react hook form/i })
    );
    expect(screen.queryByTestId('uncontrolled-form')).not.toBeInTheDocument();
    expect(screen.getByTestId('rhf-form')).toBeInTheDocument();
  });

  it('closes uncontrolled modal via onClose', () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'close-modal' }));
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('closes RHF modal via onClose', () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole('button', { name: /open react hook form/i })
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'close-modal' }));
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders uncontrolled results from store', () => {
    useFormResults.setState({ formsResults: [makeResult('uncontrolled')] });
    render(<App />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders RHF results from store', () => {
    useFormResults.setState({ formsResults: [makeResult('rhf')] });
    render(<App />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('marks the most recent result as new', () => {
    useFormResults.setState({
      formsResults: [makeResult('uncontrolled'), makeResult('uncontrolled')],
    });
    render(<App />);
    const cards = document.querySelectorAll('.result-card');
    expect(cards[0]).not.toHaveClass('result-new');
    expect(cards[1]).toHaveClass('result-new');
  });

  it('form child component onClose callback closes the modal', () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    );
    expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /uc submit/i }));
    expect(screen.queryByTestId('uncontrolled-form')).not.toBeInTheDocument();
  });
});
