import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { type MouseEvent } from 'react';

const Modal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const clickHandler = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', function (event) {
      if (event.code === 'Escape') {
        onClose();
      }
    });
  });

  return createPortal(
    <div className="modal-overflow" onClick={clickHandler}>
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
