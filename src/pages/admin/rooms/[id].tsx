import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import toast, { Toaster } from 'react-hot-toast'

import Button from '../../../components/Button'
import QuestionsTile from '../../../components/QuestionTile'
import RoomCode from '../../../components/RoomCode'
import styles from '../../../styles/pages/rooms/[id].module.scss'

import deleteSvg from '../../../../public/images/delete.svg'
import logoSvg from '../../../../public/images/logo.svg'
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
        <Image src={logoSvg} alt="Let me ask" />

        <h1>Carregando</h1>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header>
        <div className={styles.content}>
          <div className="logo">
            <Image src={logoSvg} alt="Let me ask" />
          </div>

          <div>
            <RoomCode code={roomId?.toString() || ''} />

            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className={styles.room_title}>
          <h1>Sala {title}</h1>
          <span>{questions.length} perguntas</span>
        </div>

        <div className={styles.question_list}>
          {questions.map((question, index) => {
            return (
              <QuestionsTile
                content={question.content}
                author={question.author}
                key={index}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <Image alt="Deletar pergunta" src={deleteSvg} />
                </button>
              </QuestionsTile>
            )
          })}
        </div>
      </main>

      <Toaster />
    </div>
  )
}

export default AdminRoomPage
