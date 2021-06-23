import Image from 'next/image'
import React from 'react'
import toast from 'react-hot-toast'

import styles from '../styles/components/room_code.module.scss'

import copySvg from '../../public/images/copy.svg'

export interface RoomCodeProps {
  code: string
}

const RoomCode: React.FC<RoomCodeProps> = (props) => {
  const copyRoomCode = () => {
    toast.success('Copiado!')

    navigator.clipboard.writeText(props.code)
  }

  return (
    <button className={styles.container} onClick={copyRoomCode}>
      <div className={styles.copy}>
        <div>
          <Image src={copySvg} alt="Copy" />
        </div>
      </div>

      <span>Sala {props.code}</span>
    </button>
  )
}

export default RoomCode
