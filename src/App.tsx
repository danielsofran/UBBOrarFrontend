import {
  IonApp, IonButtons, IonContent,
  IonHeader,
  IonMenu, IonMenuButton, IonPage,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar,
  setupIonicReact
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Route } from 'react-router-dom'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css' */
import '@ionic/react/css/palettes/dark.class.css'
// import '@ionic/react/css/palettes/dark.system.css'

/* Theme variables */
import './theme.css'

import {Layout} from "./Layout"
import {Test} from "./pages/Test"
import {OrarSettings} from "./pages/OrarSettings"
import {useAppDispatch, useAppSelector} from "./store"
import {orarDataSelector, setOrarData} from "./reducers/orarData"
import {useEffect} from "react"
import {getOrarDataFromStorage} from "./storage/orarData"
import {Preferences} from "./pages/Preferences"
import {useDarkMode} from "./hooks/useDarkMode"
import {setPreferences} from "./reducers/preferences"
import {getPreferencesFromStorage} from "./storage/preferences"

setupIonicReact();

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const {isDarkMode, toggleDarkMode} = useDarkMode()

  useEffect(() => {
    getPreferencesFromStorage().then((preferences) => {
      if(preferences.darkMode !== isDarkMode)
        toggleDarkMode()
      // @ts-ignore
      dispatch(setPreferences(preferences))
    }).catch((err) => {
      console.error("Error fetching preferences", err)
      // @ts-ignore
      dispatch(setPreferences({darkMode: isDarkMode}))
    })
    // load orar data from storage
    getOrarDataFromStorage().then((orarData) => {
      // @ts-ignore
      dispatch(setOrarData(orarData))
    }).catch((err) => {
      console.error("Error fetching orar data", err)
    })
  }, [])

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Layout>
            <Route exact path="/" component={Test} />
            <Route exact path="/orar-settings" component={OrarSettings} />
            <Route exact path="/preferences" component={Preferences} />
            <Route exact path="/test" component={Test} />
          </Layout>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
