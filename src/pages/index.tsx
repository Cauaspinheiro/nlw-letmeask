import Image from 'next/image'
import { useRouter } from 'next/router'
import { FC, useCallback } from 'react'

import Button from '../components/Button'
import styles from '../styles/pages/auth.module.scss'

import { firebaseApp, firebaseAuth } from '../services/firebase'

const Home: FC = () => {
  const router = useRouter()

  const handleCreateRoom = useCallback(async () => {
    const provider = new firebaseApp.auth.GoogleAuthProvider()

    await firebaseAuth.signInWithPopup(provider)

    router.push('/rooms/new')
  }, [router])


  return (
    <div className={styles.container}>
      <aside>
        <div className={styles.next_image}>
          <Image
            src="/images/illustration.svg"
            width={313}
            height={400}
            alt="Let me Ask"
          />
        </div>
        <strong>Crie sala de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>

      <main>
        <div className={styles.main_content}>
          <div className={styles.next_image}>
            <Image
              src="/images/logo.svg"
              alt="Let me Ask"
              width="157"
              height="75"
            />
          </div>

          <button onClick={handleCreateRoom} className={styles.create_room}>
            <div className={styles.next_image}>
              <Image
                src="/images/google-icon.svg"
                width={24}
                height={24}
                alt="Google Logo"
              />
            </div>
            Crie sua sala com o Google
          </button>

          <div className={styles.separator}>Ou entre em uma sala</div>

          <form>
            <input type="text" placeholder="Digite o código da sala" />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Home
