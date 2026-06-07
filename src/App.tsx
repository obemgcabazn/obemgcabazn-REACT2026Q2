import Modal from './components/Modal';
import UncontrolledForm from './components/UncontrolledForm';
import ReactHookForm from './components/ReactHookForm';
import { useState } from 'react';
import { useFormResults } from './Store/Store.tsx';

function App() {
  const [open, setOpen] = useState(false);
  const [openRHF, setOpenRHF] = useState(false);
  const { formsResults } = useFormResults();

  const showUncontrolledModal = () => {
    setOpenRHF(false);
    setOpen(true);
  };

  const showRHFModal = () => {
    setOpenRHF(true);
    setOpen(false);
  };

  return (
    <>
      <button onClick={showUncontrolledModal}>Open uncontroled form</button>
      <button onClick={showRHFModal}>Open React Hook form</button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <UncontrolledForm onClose={() => setOpen(false)} />
        </Modal>
      )}
      {openRHF && (
        <Modal onClose={() => setOpenRHF(false)}>
          <ReactHookForm />
        </Modal>
      )}

      <div className="results-output">
        {formsResults.map((i) => (
          <>
            <div>{i.name}</div>
            <div>{i.age}</div>
            <div>{i.email}</div>
          </>
        ))}
        {/*<div className="uncontrolled-form-results"></div>*/}
        {/*<div className="rhf-form-results"></div>*/}
      </div>
    </>
  );
}

export default App;
