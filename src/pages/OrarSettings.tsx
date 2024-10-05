import {useEffect, useState} from "react"
import {setOrarData as setOrarDataRedux, orarDataSelector} from "../reducers/orarData"
import {useAppDispatch, useAppSelector} from "../store"
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonCheckbox, IonContent, IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSelect,
  IonSelectOption
} from "@ionic/react"
import {refresh, save} from "ionicons/icons"
import {fetchOrar} from "../service/scrapper"
import {OrarData} from "../model/storage"
import {saveOrarDataToStorage} from "../storage/orarData"
import {getLastUpdateText, getMaterii} from "../service/orarUtils"
import {ListaMaterii} from "../components/ListaMaterii"

export const OrarSettings = () => {
  const dispatch = useAppDispatch()
  const initialOrarData = useAppSelector(orarDataSelector)
  const [orarData, setOrarData] = useState<OrarData>(initialOrarData)

  const [fieldTouched, setFieldTouched] = useState<string | null>(null)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<string[]>([])

  useEffect(() => {
    setOrarData(initialOrarData)
  }, [initialOrarData])

  const getCssFor = (field: string) =>
    `${fieldTouched === field && 'ion-touched'} ${fieldErrors.includes(field) && 'ion-invalid'} ${!fieldErrors.includes(field) && 'ion-valid'}`

  const setAn = (an: string) => {
    const newOrarData = {...orarData, source: {...orarData.source, an}}
    setOrarData(newOrarData)
    if(!an.match(/^\d{4}$/)) {
      setFieldErrors([...fieldErrors, 'an'])
      return
    }
    else {
      setFieldErrors(fieldErrors.filter((error) => error !== 'an'))
    }
  }

  const setGrupa = (grupa: string) => {
    const newOrarData = {...orarData, source: {...orarData.source, grupa}}
    setOrarData(newOrarData)
    if(grupa.length < 2) {
      setFieldErrors([...fieldErrors, 'grupa'])
      return
    }
    else {
      setFieldErrors(fieldErrors.filter((error) => error !== 'grupa'))
    }
  }

  const refreshOrar = () => {
    const an = orarData.source.an!
    const semestru = orarData.source.semestru!
    const grupa = orarData.source.grupa!
    fetchOrar(an, semestru, grupa).then((orar) => {
      // orarData.orar = orar
      const newOrarData = {...orarData, orar}
      setOrarData(newOrarData)
      // @ts-ignore
      dispatch(setOrarDataRedux(newOrarData))
      saveOrarDataToStorage(newOrarData).catch((err) => {
        console.error("Error saving orar data", err)
      })
      setErrorText(null)
    }).catch((err) => {
      setErrorText(`Nu s-a putut obtine orarul. Am căutat un orar pentru anul ${an}, semestrul ${semestru} și grupa ${grupa}. Eroare este: ${err}`)
      console.error("Error fetching orar", err)
    })
  }

  const refreshAvailable =
    orarData.source.an &&
    orarData.source.semestru &&
    orarData.source.grupa &&
    fieldErrors.length === 0

  const saveAvailable =
    orarData.orar &&
    (orarData.source.an !== initialOrarData.source.an || orarData.source.semestru !== initialOrarData.source.semestru || orarData.source.grupa !== initialOrarData.source.grupa)

  return (
    <IonContent className="ion-padding">
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: orarData.orar ? 'space-between' : 'center', marginBottom: 8}}>
        {orarData.orar &&
            <IonLabel>
              Last updated: {getLastUpdateText(orarData.orar)}
            </IonLabel>
        }
        <IonButton disabled={!refreshAvailable} onClick={refreshOrar}>
          <IonIcon
            slot="start"
            icon={saveAvailable ? save : refresh}
          />
          {orarData.orar ? saveAvailable ? 'Save' : 'Refresh orar' : 'Get orar'}
        </IonButton>
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
        onIonChange={(e) => setOrarData({...orarData, source: {...orarData.source, semestru: e.detail.value}})}
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
        <>
          <h3 style={{marginTop: "1em"}}>Setari suplimentare</h3>
          <IonSelect
            label="Semigrupa"
            labelPlacement="floating"
            value={orarData.semigrupa}
            onIonInput={(e) => setOrarData({...orarData, semigrupa: e.detail.value})}
          >
            <IonSelectOption value={null}>Ambele</IonSelectOption>
            <IonSelectOption value="1">1</IonSelectOption>
            <IonSelectOption value="2">2</IonSelectOption>
          </IonSelect>
          <ListaMaterii orar={orarData.orar} grupa={initialOrarData.source.grupa} setOrar={(orar) => setOrarData({...orarData, orar})} />
        </>
      }
    </IonContent>
  )
}