import Modal from './components/Modal';
import UncontrolledForm from './components/UncontrolledForm';
import ReactHookForm from './components/ReactHookForm';
import { useState } from 'react';
import { useFormResults } from './Store/Store.tsx';

function App() {
  const [open, setOpen] = useState(false);
  const [openRHF, setOpenRHF] = useState(false);
  const { formsResults } = useFormResults();
  const newItemGlobalIndex =
    formsResults.length > 0 ? formsResults.length - 1 : null;

  const showUncontrolledModal = () => {
    setOpenRHF(false);
    setOpen(true);
  };

  const showRHFModal = () => {
    setOpen(false);
    setOpenRHF(true);
  };

  const ucResults = formsResults
    .map((item, globalIndex) => ({ item, globalIndex }))
    .filter(({ item }) => item.source === 'uncontrolled');

  const rhfResults = formsResults
    .map((item, globalIndex) => ({ item, globalIndex }))
    .filter(({ item }) => item.source === 'rhf');

  return (
    <div className="app">
      <div className="app-actions">
        <button onClick={showUncontrolledModal}>Open Uncontrolled form</button>
        <button onClick={showRHFModal}>Open React Hook form</button>
      </div>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <UncontrolledForm onClose={() => setOpen(false)} />
        </Modal>
      )}
      {openRHF && (
        <Modal onClose={() => setOpenRHF(false)}>
          <ReactHookForm onClose={() => setOpenRHF(false)} />
        </Modal>
      )}
      <div className="results-output">
        <section>
          <h2>Uncontrolled Form</h2>
          <ul className="form-results">
            {ucResults.map(({ item, globalIndex }, localIndex) => (
              <li
                key={localIndex}
                className={`result-card${globalIndex === newItemGlobalIndex ? ' result-new' : ''}`}
              >
                <div>
                  <strong>Name:</strong> {item.name}
                </div>
                <div>
                  <strong>Age:</strong> {item.age}
                </div>
                <div>
                  <strong>Email:</strong> {item.email}
                </div>
                <div>
                  <strong>Country:</strong> {item.country}
                </div>
                {item.gender && (
                  <div>
                    <strong>Gender:</strong> {item.gender}
                  </div>
                )}
                <div>
                  <strong>Privacy:</strong>{' '}
                  {item.privacy ? 'Agreed' : 'Not agreed'}
                </div>
                {item.image && <img src={item.image} alt="uploaded" />}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>React Hook Form</h2>
          <ul className="form-results">
            {rhfResults.map(({ item, globalIndex }, localIndex) => (
              <li
                key={localIndex}
                className={`result-card${globalIndex === newItemGlobalIndex ? ' result-new' : ''}`}
              >
                <div>
                  <strong>Name:</strong> {item.name}
                </div>
                <div>
                  <strong>Age:</strong> {item.age}
                </div>
                <div>
                  <strong>Email:</strong> {item.email}
                </div>
                <div>
                  <strong>Country:</strong> {item.country}
                </div>
                {item.gender && (
                  <div>
                    <strong>Gender:</strong> {item.gender}
                  </div>
                )}
                <div>
                  <strong>Privacy:</strong>{' '}
                  {item.privacy ? 'Agreed' : 'Not agreed'}
                </div>
                {item.image && <img src={item.image} alt="uploaded" />}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;
