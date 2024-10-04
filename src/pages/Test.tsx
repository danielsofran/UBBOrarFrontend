import {IonContent} from "@ionic/react"
import {useEffect, useState} from "react"
import {Orar} from "../model/orar"
import {fetchOrar} from "../service/scrapper"

export const Test: React.FC = () => {
  const [orar, setOrar] = useState<Orar>(new Orar())

  useEffect(() => {
    const an = 2024
    const semestru = 1
    const grupa = "248-1"
    fetchOrar(an, semestru, grupa).then((orar) => {
      setOrar(orar)
    })
  }, [])

  return (
    <IonContent>
      <h1>Test</h1>
      <pre>{JSON.stringify(orar, null, 2)}</pre>
    </IonContent>
  )
}