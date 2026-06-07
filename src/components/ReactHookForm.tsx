const ReactHookForm = () => (
  <>
    <h2>RHF Modal</h2>
    <form action="">
      <label htmlFor="rhf-name">
        Name
        <input id="rhf-name" type="text" placeholder="name" autoFocus />
      </label>
      <label htmlFor="rhf-age">
        How old are you?
        <input id="rhf-age" type="number" placeholder="age" />
      </label>
      <label htmlFor="rhf-email">
        Email
        <input id="rhf-email" type="email" placeholder="name@mail.com" />
      </label>
      <label htmlFor="rhf-privacy">
        <input id="rhf-privacy" type="checkbox" />I agree with Terms &
        Conditions
      </label>
      <button type="submit">Submit</button>
    </form>
  </>
);
export default ReactHookForm;
