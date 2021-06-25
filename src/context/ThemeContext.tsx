import { createContext, FC, useContext, useEffect, useState } from 'react'

import { Themes } from '../utils/themes'

interface State {
  theme: Themes
}

type ThemeContext = State

const Context = createContext<ThemeContext | null>(null)

export function useThemeContext(): ThemeContext {
  const value = useContext<ThemeContext | null>(Context)

  if (value === null) {
    throw new Error('CONTEXT NOT PROVIDED')
  }

  return value || ({} as ThemeContext)
}

const colorSchemes = {
  DARK: '(prefers-color-scheme: dark)',
  LIGHT: '(prefers-color-scheme: light)',
}

export const ThemeContextProvider: FC = ({ children }) => {
  const [theme, setTheme] = useState<Themes>(Themes.DARK)

  useEffect(() => {
    if (!window.matchMedia) return

    const a = window.matchMedia(colorSchemes.DARK)

    if (a.matches) return setTheme(Themes.DARK)

    setTheme(Themes.LIGHT)
  }, [])

  return <Context.Provider value={{ theme }}>{children}</Context.Provider>
}
