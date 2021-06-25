import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import toast, { Toaster } from 'react-hot-toast'

import Button from '../../../components/Button'
import QuestionsTile from '../../../components/QuestionTile'
import RoomCode from '../../../components/RoomCode'
import LogoSvg from '../../../components/svg/LogoSvg'
import styles from '../../../styles/pages/rooms/[id].module.scss'

import deleteSvg from '../../../../public/images/delete.svg'
import useRoom from '../../../hooks/useRoom'
import { firebaseDatabase } from '../../../services/firebase'

const AdminRoomPage: React.FC = () => {
  const router = useRouter()

  const { id: roomId } = router.query

  const { title, questions } = useRoom(roomId?.toString() || '')

  const handleEndRoom = async () => {
    await firebaseDatabase
      .ref(`rooms/${roomId}`)
      .update({ endedAt: new Date() })

    router.replace('/?ref=roomEnded', '/')
  }

  const handleDeleteQuestion = async (questionId: string) => {
    const confirmed = window.confirm(
      'Você tem certeza que deseja excluir essa pergunta?'
    )

    if (!confirmed) return

    await firebaseDatabase
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .remove()

    toast.success('Pergunta removida!')
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

            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
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

        <div className={styles.question_list}>
          {questions.map((question) => {
            return (
              <motion.div key={question.id} layoutId={question.id}>
                <QuestionsTile
                  content={question.content}
                  author={question.author}
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <Image alt="Deletar pergunta" src={deleteSvg} />
                  </button>
                </QuestionsTile>
              </motion.div>
            )
          })}
        </div>
      </motion.main>

      <Toaster />
    </div>
  )
}

export default AdminRoomPage
