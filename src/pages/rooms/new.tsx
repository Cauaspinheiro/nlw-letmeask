import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, FormEvent, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import Button from '../../components/Button'
import IllustrationSvg from '../../components/svg/IllustrationSvg'
import LogoSvg from '../../components/svg/LogoSvg'
import styles from '../../styles/pages/auth.module.scss'

import { useAuthContext } from '../../context/AuthContext'
import { firebaseDatabase } from '../../services/firebase'

const NewRoom: FC = () => {
  const [newRoom, setNewRoom] = useState('')
  const { user } = useAuthContext()

  const router = useRouter()

  const handleCreateRoom = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!newRoom.trim()) return toast.error('Digite o nome da sua sala!')

    const roomRef = firebaseDatabase.ref('rooms')

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    })

    router.push(`/rooms/${firebaseRoom.key}`)
  }

  const createRoomWithToast = (e: FormEvent<HTMLFormElement>) => {
    const promise = handleCreateRoom(e)

    toast.promise(promise, {
      loading: 'Carregando...',
      success: 'Sala Criada!',
      error: 'Algo deu errado!',
    })
  }

  return (
    <div className={styles.container}>
      <aside>
        <div className={styles.next_image}>
          <IllustrationSvg />
        </div>
        <strong>Crie sala de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>

      <main>
        <div className={styles.main_content}>
          <motion.div layoutId="initial-logo" className={styles.next_image}>
            <LogoSvg />
          </motion.div>

          <h2>Criar uma nova sala</h2>

          <motion.form layoutId="initial-form" onSubmit={createRoomWithToast}>
            <input
              type="text"
              placeholder="Nome da sala"
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
            />

            <Button type="submit">Criar sala</Button>
          </motion.form>

          <p>
            Quer entrar uma sala existente? <Link href="/">Clique Aqui</Link>
          </p>
        </div>
      </main>

      <Toaster />
    </div>
  )
}

export default NewRoom
