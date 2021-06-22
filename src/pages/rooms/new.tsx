import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

import Button from '../../components/Button'
import styles from '../../styles/pages/auth.module.scss'

const NewRoom: FC = () => {
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

          <h2>Criar uma nova sala</h2>

          <form>
            <input type="text" placeholder="Nome da sala" />
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
