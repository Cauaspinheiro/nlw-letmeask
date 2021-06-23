import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import Button from '../../components/Button'
import RoomCode from '../../components/RoomCode'
import styles from '../../styles/pages/rooms/[id].module.scss'

import logoSvg from '../../../public/images/logo.svg'
import { useAuthContext } from '../../context/AuthContext'
import Question from '../../entities/question'
import { firebaseDatabase } from '../../services/firebase'

type FirebaseQuestions = Record<string, Question>

const RoomPage: React.FC = () => {
  const router = useRouter()

  const [newQuestion, setNewQuestion] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState('')

  const { user } = useAuthContext()

  const { id: roomId } = router.query

  const setTextAndQuestions = (title: string, questions: Question[]) => {
    setTitle(title)
    setQuestions(questions)
  }

  useEffect(() => {
    const roomRef = firebaseDatabase.ref(`rooms/${roomId}`)

    roomRef.on('value', (db) => {
      if (!db.val()) return

      const room = db.val()

      const firebaseQuestions: FirebaseQuestions = room.questions || {}

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            ...value,
            id: key,
          }
        }
      )

      setTextAndQuestions(room.title, parsedQuestions)
    })
  }, [roomId])

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

          <RoomCode code={roomId?.toString() || ''} />
        </div>
      </header>

      <main>
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
      </main>

      <Toaster />
    </div>
  )
}

export default RoomPage
