import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader, IonIcon, IonItem, IonList, IonListHeader,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react"
import {sunny, moon} from "ionicons/icons"
import {useDarkMode} from "./hooks/useDarkMode"

export const Layout: React.FC = ({children}) => {
  const {isDarkMode, toggleDarkMode} = useDarkMode()

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Orar UBB</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem button routerLink="/test">Test</IonItem>
            <IonItem button routerLink="/orar-settings">Setari</IonItem>
          </IonList>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Orar UBB</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={toggleDarkMode}>
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