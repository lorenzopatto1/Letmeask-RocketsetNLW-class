import { ButtonHTMLAttributes } from "react";

import './styles.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
  leftModalButton?: boolean;
  rightModalButton?: boolean;
};

export function Button({ isOutlined = false, leftModalButton = false, rightModalButton = false,...props }: ButtonProps) {
  return (
    <button
      className={`button ${isOutlined ? 'outlined' : ''} ${leftModalButton ? 'left-modal-button' : ''} ${rightModalButton ? 'right-modal-button' : ''}`}
      {...props}
    />
  );
}