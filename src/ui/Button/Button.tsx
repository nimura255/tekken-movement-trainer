import type { ButtonHTMLAttributes } from 'react';
import { classNames } from '$/utils/classNames';

import styles from './Button.module.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, className, onClick, ...restProps }: ButtonProps) {
  return (
    <button
      className={classNames(styles.button, className)}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </button>
  );
}
