import {Ora, Orar} from "../model/orar"
import {IonAccordion, IonAccordionGroup, IonCheckbox, IonItem, IonLabel, IonList} from "@ionic/react"
import {
  getMaterieCheckedState,
  getMaterii,
  getSaptamanaFormat,
  getTimeFormat,
  MaterieHiddenState
} from "../service/orarUtils"
import {useState} from "react"

interface ListaMateriiProps {
  orar: Orar
  setOrar: (orar: Orar) => void
  grupa?: string
}

export const ListaMaterii: React.FC<ListaMateriiProps> = ({orar, setOrar, grupa}) => {
  const materii = getMaterii(orar)

  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)

  const setMaterieHidden = (materie: string, hidden: boolean) => {
    // toate orele de la aceasta materie
    const ore = orar.ore.filter((ora) => ora.numeMaterie === materie).map((ora) => ({...ora, hidden: !hidden}))
    const newOrar = {...orar, ore: [...orar.ore.filter((ora) => ora.numeMaterie !== materie), ...ore]}
    setOrar(newOrar)
  }

  const setOraHidden = (ora: Ora, hidden: boolean) => {
    const newOrar = {...orar, ore: orar.ore.map((o) => o === ora ? {...o, hidden: !hidden} : o)}
    setOrar(newOrar)
  }

  const onChildAccordionChange = (materie: string) => (e) => {
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
    <IonAccordionGroup value="list">
      <IonAccordion value="list">
        <IonItem slot="header">
          <IonLabel>Lista materii: {grupa}</IonLabel>
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
                        <IonLabel>{ora.tip} {getTimeFormat(ora)} {getSaptamanaFormat(ora)} {ora.formatie}</IonLabel>
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