import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonList, IonMenu, IonMenuButton, IonMenuToggle, IonPage, IonTitle, IonToolbar} from "@ionic/react"
import {arrowForward, warning} from "ionicons/icons"
import {useAppSelector} from "./store"
import {navigationSelector} from "./reducers/navigation"
import {orarDataSelector} from "./reducers/orarData"
import {orarExists} from "./service/orarUtils"

const MenuEntry = ({title, path, menu = 'left-menu'}: {title: string, path: string, menu?: string}) => (
  <IonMenuToggle autoHide={false} menu={menu}>
    <IonItem button routerLink={path}>{title}</IonItem>
  </IonMenuToggle>
)

export const Layout: React.FC = ({children}) => {
  const navigationState = useAppSelector(navigationSelector)
  const orarData = useAppSelector(orarDataSelector)

  return (
    <>
      <IonMenu menuId="left-menu" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Orar UBB</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <MenuEntry title="Test" path="/test" />
            <MenuEntry title="Configurează Orar" path="/orar-settings" />
            <MenuEntry title="Preferințe" path="/preferences" />
          </IonList>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>{navigationState.title}</IonTitle>
            <IonButtons slot="end">
              {orarExists(orarData) && navigationState.showSOSButton &&
                <IonButton color="danger" fill="solid" shape="round">
                  <IonIcon slot="start" icon={warning} />
                  SOS
                </IonButton>
              }
              {navigationState.filterMenu !== undefined &&
                <IonButton>
                  <IonIcon slot="end" icon={arrowForward} />
                  Filtre
                </IonButton>
              }
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        {children}
      </IonPage>
    </>
  )
}