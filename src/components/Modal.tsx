import { createPortal } from 'react-dom';

const Modal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) => {
  return createPortal(
    <div className="modal-overflow" onClick={onClose}>
      <div className="modal-dialog">
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    </div>,
    document.body,
    'Modal'
  );
};
export default Modal;
