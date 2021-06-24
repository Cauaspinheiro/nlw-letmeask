import React, { ButtonHTMLAttributes } from 'react'

import styles from '../styles/components/button.module.scss'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isOutlined?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  isOutlined = false,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`${styles.container} ${isOutlined ? styles.outlined : ''}`}
    >
      {children}
    </button>
  )
}

export default Button
