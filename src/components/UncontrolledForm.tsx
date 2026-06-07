import { useFormResults } from '../Store/Store.tsx';

const UncontrolledForm = ({ onClose }: { onClose: () => void }) => {
  const { addResult } = useFormResults();
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const elements = event.currentTarget.elements;

    const FormResult = {
      name: (elements.namedItem('name') as HTMLInputElement).value,
      email: (elements.namedItem('email') as HTMLInputElement).value,
      age: Number((elements.namedItem('age') as HTMLInputElement).value),
      privacy: (elements.namedItem('privacy') as HTMLInputElement).checked,
    };

    addResult(FormResult);
    onClose();
  };

  return (
    <>
      <h2>Uncontrolled Modal</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name
          <input id="name" type="text" placeholder="name" required autoFocus />
        </label>
        <label htmlFor="age">
          How old are you?
          <input id="age" type="number" placeholder="age" required />
        </label>
        <label htmlFor="email">
          Email
          <input id="email" type="email" placeholder="name@mail.com" required />
        </label>
        <label htmlFor="privacy">
          <input id="privacy" type="checkbox" required />I agree with Terms &
          Conditions
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default UncontrolledForm;
