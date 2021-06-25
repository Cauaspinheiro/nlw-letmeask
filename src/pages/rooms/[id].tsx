import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FormEvent, useCallback, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import Button from '../../components/Button'
import QuestionTile from '../../components/QuestionTile'
import RoomCode from '../../components/RoomCode'
import LogoSvg from '../../components/svg/LogoSvg'
import questionStyles from '../../styles/components/question.module.scss'
import styles from '../../styles/pages/rooms/[id].module.scss'

import { useAuthContext } from '../../context/AuthContext'
import useRoom from '../../hooks/useRoom'
import { firebaseDatabase } from '../../services/firebase'

const RoomPage: React.FC = () => {
  const router = useRouter()

  const [newQuestion, setNewQuestion] = useState('')

  const { user } = useAuthContext()

  const { id: roomId } = router.query

  const { title, questions } = useRoom(roomId?.toString() || '')

  const handleCreateNewQuestion = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!newQuestion.trim()) return toast.error('Digite uma pergunta!')

      if (!user) return toast.error('Você precisa estar logado para perguntar!')

      const question = {
        content: newQuestion,
        author: user,
        isHighlighted: false,
        isAnswered: false,
      }

      await firebaseDatabase.ref(`rooms/${roomId}/questions`).push(question)

      setNewQuestion('')
      toast.success('Pergunta enviada!')
    },
    [newQuestion, roomId, user]
  )

  const handleLikeQuestion = async (questionId: string, likeId?: string) => {
    if (likeId) {
      return firebaseDatabase
        .ref(`rooms/${roomId}/questions/${questionId}/likes`)
        .remove()
    }

    return firebaseDatabase
      .ref(`rooms/${roomId}/questions/${questionId}/likes`)
      .push({ authorId: user?.id })
  }

  const buildFormFooter = () => {
    if (user) {
      return (
        <div className={styles.user_info}>
          <div className={styles.avatar}>
            <Image src={user.avatar} alt={user.name} width="44" height="44" />
          </div>

          <span>{user.name}</span>
        </div>
      )
    }

    return (
      <span>
        Para enviar uma pergunta, <button>faça seu login</button>
      </span>
    )
  }

  if (!title) {
    return (
      <div className={styles.loading}>
        <motion.div layoutId="room-logo">
          <LogoSvg />
        </motion.div>

        <h3>Carregando...</h3>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header>
        <div className={styles.content}>
          <motion.div className="logo" layoutId="room-logo">
            <LogoSvg />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <RoomCode code={roomId?.toString() || ''} />
          </motion.div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className={styles.room_title}>
          <h1>Sala {title}</h1>
          <span>{questions.length} perguntas</span>
        </div>

        <form onSubmit={handleCreateNewQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />

          <div className={styles.form_footer}>
            {buildFormFooter()}

            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        <div className={styles.question_list}>
          {questions.map((question) => {
            return (
              <QuestionTile
                content={question.content}
                author={question.author}
                key={question.id}
              >
                <button
                  type="button"
                  aria-label="Marcar como gostei"
                  className={`${questionStyles.like_button} ${
                    question.likeId ? questionStyles.liked : ''
                  }`}
                  onClick={() =>
                    handleLikeQuestion(question.id, question.likeId)
                  }
                >
                  {question.likeCount && <span>{question.likeCount}</span>}

                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </QuestionTile>
            )
          })}
        </div>
      </motion.main>

      <Toaster />
    </div>
  )
}

export default RoomPage
