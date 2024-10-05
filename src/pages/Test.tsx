import {IonContent} from "@ionic/react"
import { useAppSelector} from "../store"
import {orarDataSelector} from "../reducers/orarData"

export const Test: React.FC = () => {
  const orarData = useAppSelector(orarDataSelector)

  return (
    <IonContent>
      <h1>Test</h1>
      <pre>{JSON.stringify(orarData.orar, null, 2)}</pre>
    </IonContent>
  )
}