import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader, IonIcon,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar, ToggleCustomEvent
} from "@ionic/react"
import {sunny, moon} from "ionicons/icons"
import {useEffect, useState} from "react"

export const Layout: React.FC = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Listen for the toggle check/uncheck to toggle the dark palette
  const toggleChange = (ev) => {
    console.log("state", isDarkMode)
    toggleDarkPalette(!isDarkMode)
    setIsDarkMode(!isDarkMode)
  }

  // Add or remove the "ion-palette-dark" class on the html element
  const toggleDarkPalette = (shouldAdd: boolean) => {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd)
  }

  // Check/uncheck the toggle and update the palette based on isDark
  const initializeDarkPalette = (isDark: boolean) => {
    setIsDarkMode(isDark)
    toggleDarkPalette(isDark)
  }

  useEffect(() => {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

    // Initialize the dark palette based on the initial
    // value of the prefers-color-scheme media query
    initializeDarkPalette(prefersDark.matches)

    const setDarkPaletteFromMediaQuery = (mediaQuery: MediaQueryListEvent) => {
      initializeDarkPalette(mediaQuery.matches)
    }

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', setDarkPaletteFromMediaQuery)

    return () => {
      prefersDark.removeEventListener('change', setDarkPaletteFromMediaQuery)
    }
  }, [])

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Setari</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">This is the menu content.</IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Orar UBB</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={toggleChange}>
                {/*move to preferences*/}
                <IonIcon slot="icon-only" icon={!isDarkMode ? sunny : moon} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        {children}
      </IonPage>
    </>
  )
}