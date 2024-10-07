import {useAppDispatch, useAppSelector} from "../store"
import {preferencesSelector, setPreferences} from "../reducers/preferences"
import {useEffect, useState} from "react"
import {setCurrentTab} from "../reducers/navigation"
import {IonContent, IonItem, IonList, IonListHeader, IonToggle} from "@ionic/react"
import {useDarkMode} from "../hooks/useDarkMode"
import {savePreferencesToStorage} from "../storage/preferences"
import {ColorPicker} from "../components/core/ColorPicker";

export const Preferences = () => {
  const dispatch = useAppDispatch()
  const preferences = useAppSelector(preferencesSelector)
  const {isDarkMode, toggleDarkMode} = useDarkMode()

  useEffect(() => {
    //@ts-ignore
    dispatch(setCurrentTab({title: 'Preferințe'}))
  }, [])

  const setDarkMode = (darkMode: boolean) => {
    if(darkMode !== isDarkMode) {
      toggleDarkMode()
    }
    savePreferencesToStorage({...preferences, darkMode})
      .then(r => console.log("Saved preferences"))
  }

  const setPreference = (key: string, value: any) => {
    const newPreferences = {...preferences, [key]: value}
    // @ts-ignore
    dispatch(setPreferences(newPreferences))
    savePreferencesToStorage(newPreferences)
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
        <ColorPicker
          label="Culoare Curs"
          color={preferences.colorCurs}
          onChange={(color) => setPreference('colorCurs', color)}
        />
        <ColorPicker
          label="Culoare Seminar"
          color={preferences.colorSeminar}
          onChange={(color) => setPreference('colorSeminar', color)}
        />
        <ColorPicker
          label="Culoare Laborator"
          color={preferences.colorLaborator}
          onChange={(color) => setPreference('colorLaborator', color)}
        />
      </IonList>
    </IonContent>
  )
}