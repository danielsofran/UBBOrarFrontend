import {IonContent} from "@ionic/react"
import {useAppDispatch, useAppSelector} from "../store"
import {orarDataSelector} from "../reducers/orarData"
import {useEffect} from "react"
import {setCurrentTab} from "../reducers/navigation"

export const Test: React.FC = () => {
  const dispatch = useAppDispatch()
  const orarData = useAppSelector(orarDataSelector)

  useEffect(() => {
    //@ts-ignore
    dispatch(setCurrentTab({title: 'Test'}))
  }, [])

  return (
    <IonContent>
      <h1>Test</h1>
      <pre>{JSON.stringify(orarData, null, 2)}</pre>
    </IonContent>
  )
}