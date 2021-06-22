import { AppComponent } from 'next/dist/next-server/lib/router/router'

import AuthContextProvider from '../context/AuthContext'

import '../styles/globals.scss'

const App: AppComponent = ({ Component, pageProps }) => {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  )
}

export default App
