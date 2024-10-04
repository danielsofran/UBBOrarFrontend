import {useState} from "react"
import {setOrarData as setOrarDataRedux, orarDataSelector} from "../reducers/orarData"
import {useAppDispatch, useAppSelector} from "../store"
import {
  IonButton,
  IonCheckbox,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSelect,
  IonSelectOption
} from "@ionic/react"
import {fetchOrar} from "../service/scrapper"
import {Orar, Source} from "../model/orar"

interface OrarDataForm {
  source: Source
  orar?: Orar
  semigrupa?: string
}

enum MaterieHiddenState {
  CHECKED,
  UNCHECKED,
  INDETERMINATE
}

export const OrarSettings = () => {
  const dispatch = useAppDispatch()
  const [orarData, setOrarData] = useState<OrarDataForm>(useAppSelector(orarDataSelector))

  const [fieldTouched, setFieldTouched] = useState<string | null>(null)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<string[]>([])

  const getMaterieCheckedState = (materie: string) => {
    const ore = orarData.orar!.ore.filter((ora) => ora.numeMaterie === materie)
    const isCheck = ore.every((ora) => !ora.hidden)
    const isUncheck = ore.every((ora) => ora.hidden)
    return isCheck ? MaterieHiddenState.CHECKED : isUncheck ? MaterieHiddenState.UNCHECKED : MaterieHiddenState.INDETERMINATE
  }

  const getCssFor = (field: string) =>
    `${fieldTouched === field && 'ion-touched'} ${fieldErrors.includes(field) && 'ion-invalid'} ${!fieldErrors.includes(field) && 'ion-valid'}`

  const setAn = (an: string) => {
    orarData.source.an = an
    setOrarData(orarData)
    if(!an.match(/^\d{4}$/)) {
      setFieldErrors([...fieldErrors, 'an'])
      return
    }
    else {
      setFieldErrors(fieldErrors.filter((error) => error !== 'an'))
    }
  }

  const setGrupa = (grupa: string) => {
    orarData.source.grupa = grupa
    setOrarData(orarData)
    if(grupa.length < 2) {
      setFieldErrors([...fieldErrors, 'grupa'])
      return
    }
    else {
      setFieldErrors(fieldErrors.filter((error) => error !== 'grupa'))
    }
  }

  const setMaterieHidden = (materie: string, hidden: boolean) => {
    // toate orele de la aceasta materie
    const ore = orarData.orar!.ore.filter((ora) => ora.numeMaterie === materie)
    ore.forEach((ora) => ora.hidden = hidden)
    orarData.orar!.ore = [...orarData.orar!.ore.filter((ora) => ora.numeMaterie !== materie), ...ore]
    setOrarData(orarData)
  }

  const refreshOrar = () => {
    const an = orarData.source.an!
    const semestru = orarData.source.semestru!
    const grupa = orarData.source.grupa!
    fetchOrar(an, semestru, grupa).then((orar) => {
      setOrarData({...orarData, orar})
      // @ts-ignore
      dispatch(setOrarDataRedux(orarData))
    }).catch((err) => {
      setErrorText(`Nu s-a putut obtine orarul. Am căutat un orar pentru anul ${an}, semestrul ${semestru} și grupa ${grupa}. Eroare este: ${err}`)
    })
  }

  const refreshAvailable = orarData.source.an && orarData.source.semestru && orarData.source.grupa && fieldErrors.length === 0

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: orarData.orar ? 'space-between' : 'center', marginBottom: 8}}>
        {orarData.orar && <IonLabel>Last updated: {orarData.orar.lastUpdateText}</IonLabel>}
        <IonButton disabled={!refreshAvailable} onClick={refreshOrar}>{orarData.orar ? 'Refresh' : 'Get'} orar</IonButton>
      </div>
      <IonLabel color="danger">{errorText}</IonLabel>

      <IonInput
        className={getCssFor('an')}
        label="An"
        labelPlacement="floating"
        value={orarData.source.an}
        onIonInput={(e) => setAn(e.detail.value)}
        onIonBlur={() => setFieldTouched('an')}
        errorText="Anul este incorect"
      />
      <IonSelect
        label="Semestru"
        labelPlacement="floating"
        value={orarData.source.semestru}
        onIonInput={(e) => { orarData.source.semestru = e.detail.value; setOrarData(orarData) }}
      >
        <IonSelectOption value="1">1</IonSelectOption>
        <IonSelectOption value="2">2</IonSelectOption>
      </IonSelect>
      <IonInput
        className={getCssFor('grupa')}
        label="Grupa"
        labelPlacement="floating"
        value={orarData.source.grupa}
        onIonInput={(e) => setGrupa(e.detail.value)}
        onIonBlur={() => setFieldTouched('grupa')}
        errorText="Grupa este incorecta"
      />
      {orarData.orar &&
        <> {/* setari suplimentare dupa ce orarul este obtinut */}
          <h3 style={{marginTop: "1em"}}>Setari suplimentare</h3>
          <IonSelect
            label="Semigrupa"
            labelPlacement="floating"
            value={orarData.semigrupa}
            onIonInput={(e) => setOrarData({...orarData, semigrupa: e.detail.value})}
          >
            <IonSelectOption value="12">Ambele</IonSelectOption>
            <IonSelectOption value="1">1</IonSelectOption>
            <IonSelectOption value="2">2</IonSelectOption>
          </IonSelect>
          <IonList>
            <IonListHeader>Lista matrerii</IonListHeader>
            {orarData.orar.materii.map((materie, index) => (
              <IonItem key={index}>
                <IonCheckbox
                  slot="start"
                  checked={getMaterieCheckedState(materie) === MaterieHiddenState.CHECKED}
                  indeterminate={getMaterieCheckedState(materie) === MaterieHiddenState.INDETERMINATE}
                  onIonChange={(e) => setMaterieHidden(materie, e.detail.checked)}
                />
                <IonLabel>{materie}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        </>
      }
    </>
  )
}