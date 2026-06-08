import { useFormResults } from '../Store/Store.tsx';
import { readFileAsBase64 } from '../utilities/readFileAsBase64.ts';
import { z } from 'zod';
import { useState } from 'react';

const formSchema = z
  .object({
    name: z.string().refine((val) => val === '' || /^[A-ZА-Я]/.test(val), {
      message: 'First letter must be uppercase',
    }),
    age: z
      .string()
      .refine((val) => val === '' || !isNaN(Number(val)), {
        message: 'Age must be a number',
      })
      .refine((val) => val === '' || Number(val) > 0, {
        message: 'Age must be a positive number',
      }),
    email: z
      .string()
      .refine((val) => val.includes('@'), {
        message: 'Email must contain @',
      })
      .refine((val) => val.indexOf('@') === val.lastIndexOf('@'), {
        message: 'Email must contain only one @',
      })
      .refine((val) => val.indexOf('@') > 0, {
        message: 'Local part must be non-empty',
      })
      .refine(
        (val) => {
          const domain = val.split('@')[1];
          return domain && domain.includes('.');
        },
        {
          message: 'Domain must contain at least one dot',
        }
      ),
    password: z
      .string()
      .refine((val) => /[0-9]/.test(val), {
        message: 'Password must contain at least 1 number',
      })
      .refine((val) => /[A-ZА-Я]/.test(val), {
        message: 'Password must contain at least 1 uppercase letter',
      })
      .refine((val) => /[a-zа-я]/.test(val), {
        message: 'Password must contain at least 1 lowercase letter',
      })
      .refine((val) => /[^a-zA-Zа-яА-Я0-9]/.test(val), {
        message: 'Password must contain at least 1 special character',
      }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Password must match',
    path: ['passwordConfirm'],
  });

const UncontrolledForm = ({ onClose }: { onClose: () => void }) => {
  const { addResult, countries } = useFormResults();
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameTouched, setNameTouched] = useState(false);
  const [ageError, setAgeError] = useState<string | null>(null);
  const [ageTouched, setAgeTouched] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState({
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecial: false,
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [countryError, setCountryError] = useState<string | null>(null);
  const [countryTouched, setCountryTouched] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleNameInput = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const nameValue = event.currentTarget.value;
    setNameTouched(true);

    if (!nameValue) {
      setNameError(null);
      return;
    }

    const result = formSchema.shape.name.safeParse(nameValue);
    const error = !result.success ? result.error.issues[0].message : null;
    setNameError(error);
  };

  const handleAgeInput = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const ageValue = event.currentTarget.value;
    setAgeTouched(true);

    const result = formSchema.shape.age.safeParse(ageValue);
    const error = !result.success ? result.error.issues[0].message : null;
    setAgeError(error);
  };

  const handleEmailInput = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const emailValue = event.currentTarget.value;
    setEmailTouched(true);
    const result = formSchema.shape.email.safeParse(emailValue);
    const error = !result.success ? result.error.issues[0].message : null;
    setEmailError(error);
  };

  const handlePasswordInput = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const passwordValue = event.currentTarget.value;
    formSchema.shape.password.safeParse(passwordValue);
    setPassword(passwordValue);
    setPasswordStrength({
      hasNumber: /[0-9]/.test(passwordValue),
      hasUppercase: /[A-ZА-Я]/.test(passwordValue),
      hasLowercase: /[a-zа-я]/.test(passwordValue),
      hasSpecial: /[^a-zA-Zа-яА-Я0-9]/.test(passwordValue),
    });
  };

  const handleCountryInput = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setCountryTouched(true);
    setCountryError(value && !countries.includes(value) ? 'Select a country from the list' : null);
  };

  const handlePasswordConfirmInput = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const passwordConfirmValue = event.currentTarget.value;
    const error =
      password !== passwordConfirmValue ? 'Passwords must match' : null;
    setPasswordError(error);
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const elements = form.elements;

    const imageInput = elements.namedItem('image') as HTMLInputElement;
    const file = imageInput.files?.[0];

    if (file) {
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        setImageError('Only PNG and JPEG images are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image must be smaller than 5 MB');
        return;
      }
    }
    setImageError(null);

    const submit = async () => {
      const imageBase64 = file ? await readFileAsBase64(file) : '';
      addResult({
        source: 'uncontrolled',
        name: (elements.namedItem('name') as HTMLInputElement).value,
        email: (elements.namedItem('email') as HTMLInputElement).value,
        age: Number((elements.namedItem('age') as HTMLInputElement).value),
        image: imageBase64,
        password: (elements.namedItem('password') as HTMLInputElement).value,
        privacy: (elements.namedItem('privacy') as HTMLInputElement).checked,
        country: (elements.namedItem('country') as HTMLInputElement).value,
      });
      form.reset();
      onClose();
    };
    submit();
  };

  const isPasswordStrong =
    passwordStrength.hasNumber &&
    passwordStrength.hasUppercase &&
    passwordStrength.hasLowercase &&
    passwordStrength.hasSpecial;

  const isFormValid =
    nameTouched &&
    ageTouched &&
    emailTouched &&
    countryTouched &&
    isPasswordStrong &&
    !nameError &&
    !ageError &&
    !emailError &&
    !passwordError &&
    !countryError;

  return (
    <>
      <h2>Uncontrolled Modal</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name
          <input
            onInput={handleNameInput}
            id="name"
            type="text"
            placeholder="name"
            required
            autoFocus
          />
          <p className="validate-name-field">{nameError}</p>
        </label>
        <label htmlFor="age">
          How old are you?
          <input
            onInput={handleAgeInput}
            id="age"
            type="number"
            placeholder="age"
            required
          />
          <p className="validate-age-field">{ageError}</p>
        </label>
        <label htmlFor="email">
          Email
          <input
            onInput={handleEmailInput}
            id="email"
            type="email"
            placeholder="name@mail.com"
            required
          />
          <p className="validate-email-field">{emailError}</p>
        </label>
        <label htmlFor="country">
          Country
          <input
            onInput={handleCountryInput}
            id="country"
            name="country"
            type="text"
            list="countries-list"
            placeholder="Start typing..."
            required
          />
          <datalist id="countries-list">
            {countries.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <p className="validate-country-field">{countryError}</p>
        </label>
        <fieldset>
          <legend>Select your gender:</legend>
          <div className="radio-group">
            <input type="radio" id="female" name="gender" />
            <label htmlFor="female">Female</label>
          </div>
          <div className="radio-group">
            <input type="radio" id="male" name="gender" />
            <label htmlFor="male">Male</label>
          </div>
        </fieldset>
        <label htmlFor="image">
          Upload file
          <input id="image" name="image" type="file" accept="image/png, image/jpeg" />
          <p className="validate-image-field">{imageError}</p>
        </label>
        <label htmlFor="password">
          Password
          <input onInput={handlePasswordInput} id="password" type="password" />
          <ul className="password-strength">
            <li className={passwordStrength.hasNumber ? 'valid' : 'invalid'}>
              At least 1 number
            </li>
            <li className={passwordStrength.hasUppercase ? 'valid' : 'invalid'}>
              At least 1 uppercase letter
            </li>
            <li className={passwordStrength.hasLowercase ? 'valid' : 'invalid'}>
              At least 1 lowercase letter
            </li>
            <li className={passwordStrength.hasSpecial ? 'valid' : 'invalid'}>
              At least 1 special character
            </li>
          </ul>
        </label>
        <label htmlFor="confirm-password">
          Confirm Password
          <input
            onInput={handlePasswordConfirmInput}
            id="confirm-password"
            type="password"
          />
          <p className="validate-password-field">{passwordError}</p>
        </label>
        <label htmlFor="privacy">
          <input id="privacy" type="checkbox" required />I agree with Terms &
          Conditions
        </label>
        <button type="submit" disabled={!isFormValid}>
          Submit
        </button>
      </form>
    </>
  );
};

export default UncontrolledForm;
