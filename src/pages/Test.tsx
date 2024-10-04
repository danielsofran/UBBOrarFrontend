import {IonContent} from "@ionic/react"
import {useEffect, useState} from "react"
import {Orar} from "../model/orar"
import {fetchOrar} from "../service/scrapper"
import {useAppDispatch, useAppSelector} from "../store"
import {setOrarData, orarDataSelector} from "../reducers/orarData"

export const Test: React.FC = () => {
  const dispatch = useAppDispatch()
  const orarData = useAppSelector(orarDataSelector)

  useEffect(() => {
    const an = 2024
    const semestru = 1
    const grupa = "248-1"
    fetchOrar(an, semestru, grupa).then((orar) => {
      // @ts-ignore
      dispatch(setOrarData({an, semestru, grupa, orar}))
    }).catch((err) => {
      console.error("Error fetching orar", err)
    })
  }, [])

  return (
    <IonContent>
      <h1>Test</h1>
      <pre>{JSON.stringify(orarData.orar, null, 2)}</pre>
    </IonContent>
  )
}