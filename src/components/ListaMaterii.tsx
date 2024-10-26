import {Ora, OrarGrupa} from "../model/orar"
import {IonAccordion, IonAccordionGroup, IonButton, IonCheckbox, IonItem, IonLabel, IonList} from "@ionic/react"
import {getMaterieCheckedState, getMaterii, setMaterieHidden as setMaterieHiddenModel, setOraHidden as setOraHiddenModel, MaterieHiddenState} from "../service/orarUtils"
import {useEffect, useRef, useState} from "react"
import {getSaptamanaFormat, getTimeFormat} from "../service/utils"

interface ListaMateriiProps {
  orar: OrarGrupa
  setOrar: (orar: OrarGrupa) => void
  grupa?: string
  onRemove?: () => void
  style?: any
  closed?: boolean
}

export const ListaMaterii: React.FC<ListaMateriiProps> = ({orar, setOrar, grupa, onRemove, style, closed}) => {
  const materii = getMaterii(orar)

  const parentAccordion = useRef<any>()
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)

  useEffect(() => {
    // close all accordions when the component is mounted
    if(!parentAccordion.current)
      return
    if(!closed) parentAccordion.current.value = 'list'
    else parentAccordion.current.value = null
  }, [])

  const setMaterieHidden = (materie: string, checked: boolean) => {
    const newOrar = setMaterieHiddenModel(orar, materie, !checked)
    setOrar(newOrar)
  }

  const setOraHidden = (ora: Ora, checked: boolean) => {
    const newOrar = setOraHiddenModel(orar, ora, !checked)
    setOrar(newOrar)
  }

  const onParentAccordionChange = (e: any) => {
    // get if the accordion is open or closed
    const value = e.detail.value
    if(value === null)
      setActiveAccordion(null)
  }

  const onChildAccordionChange = (materie: string) => (e: any) => {
    // get if the accordion is open or closed
    const value = e.detail.value
    if(['on', 'off'].includes(value)) {
      return
    }
    // set the materie to open or closed
    setActiveAccordion(value === materie ? materie : null)
  }

  const getAccordionValue = (materie: string) => {
    return activeAccordion === materie ? materie : null
  }

  return (
    <IonAccordionGroup ref={parentAccordion} onIonChange={onParentAccordionChange} style={style}>
      <IonAccordion value="list">
        <IonItem slot="header">
          <IonLabel>Lista materii: {grupa}</IonLabel>
          {onRemove && <IonButton style={{marginRight: 10}} color="danger" slot="end" onClick={onRemove}>Șterge</IonButton>}
        </IonItem>
        <IonList slot="content">
          {materii.map((materie, index) => (
            <IonItem key={index}>
              <IonCheckbox
                slot="start"
                className="ion-padding-vertical"
                style={{ alignSelf: "flex-start" }}
                checked={getMaterieCheckedState(orar, materie) === MaterieHiddenState.CHECKED}
                indeterminate={getMaterieCheckedState(orar, materie) === MaterieHiddenState.INDETERMINATE}
                onIonChange={(e) => setMaterieHidden(materie, e.detail.checked)}
              />
              <IonAccordionGroup
                value={getAccordionValue(materie)}
                onIonChange={onChildAccordionChange(materie)}
                style={{ flex: 1, width: "100%" }}
              >
                <IonAccordion value={materie}>
                  <IonItem slot="header">
                    <IonLabel>{materie}</IonLabel>
                  </IonItem>
                  <IonList slot="content">
                    {orar.ore.filter((ora) => ora.numeMaterie === materie).map((ora, index) => (
                      <IonItem key={index}>
                        <IonCheckbox
                          slot="start"
                          checked={!ora.hidden}
                          onIonChange={(e) => setOraHidden(ora, e.detail.checked)}
                        />
                        <IonLabel>{ora.tip} {ora.ziua} {getTimeFormat(ora)} {getSaptamanaFormat(ora)} {ora.formatie}</IonLabel>
                      </IonItem>
                    ))}
                  </IonList>
                </IonAccordion>
              </IonAccordionGroup>
            </IonItem>
          ))}
        </IonList>
      </IonAccordion>
    </IonAccordionGroup>
  )
}