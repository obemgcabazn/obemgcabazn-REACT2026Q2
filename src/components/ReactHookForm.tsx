const ReactHookForm = () => {
  return (
    <>
      <h2>RHF Modal</h2>
      <form>
        <label htmlFor="rhf-name">
          Name
          <input
            id="rhf-name"
            type="text"
            placeholder="name"
            required
            autoFocus
          />
          <p className="validate-name-field"></p>
        </label>
        <label htmlFor="rhf-age">
          How old are you?
          <input id="rhf-age" type="number" placeholder="age" required />
          <p className="validate-age-field"></p>
        </label>
        <label htmlFor="rhf-email">
          Email
          <input
            id="rhf-email"
            type="email"
            placeholder="name@mail.com"
            required
          />
          <p className="validate-email-field"></p>
        </label>
        <label htmlFor="rhf-country">
          Country
          <input
            id="rhf-country"
            type="text"
            list="rhf-countries-list"
            placeholder="Start typing..."
            required
          />
          <datalist id="rhf-countries-list"></datalist>
          <p className="validate-country-field"></p>
        </label>
        <fieldset>
          <legend>Select your gender:</legend>
          <div className="radio-group">
            <input type="radio" id="rhf-female" name="gender" />
            <label htmlFor="rhf-female">Female</label>
          </div>
          <div className="radio-group">
            <input type="radio" id="rhf-male" name="gender" />
            <label htmlFor="rhf-male">Male</label>
          </div>
        </fieldset>
        <label htmlFor="rhf-image">
          Upload file
          <input id="rhf-image" type="file" accept="image/png, image/jpeg" />
        </label>
        <label htmlFor="rhf-password">
          Password
          <input id="rhf-password" type="password" />
          <ul className="password-strength">
            <li>At least 1 number</li>
            <li>At least 1 uppercase letter</li>
            <li>At least 1 lowercase letter</li>
            <li>At least 1 special character</li>
          </ul>
        </label>
        <label htmlFor="rhf-confirm-password">
          Confirm Password
          <input id="rhf-confirm-password" type="password" />
          <p className="validate-password-field"></p>
        </label>
        <label htmlFor="rhf-privacy">
          <input id="rhf-privacy" type="checkbox" required />I agree with Terms
          & Conditions
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default ReactHookForm;
