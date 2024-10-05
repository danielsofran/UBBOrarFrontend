import {IonContent} from "@ionic/react"
import {useAppDispatch, useAppSelector} from "../store"
import {orarDataSelector} from "../reducers/orarData"
import {useEffect} from "react"
import {setCurrentTab} from "../reducers/navigation"
import {OrarZi} from "../components/OrarZi"
import {Ziua} from "../model/orar"

export const Test: React.FC = () => {
  const dispatch = useAppDispatch()
  const orarData = useAppSelector(orarDataSelector)

  useEffect(() => {
    //@ts-ignore
    dispatch(setCurrentTab({title: 'Test'}))
  }, [])

  return (
    <IonContent className="ion-padding">
      <h1>Test</h1>
      <OrarZi orar={orarData} zi={Ziua.VINERI}/>
    </IonContent>
  )
}