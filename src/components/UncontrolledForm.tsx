import React, { useState } from 'react';
import { useFormResults } from '../Store/Store.tsx';
import { readFileAsBase64 } from '../utilities/readFileAsBase64.ts';
import { z } from 'zod';

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .refine((val) => /^[A-ZА-Я]/.test(val), {
        message: 'First letter must be uppercase',
      }),
    age: z
      .string()
      .min(1, 'Age is required')
      .refine((val) => !isNaN(Number(val)), {
        message: 'Age must be a number',
      })
      .refine((val) => Number(val) > 0, {
        message: 'Age must be a positive number',
      }),
    email: z
      .string()
      .min(1, 'Email is required')
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
        { message: 'Domain must contain at least one dot' }
      ),
    password: z
      .string()
      .min(1, 'Password is required')
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
    message: 'Passwords must match',
    path: ['passwordConfirm'],
  });

type FieldErrors = Partial<
  Record<
    | 'name'
    | 'age'
    | 'email'
    | 'password'
    | 'passwordConfirm'
    | 'country'
    | 'image'
    | 'privacy',
    string
  >
>;

const UncontrolledForm = ({ onClose }: { onClose: () => void }) => {
  const { addResult, countries } = useFormResults();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [passwordStrength, setPasswordStrength] = useState({
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecial: false,
  });

  const handlePasswordInput = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const val = event.currentTarget.value;
    setPasswordStrength({
      hasNumber: /[0-9]/.test(val),
      hasUppercase: /[A-ZА-Я]/.test(val),
      hasLowercase: /[a-zа-я]/.test(val),
      hasSpecial: /[^a-zA-Zа-яА-Я0-9]/.test(val),
    });
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const els = form.elements;

    const nameVal = (els.namedItem('name') as HTMLInputElement).value;
    const ageVal = (els.namedItem('age') as HTMLInputElement).value;
    const emailVal = (els.namedItem('email') as HTMLInputElement).value;
    const countryVal = (els.namedItem('country') as HTMLInputElement).value;
    const passwordVal = (els.namedItem('password') as HTMLInputElement).value;
    const passwordConfirmVal = (
      els.namedItem('passwordConfirm') as HTMLInputElement
    ).value;
    const file = (els.namedItem('image') as HTMLInputElement).files?.[0];
    const genderVal =
      (els.namedItem('gender') as RadioNodeList)?.value || undefined;
    const privacyVal = (els.namedItem('privacy') as HTMLInputElement).checked;

    const newErrors: FieldErrors = {};

    const result = formSchema.safeParse({
      name: nameVal,
      age: ageVal,
      email: emailVal,
      password: passwordVal,
      passwordConfirm: passwordConfirmVal,
    });
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (!newErrors[field]) newErrors[field] = issue.message;
      }
    }

    if (!countryVal) {
      newErrors.country = 'Country is required';
    } else if (!countries.includes(countryVal)) {
      newErrors.country = 'Select a country from the list';
    }

    if (file) {
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        newErrors.image = 'Only PNG and JPEG images are allowed';
      } else if (file.size > 5 * 1024 * 1024) {
        newErrors.image = 'Image must be smaller than 5 MB';
      }
    }

    if (!privacyVal) {
      newErrors.privacy = 'You must agree to Terms & Conditions';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const submit = async () => {
      const imageBase64 = file ? await readFileAsBase64(file) : '';
      addResult({
        source: 'uncontrolled',
        name: nameVal,
        email: emailVal,
        age: Number(ageVal),
        gender: genderVal,
        image: imageBase64,
        password: passwordVal,
        privacy: privacyVal,
        country: countryVal,
      });
      form.reset();
      setPasswordStrength({
        hasNumber: false,
        hasUppercase: false,
        hasLowercase: false,
        hasSpecial: false,
      });
      setErrors({});
      onClose();
    };
    submit();
  };

  return (
    <>
      <h2>Uncontrolled Modal</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">
          Name
          <input
            id="name"
            name="name"
            type="text"
            placeholder="name"
            autoFocus
          />
          <p className="validate-name-field">{errors.name}</p>
        </label>
        <label htmlFor="age">
          How old are you?
          <input id="age" name="age" type="number" placeholder="age" />
          <p className="validate-age-field">{errors.age}</p>
        </label>
        <label htmlFor="email">
          Email
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@mail.com"
          />
          <p className="validate-email-field">{errors.email}</p>
        </label>
        <label htmlFor="country">
          Country
          <input
            id="country"
            name="country"
            type="text"
            list="countries-list"
            placeholder="Start typing..."
          />
          <datalist id="countries-list">
            {countries.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <p className="validate-country-field">{errors.country}</p>
        </label>
        <fieldset>
          <legend>Select your gender:</legend>
          <div className="radio-group">
            <input type="radio" id="female" name="gender" value="female" />
            <label htmlFor="female">Female</label>
          </div>
          <div className="radio-group">
            <input type="radio" id="male" name="gender" value="male" />
            <label htmlFor="male">Male</label>
          </div>
        </fieldset>
        <label htmlFor="image">
          Upload file
          <input
            id="image"
            name="image"
            type="file"
            accept="image/png, image/jpeg"
          />
          <p className="validate-image-field">{errors.image}</p>
        </label>
        <label htmlFor="password">
          Password
          <input
            onInput={handlePasswordInput}
            id="password"
            name="password"
            type="password"
          />
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
          <p className="validate-password-field">{errors.password}</p>
        </label>
        <label htmlFor="confirm-password">
          Confirm Password
          <input id="confirm-password" name="passwordConfirm" type="password" />
          <p className="validate-password-field">{errors.passwordConfirm}</p>
        </label>
        <label htmlFor="privacy">
          <input id="privacy" name="privacy" type="checkbox" />I agree with
          Terms & Conditions
        </label>
        <p className="validate-privacy-field">{errors.privacy}</p>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default UncontrolledForm;
