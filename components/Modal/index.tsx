import React, { FC } from 'react';
import { CloseModalButton, CreateModal } from './styles';

interface IModalProps {
  show: boolean;
  onCloseModal: () => void;
}

const Modal: FC<IModalProps> = ({ children, show, onCloseModal }) => {
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  if (!show) {
    return null;
  }
  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>x</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;
