import Image from 'next/image'
import React from 'react'

import styles from '../styles/components/question.module.scss'

import User from '../entities/user'

export interface QuestionTileProps {
  content: string
  author: User
}

const QuestionTile: React.FC<QuestionTileProps> = (props) => {
  return (
    <div className={styles.container}>
      <p>{props.content}</p>

      <footer>
        <div className={styles.user_info}>
          <Image
            src={props.author.avatar}
            alt={props.author.name}
            width="32"
            height="32"
          />

          <span>{props.author.name}</span>
        </div>

        <div>{props.children}</div>
      </footer>
    </div>
  )
}

export default QuestionTile
