import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { type MouseEvent } from 'react';

const Modal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const mouseDownTarget = useRef<EventTarget | null>(null);

  const mouseDownHandler = (e: MouseEvent<HTMLDivElement>) => {
    mouseDownTarget.current = e.target;
  };

  const clickHandler = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && mouseDownTarget.current === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <div className="modal-overflow" onMouseDown={mouseDownHandler} onClick={clickHandler}>
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