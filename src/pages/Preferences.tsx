import {useAppDispatch, useAppSelector} from "../store"
import {preferencesSelector} from "../reducers/preferences"
import {useEffect, useState} from "react"
import {setCurrentTab} from "../reducers/navigation"
import {IonContent, IonItem, IonList, IonListHeader, IonToggle} from "@ionic/react"
import {useDarkMode} from "../hooks/useDarkMode"
import {savePreferencesToStorage} from "../storage/preferences"

export const Preferences = () => {
  const dispatch = useAppDispatch()
  const initialPreferences = useAppSelector(preferencesSelector)
  const [preferences, setPreferences] = useState(initialPreferences)
  const {isDarkMode, toggleDarkMode} = useDarkMode()

  useEffect(() => {
    setPreferences(initialPreferences)
  }, [initialPreferences])

  useEffect(() => {
    //@ts-ignore
    dispatch(setCurrentTab({title: 'Preferințe'}))
  }, [])

  const setDarkMode = (darkMode: boolean) => {
    if(darkMode !== isDarkMode) {
      toggleDarkMode()
    }
    setPreferences({...preferences, darkMode})
    savePreferencesToStorage({...preferences, darkMode})
      .then(r => console.log("Saved preferences"))
  }

  return (
    <IonContent className="ion-padding">
      <IonListHeader style={{ fontSize: '1.2em' }}> Aspect </IonListHeader>
      <IonList inset>
        <IonItem>
          <IonToggle
            checked={preferences.darkMode}
            onIonChange={(e) => setDarkMode(e.detail.checked)}
            justify="space-between"
          >
            Dark Mode
          </IonToggle>
        </IonItem>
      </IonList>
    </IonContent>
  )
}