import { useEffect, useState } from 'react'

import { useAuthContext } from '../context/AuthContext'
import Question from '../entities/question'
import { firebaseDatabase } from '../services/firebase'

export interface Room {
  title: string
  questions: Question[]
}

type FirebaseQuestions = Record<string, Question>

export default function useRoom(id: string): Room {
  const { user } = useAuthContext()

  const [title, setTitle] = useState('')

  const [questions, setQuestions] = useState<Question[]>([])

  const setTextAndQuestions = (title: string, questions: Question[]) => {
    setTitle(title)
    setQuestions(questions)
  }

  useEffect(() => {
    const roomRef = firebaseDatabase.ref(`rooms/${id}`)

    roomRef.on('value', (db) => {
      if (!db.val()) return

      const room = db.val()

      const firebaseQuestions: FirebaseQuestions = room.questions || {}

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            ...value,
            id: key,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([, like]) => like.authorId === user?.id
            )?.[0],
          }
        }
      )

      setTextAndQuestions(room.title, parsedQuestions)
    })

    return () => roomRef.off('value')
  }, [id, user?.id])

  return { title, questions }
}
