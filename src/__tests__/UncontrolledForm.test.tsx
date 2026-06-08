import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UncontrolledForm from '../components/UncontrolledForm';
import { useFormResults } from '../Store/Store';

describe('UncontrolledForm', () => {
  let onClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onClose = vi.fn();
    useFormResults.setState({ formsResults: [] });
  });

  const fill = (
    container: HTMLElement,
    values: {
      name?: string;
      age?: string;
      email?: string;
      country?: string;
      password?: string;
      passwordConfirm?: string;
      privacy?: boolean;
    }
  ) => {
    if (values.name !== undefined)
      fireEvent.change(container.querySelector('#name')!, {
        target: { value: values.name },
      });
    if (values.age !== undefined)
      fireEvent.change(container.querySelector('#age')!, {
        target: { value: values.age },
      });
    if (values.email !== undefined)
      fireEvent.change(container.querySelector('#email')!, {
        target: { value: values.email },
      });
    if (values.country !== undefined)
      fireEvent.change(container.querySelector('#country')!, {
        target: { value: values.country },
      });
    if (values.password !== undefined) {
      const pw = container.querySelector('#password')!;
      fireEvent.input(pw, { target: { value: values.password } });
      fireEvent.change(pw, { target: { value: values.password } });
    }
    if (values.passwordConfirm !== undefined)
      fireEvent.change(container.querySelector('#confirm-password')!, {
        target: { value: values.passwordConfirm },
      });
    if (values.privacy) fireEvent.click(screen.getByRole('checkbox'));
  };

  it('renders all form fields and submit button', () => {
    render(<UncontrolledForm onClose={onClose} />);
    expect(screen.getByPlaceholderText('name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('age')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@mail.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Start typing...')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows required field errors on empty submit', async () => {
    const { container } = render(<UncontrolledForm onClose={onClose} />);
    fireEvent.submit(container.querySelector('form')!);
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Age is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Country is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(
        screen.getByText('You must agree to Terms & Conditions')
      ).toBeInTheDocument();
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows error when country is not in the list', async () => {
    const { container } = render(<UncontrolledForm onClose={onClose} />);
    fill(container, {
      name: 'Alice',
      age: '25',
      email: 'alice@example.com',
      country: 'Narnia',
      password: 'Secret1!',
      passwordConfirm: 'Secret1!',
      privacy: true,
    });
    fireEvent.submit(container.querySelector('form')!);
    await waitFor(() => {
      expect(
        screen.getByText('Select a country from the list')
      ).toBeInTheDocument();
    });
  });

  it('shows error when passwords do not match', async () => {
    const { container } = render(<UncontrolledForm onClose={onClose} />);
    fill(container, {
      name: 'Alice',
      age: '25',
      email: 'alice@example.com',
      country: 'Germany',
      password: 'Secret1!',
      passwordConfirm: 'Different1!',
      privacy: true,
    });
    fireEvent.submit(container.querySelector('form')!);
    await waitFor(() => {
      expect(screen.getByText('Passwords must match')).toBeInTheDocument();
    });
  });

  it('updates password strength indicators on input', async () => {
    const { container } = render(<UncontrolledForm onClose={onClose} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveClass('invalid');

    fireEvent.input(container.querySelector('#password')!, {
      target: { value: 'Abc1!' },
    });

    await waitFor(() => {
      const updated = screen.getAllByRole('listitem');
      expect(updated[0]).toHaveClass('valid'); // number
      expect(updated[1]).toHaveClass('valid'); // uppercase
      expect(updated[2]).toHaveClass('valid'); // lowercase
      expect(updated[3]).toHaveClass('valid'); // special
    });
  });

  it('submits valid form, stores result, and closes', async () => {
    const { container } = render(<UncontrolledForm onClose={onClose} />);
    fill(container, {
      name: 'Alice',
      age: '25',
      email: 'alice@example.com',
      country: 'Germany',
      password: 'Secret1!',
      passwordConfirm: 'Secret1!',
      privacy: true,
    });
    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());

    const { formsResults } = useFormResults.getState();
    expect(formsResults).toHaveLength(1);
    expect(formsResults[0]).toMatchObject({
      source: 'uncontrolled',
      name: 'Alice',
      age: 25,
      email: 'alice@example.com',
      country: 'Germany',
      privacy: true,
    });
  });
});
