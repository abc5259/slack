import React, { CSSProperties, FC } from 'react';
import { CreateMenu, CloseModalButton } from './styles';

interface IMenuProps {
  show: boolean;
  onCloseModal: (e: React.MouseEvent<HTMLElement>) => void;
  style: CSSProperties;
  closeButton?: boolean;
}

const Menu: FC<IMenuProps> = ({ children, style, show, onCloseModal, closeButton = true }) => {
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('clicked');
  };
  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};

export default Menu;
