import React, { ButtonHTMLAttributes } from 'react'

import styles from '../styles/components/button.module.scss'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button {...props} className={styles.container}>
      {children}
    </button>
  )
}

export default Button
