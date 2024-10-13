import {Orar, OrarGrupa, Source} from "../model/orar"
import {useState} from "react"
import {IonButton, IonInput} from "@ionic/react"
import {fetchOrar} from "../service/scrapper"
import {ListaMaterii} from "./ListaMaterii"
import {addOrarSuplimentar, allOreHidden, equalsOra, getOrarSuplimetarIndex, setOrarSuplimentar} from "../service/orarUtils"

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

  const removeDuplicates = (orarGrupa: OrarGrupa) => {
    // check for every ora in orarSuplimentar if it exists in orar.mainOrar. If it does, remove it - curs is already in main orar
    // TODO: this does not work
    const newOrarGrupa = {...orarGrupa, ore: [...orarGrupa.ore]}
    for(let i = 0; i < newOrarGrupa.ore.length; i++) {
      if(props.orar.mainOrar.ore.find((mainOra) => equalsOra(mainOra, newOrarGrupa.ore[i]))) {
        newOrarGrupa.ore.splice(i, 1)
        console.log("Removed duplicated ora", newOrarGrupa.ore[i])
        i--; continue
      }
    }
    return newOrarGrupa
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
    console.log("Removing grupa", index)
    //debugger
    const newOrar = {...props.orar, orareSuplimentare: [...props.orar.orareSuplimentare]}
    newOrar.orareSuplimentare.splice(index, 1)
    props.setOrar(newOrar)
  }

  const setOrarExistent = (grupa: string) => (orar: OrarGrupa) => {
    const index = getOrarSuplimetarIndex(props.orar, grupa)
    const newOrar = setOrarSuplimentar(props.orar, orar, index)
    props.setOrar(newOrar)
  }

  const setAndValidateGrupa = (grupa: string) => {
    setGrupa(grupa)
    setOrarGrupa(undefined)
    // check if grupa exists in orar
    if(grupa.length < 2) {
      setError(defaultErrorText)
      return
    }
    const orarGrupa = props.orar.orareSuplimentare.find((orar) => orar.source.grupa === grupa)
    if(orarGrupa || props.orar.mainOrar.source.grupa === grupa) {
      setError('Grupa deja exista')
      return
    }
    // fetch orar
    const source = {...props.orar.mainOrar.source, grupa: grupa} as Source
    fetchOrar(source, true).then((parsedOrar) => {
      const orarGrupa = parsedOrar.orar
      setOrarGrupa(removeDuplicates(orarGrupa))
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