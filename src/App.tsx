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
import {Redirect, Route} from "react-router-dom"

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
import {initialPreferences, setPreferences} from "./reducers/preferences"
import {getPreferencesFromStorage} from "./storage/preferences"
import {getFilterDataFromStorage} from "./storage/filterData"
import {setFilterData} from "./reducers/filter"
import {updateData} from "./model/filter"
import {OrarDayView} from "./pages/OrarDayView"

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
      dispatch(setPreferences(initialPreferences))
    })

    // load filter data from storage
    getFilterDataFromStorage().then((filterData) => {
      const updated = updateData(filterData)
      // @ts-ignore
      dispatch(setFilterData(updated))
    }).catch((err) => {
      console.error("Error fetching filter data", err)
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
            <Route exact path={basePath} render={() => <Redirect to={basePath + "orar"} />} />
            <Route exact path={basePath +"orar"} component={OrarDayView} />
            <Route exact path={basePath +"orar-settings"} component={OrarSettings} />
            <Route exact path={basePath +"preferences"} component={Preferences} />
            <Route exact path={basePath +"test"} component={Test} />

            {/* Catch-all route to redirect to home */}
            <Route path="*" render={() => <Redirect to={basePath + "orar"} />} />
          </Layout>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
export const basePath = import.meta.env.BASE_URL
