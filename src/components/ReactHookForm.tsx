import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormResults } from '../Store/Store.tsx';
import { readFileAsBase64 } from '../utilities/readFileAsBase64.ts';

const createFormSchema = (countries: string[]) =>
  z
    .object({
      name: z
        .string()
        .min(1, 'Name is required')
        .refine((val) => /^[A-ZА-Я]/.test(val), {
          message: 'First letter must be uppercase',
        }),
      age: z.number().positive('Age must be a positive number'),
      email: z
        .string()
        .min(1, 'Email is required')
        .refine((val) => val.includes('@'), { message: 'Email must contain @' })
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
      country: z
        .string()
        .min(1, 'Country is required')
        .refine((val) => countries.includes(val), {
          message: 'Select a country from the list',
        }),
      gender: z.string().optional(),
      image: z
        .custom<FileList>()
        .refine(
          (files) =>
            !files ||
            files.length === 0 ||
            ['image/png', 'image/jpeg'].includes(files[0].type),
          { message: 'Only PNG and JPEG images are allowed' }
        )
        .refine(
          (files) =>
            !files || files.length === 0 || files[0].size <= 5 * 1024 * 1024,
          { message: 'Image must be smaller than 5 MB' }
        )
        .optional(),
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
      privacy: z.boolean().refine((val) => val === true, {
        message: 'You must agree to Terms & Conditions',
      }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: 'Passwords must match',
      path: ['passwordConfirm'],
    });

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

const ReactHookForm = ({ onClose }: { onClose: () => void }) => {
  const { countries, addResult } = useFormResults();
  const formSchema = createFormSchema(countries);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      country: '',
      password: '',
      passwordConfirm: '',
      privacy: false,
    },
  });

  const password = watch('password');
  const passwordStrength = {
    hasNumber: /[0-9]/.test(password),
    hasUppercase: /[A-ZА-Я]/.test(password),
    hasLowercase: /[a-zа-я]/.test(password),
    hasSpecial: /[^a-zA-Zа-яА-Я0-9]/.test(password),
  };

  const onSubmit = async (data: FormData) => {
    const file = data.image?.[0];
    const imageBase64 = file ? await readFileAsBase64(file) : '';
    addResult({
      source: 'rhf',
      name: data.name,
      age: data.age,
      email: data.email,
      country: data.country,
      gender: data.gender,
      image: imageBase64,
      password: data.password,
      privacy: data.privacy,
    });
    reset();
    onClose();
  };

  return (
    <>
      <h2>RHF Modal</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="rhf-name">
          Name
          <input
            {...register('name')}
            id="rhf-name"
            type="text"
            placeholder="name"
            autoFocus
          />
          <p className="validate-name-field">{errors.name?.message}</p>
        </label>
        <label htmlFor="rhf-age">
          How old are you?
          <input
            {...register('age', { valueAsNumber: true })}
            id="rhf-age"
            type="number"
            placeholder="age"
          />
          <p className="validate-age-field">{errors.age?.message}</p>
        </label>
        <label htmlFor="rhf-email">
          Email
          <input
            {...register('email')}
            id="rhf-email"
            type="email"
            placeholder="name@mail.com"
          />
          <p className="validate-email-field">{errors.email?.message}</p>
        </label>
        <label htmlFor="rhf-country">
          Country
          <input
            {...register('country')}
            id="rhf-country"
            type="text"
            list="rhf-countries-list"
            placeholder="Start typing..."
          />
          <datalist id="rhf-countries-list">
            {countries.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <p className="validate-country-field">{errors.country?.message}</p>
        </label>
        <fieldset>
          <legend>Select your gender:</legend>
          <div className="radio-group">
            <input
              {...register('gender')}
              type="radio"
              id="rhf-female"
              value="female"
            />
            <label htmlFor="rhf-female">Female</label>
          </div>
          <div className="radio-group">
            <input
              {...register('gender')}
              type="radio"
              id="rhf-male"
              value="male"
            />
            <label htmlFor="rhf-male">Male</label>
          </div>
        </fieldset>
        <label htmlFor="rhf-image">
          Upload file
          <input
            {...register('image')}
            id="rhf-image"
            type="file"
            accept="image/png, image/jpeg"
          />
          <p className="validate-image-field">
            {errors.image?.message as string}
          </p>
        </label>
        <label htmlFor="rhf-password">
          Password
          <input {...register('password')} id="rhf-password" type="password" />
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
          <p className="validate-password-field">{errors.password?.message}</p>
        </label>
        <label htmlFor="rhf-confirm-password">
          Confirm Password
          <input
            {...register('passwordConfirm')}
            id="rhf-confirm-password"
            type="password"
          />
          <p className="validate-password-field">
            {errors.passwordConfirm?.message}
          </p>
        </label>
        <label htmlFor="rhf-privacy">
          <input {...register('privacy')} id="rhf-privacy" type="checkbox" />I
          agree with Terms & Conditions
        </label>
        <button type="submit" disabled={!isValid}>
          Submit
        </button>
      </form>
    </>
  );
};

export default ReactHookForm;
