import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import User from '../entities/user'
import { firebaseApp, firebaseAuth } from '../services/firebase'

interface State {
  user: User | undefined
}

interface Actions {
  signInWithGoogle(): Promise<void>
}

type AuthContext = Actions & State

const Context = createContext<AuthContext | null>(null)

export function useAuthContext(): AuthContext {
  const value = useContext<AuthContext | null>(Context)

  if (value === null) {
    throw new Error('CONTEXT NOT PROVIDED')
  }

  return value || ({} as AuthContext)
}

const AuthContextProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    return firebaseAuth.onAuthStateChanged((user) => {
      if (!user) {
        return
        //throw new Error('MISSING USER FROM GOOGLE')
      }

      if (!user.displayName || !user.photoURL) {
        return
        // throw new Error('MISSING USER INFO FROM GOOGLE ACCOUNT')
      }

      setUser({ id: user.uid, name: user.displayName, avatar: user.photoURL })
    })
  }, [])

  const signInWithGoogle = useCallback(async () => {
    const provider = new firebaseApp.auth.GoogleAuthProvider()

    const { user } = await firebaseAuth.signInWithPopup(provider)

    if (!user) throw new Error('MISSING USER FROM GOOGLE')

    if (!user.displayName || !user.photoURL) {
      throw new Error('MISSING USER INFO FROM GOOGLE ACCOUNT')
    }

    setUser({ id: user.uid, name: user.displayName, avatar: user.photoURL })
  }, [])

  return (
    <Context.Provider value={{ signInWithGoogle, user }}>
      {children}
    </Context.Provider>
  )
}

export default AuthContextProvider
