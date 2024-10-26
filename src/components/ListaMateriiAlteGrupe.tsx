import {Orar, OrarGrupa, Source} from "../model/orar"
import {useState} from "react"
import {IonButton, IonInput} from "@ionic/react"
import {fetchOrar} from "../service/scrapper"
import {ListaMaterii} from "./ListaMaterii"
import {addOrarSuplimentar, allOreHidden, createSourceForGrupa, equalsOra, getOrarSuplimetarIndex, removeGrupaIndexFromOrar, removeOrarDuplicates, setOrarSuplimentar, validateGrupa} from "../service/orarUtils"

interface ListaMateriiAlteGrupeProps {
  orar: Orar
  setOrar: (Orar) => void
}

export const ListaMateriiAlteGrupe = (props: ListaMateriiAlteGrupeProps) => {
  const [grupa, setGrupa] = useState<string>('')
  const [orarGrupa, setOrarGrupa] = useState<OrarGrupa | undefined>(undefined)

  const defaultErrorText = "Grupa este incorecta"
  const [grupaTouched, setGrupaTouched] = useState<boolean>(false)
  const [valid, setValid] = useState<boolean>(false)
  const [errorText, setErrorText] = useState<string>(defaultErrorText)

  const setError = (text: string) => {
    setErrorText(text)
    setValid(text === '')
  }

  const addGrupa = () => {
    const newOrar = addOrarSuplimentar(props.orar, orarGrupa)
    props.setOrar(newOrar)
    setOrarGrupa(undefined)
    setGrupa('')
    setErrorText('')
    setValid(false)
  }

  const removeGrupa = (index: number) => {
    props.setOrar(removeGrupaIndexFromOrar(props.orar, index))
  }

  const setOrarExistent = (grupa: string) => (orar: OrarGrupa) => {
    const index = getOrarSuplimetarIndex(props.orar, grupa)
    const newOrar = setOrarSuplimentar(props.orar, orar, index)
    props.setOrar(newOrar)
  }

  const setAndValidateGrupa = (grupa: string) => {
    setGrupa(grupa)
    setOrarGrupa(undefined)
    try {validateGrupa(grupa, props.orar)}
    catch (error) {
      setError(error.message)
      return
    }
    // fetch orar
    const source = createSourceForGrupa(grupa, props.orar)
    fetchOrar(source, true).then((parsedOrar) => {
      const orarGrupa = parsedOrar.orar
      setOrarGrupa(removeOrarDuplicates(orarGrupa, props.orar))
      setError('')
    }).catch((error) => {
      setError(`Grupa ${grupa} nu exista`)
    })
  }

  return (
    <>
      {props.orar.orareSuplimentare.map((orarGrupa, index) => (
        <ListaMaterii
          key={orarGrupa.source.grupa}
          orar={orarGrupa}
          setOrar={setOrarExistent(orarGrupa.source.grupa)}
          grupa={orarGrupa.source.grupa}
          onRemove={() => removeGrupa(index)}
          style={{marginBottom: 10}}
          closed={true}
        />
      ))}
      <IonInput
        className={`${grupaTouched && 'ion-touched'} ${valid || grupa.length === 0 ? 'ion-valid' : 'ion-invalid'}`}
        label="Grupa"
        value={grupa}
        onIonInput={(e) => setAndValidateGrupa(e.detail.value || "")}
        onIonBlur={() => setGrupaTouched(true)}
        errorText={errorText}
      >
        <IonButton
          disabled={!valid}
          slot="end" color="success"
          onClick={addGrupa}
        >Adaugă grupa</IonButton>
      </IonInput>
      {orarGrupa && <ListaMaterii orar={orarGrupa} setOrar={(orar) => {
        setOrarGrupa(orar)
      }}/>}
    </>
  )
}