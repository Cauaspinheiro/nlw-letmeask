import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FC, FormEvent, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import Button from '../components/Button'
import IllustrationSvg from '../components/svg/IllustrationSvg'
import LogoSvg from '../components/svg/LogoSvg'
import styles from '../styles/pages/auth.module.scss'

import googleIconSvg from '../../public/images/google-icon.svg'
import { useAuthContext } from '../context/AuthContext'
import { firebaseDatabase } from '../services/firebase'

const Home: FC = () => {
  const router = useRouter()

  const { signInWithGoogle, user } = useAuthContext()

  const [roomKey, setRoomKey] = useState('')

  const handleCreateRoom = async () => {
    if (!user) {
      await signInWithGoogle()
    }

    router.push('/rooms/new')
  }

  const handleJoinRoom = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!roomKey.trim()) {
      toast.dismiss()
      return toast.error('Digite uma sala')
    }

    const roomRef = await firebaseDatabase.ref(`rooms/${roomKey}`).get()

    if (!roomRef.exists()) {
      toast.dismiss()
      return toast.error('Essa sala não existe')
    }

    if (roomRef.val().endedAt) return toast.error('Essa sala foi encerrada!')

    router.push(`/rooms/${roomKey}`)
  }

  if (router.query.ref === 'roomEnded') toast.success('Sala encerrada!')

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

          <button onClick={handleCreateRoom} className={styles.create_room}>
            <div className={styles.next_image}>
              <Image src={googleIconSvg} alt="Google Logo" />
            </div>
            Crie sua sala com o Google
          </button>

          <div className={styles.separator}>Ou entre em uma sala</div>

          <motion.form layoutId="initial-form" onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomKey}
              onChange={(e) => setRoomKey(e.target.value)}
            />
            <Button type="submit">Entrar na sala</Button>
          </motion.form>
        </div>
      </main>

      <Toaster />
    </div>
  )
}

export default Home
