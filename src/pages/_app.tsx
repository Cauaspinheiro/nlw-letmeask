import { AnimateSharedLayout } from 'framer-motion'
import { AppComponent } from 'next/dist/next-server/lib/router/router'
import Head from 'next/head'

import { AuthContextProvider } from '../context/AuthContext'
import { ThemeContextProvider } from '../context/ThemeContext'

import '../styles/globals.scss'

const App: AppComponent = ({ Component, pageProps }) => {
  return (
    <AuthContextProvider>
      <AnimateSharedLayout>
        <ThemeContextProvider>
          <Head>
            <title>Let me ask</title>
          </Head>

          <Component {...pageProps} />
        </ThemeContextProvider>
      </AnimateSharedLayout>
    </AuthContextProvider>
  )
}

export default App
