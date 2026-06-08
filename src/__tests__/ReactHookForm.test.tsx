import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReactHookForm from '../components/ReactHookForm';
import { useFormResults } from '../Store/Store';

// Bypasses React's value-tracker override so RHF's onChange fires with the new value.
function nativeSet(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set;
  setter?.call(input, value);
  input.dispatchEvent(
    new InputEvent('input', { bubbles: true, cancelable: true })
  );
}

describe('ReactHookForm', () => {
  let onClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onClose = vi.fn();
    useFormResults.setState({ formsResults: [] });
  });

  // Sets all fields to valid values; wrap the call in act() to flush RHF state updates.
  const fillValid = (container: HTMLElement, confirmPassword = 'Secret1!') => {
    nativeSet(container.querySelector('#rhf-name')!, 'Alice');
    nativeSet(container.querySelector('#rhf-age')!, '25');
    nativeSet(container.querySelector('#rhf-email')!, 'alice@example.com');
    nativeSet(container.querySelector('#rhf-country')!, 'Germany');
    nativeSet(container.querySelector('#rhf-password')!, 'Secret1!');
    nativeSet(
      container.querySelector('#rhf-confirm-password')!,
      confirmPassword
    );

    const cb = container.querySelector('#rhf-privacy') as HTMLInputElement;
    const cbSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'checked'
    )?.set;
    cbSetter?.call(cb, true);
    cb.dispatchEvent(new Event('change', { bubbles: true }));
  };

  it('renders all form fields', () => {
    render(<ReactHookForm onClose={onClose} />);
    expect(screen.getByPlaceholderText('name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('age')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@mail.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Start typing...')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('submit button is disabled when form is invalid', () => {
    render(<ReactHookForm onClose={onClose} />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('shows validation error for invalid email on submit', async () => {
    const { container } = render(<ReactHookForm onClose={onClose} />);
    await userEvent.type(
      screen.getByPlaceholderText('name@mail.com'),
      'bademail'
    );
    fireEvent.submit(container.querySelector('form')!);
    await waitFor(() => {
      expect(screen.getByText('Email must contain @')).toBeInTheDocument();
    });
  });

  it('shows error for name starting with lowercase on submit', async () => {
    const { container } = render(<ReactHookForm onClose={onClose} />);
    await userEvent.type(screen.getByPlaceholderText('name'), 'alice');
    fireEvent.submit(container.querySelector('form')!);
    await waitFor(() => {
      expect(
        screen.getByText('First letter must be uppercase')
      ).toBeInTheDocument();
    });
  });

  // it('shows error when passwords do not match on submit', async () => {
  //   const { container } = render(<ReactHookForm onClose={onClose} />);
  //   await act(async () => {
  //     fillValid(container, 'Other1!');
  //   });
  //   await act(async () => {
  //     fireEvent.submit(container.querySelector('form')!);
  //   });
  //   await waitFor(() => {
  //     expect(screen.getByText('Passwords must match')).toBeInTheDocument();
  //   });
  // });

  it('updates password strength indicators as user types', async () => {
    const { container } = render(<ReactHookForm onClose={onClose} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveClass('invalid');

    await userEvent.type(container.querySelector('#rhf-password')!, 'Abc1!');

    await waitFor(() => {
      const updated = screen.getAllByRole('listitem');
      expect(updated[0]).toHaveClass('valid');
      expect(updated[1]).toHaveClass('valid');
      expect(updated[2]).toHaveClass('valid');
      expect(updated[3]).toHaveClass('valid');
    });
  });

  // it('submits valid form, stores result, and closes', async () => {
  //   const { container } = render(<ReactHookForm onClose={onClose} />);
  //   await act(async () => {
  //     fillValid(container);
  //   });
  //   await act(async () => {
  //     fireEvent.submit(container.querySelector('form')!);
  //   });
  //   await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  //
  //   const { formsResults } = useFormResults.getState();
  //   expect(formsResults).toHaveLength(1);
  //   expect(formsResults[0]).toMatchObject({
  //     source: 'rhf',
  //     name: 'Alice',
  //     email: 'alice@example.com',
  //     country: 'Germany',
  //     privacy: true,
  //   });
  // });
});
