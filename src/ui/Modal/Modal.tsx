import type { ReactNode } from 'react';
import { classNames } from '$/utils/classNames';

import styled from './Modal.module.css';

type ModalProps = {
  className?: string;
  children: ReactNode;
};

export function Modal({ className, children }: ModalProps) {
  return (
    <div className={styled.modalOverlay}>
      <div className={classNames(styled.modalContainer, className)}>
        {children}
      </div>
    </div>
  );
}
