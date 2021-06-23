import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, FormEvent, useState } from 'react'

import Button from '../../components/Button'
import styles from '../../styles/pages/auth.module.scss'

import { useAuthContext } from '../../context/AuthContext'
import illustrationSvg from '../../public/images/illustration.svg'
import logoSvg from '../../public/images/logo.svg'
import { firebaseDatabase } from '../../services/firebase'

const NewRoom: FC = () => {
  const [newRoom, setNewRoom] = useState('')
  const { user } = useAuthContext()

  const router = useRouter()
  const handleCreateRoom = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!newRoom.trim()) return

    const roomRef = firebaseDatabase.ref('rooms')

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    })

    router.push(`/rooms/${firebaseRoom.key}`)
  }

  return (
    <div className={styles.container}>
      <aside>
        <div className={styles.next_image}>
          <Image src={illustrationSvg} alt="Let me Ask" />
        </div>
        <strong>Crie sala de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>

      <main>
        <div className={styles.main_content}>
          <div className={styles.next_image}>
            <Image src={logoSvg} alt="Let me Ask" />
          </div>

          <h2>Criar uma nova sala</h2>

          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
            />

            <Button type="submit">Criar sala</Button>
          </form>

          <p>
            Quer entrar uma sala existente? <Link href="/">Clique Aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default NewRoom
