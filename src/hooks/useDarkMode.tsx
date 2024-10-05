import { useState, useEffect } from 'react'

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkPalette = (shouldAdd: boolean) => {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd)
  }

  const initializeDarkPalette = (isDark: boolean) => {
    setIsDarkMode(isDark)
    toggleDarkPalette(isDark)
  }

  const toggleChange = () => {
    toggleDarkPalette(!isDarkMode)
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
    //initializeDarkPalette(prefersDark.matches)

    const setDarkPaletteFromMediaQuery = (mediaQuery: MediaQueryListEvent) => {
      initializeDarkPalette(mediaQuery.matches)
    }

    prefersDark.addEventListener('change', setDarkPaletteFromMediaQuery)

    return () => {
      prefersDark.removeEventListener('change', setDarkPaletteFromMediaQuery)
    }
  }, [])

  return { isDarkMode, toggleDarkMode: toggleChange }
}