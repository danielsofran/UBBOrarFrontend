import {IonContent} from "@ionic/react"
import {useAppDispatch, useAppSelector} from "../store"
import {orarDataSelector} from "../reducers/orarData"
import {useEffect} from "react"
import {setCurrentTab} from "../reducers/navigation"
import {OrarZi} from "../components/OrarZi"
import {Ziua} from "../model/orar"
import {getOrarOre} from "../service/orarUtils"

export const Test: React.FC = () => {
  const dispatch = useAppDispatch()
  const orarData = useAppSelector(orarDataSelector)
  const ore = getOrarOre(orarData).filter(ora => ora.ziua === Ziua.VINERI && !ora.hidden)

  useEffect(() => {
    //@ts-ignore
    dispatch(setCurrentTab({title: 'Test'}))
  }, [])

  return (
    <IonContent>
      <div style={{marginRight: '10px'}}>
      <OrarZi ore={ore}/>
      </div>
    </IonContent>
  )
}