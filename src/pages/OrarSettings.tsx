import {useEffect, useState} from "react"
import {setOrarData as setOrarDataRedux, orarDataSelector} from "../reducers/orarData"
import {useAppDispatch, useAppSelector} from "../store"
import {IonButton, IonContent, IonIcon, IonInput, IonLabel, IonList, IonSelect, IonSelectOption} from "@ionic/react"
import {refresh, save, download, close} from "ionicons/icons"
import {fetchOrar} from "../service/scrapper"
import {saveOrarDataToStorage} from "../storage/orarData"
import {equalsOrarSource, getAn, getGrupa, getLastUpdateText, getSemestru, orarExists, orarSourceExists, setAn, setGrupa, setOrar as setOrarModel, setSemestru} from "../service/orarUtils"
import {ListaMaterii} from "../components/ListaMaterii"
import {Orar} from "../model/orar"

export const OrarSettings = () => {
  const dispatch = useAppDispatch()
  const initialOrar = useAppSelector(orarDataSelector)
  const [orar, setOrar] = useState<Orar>(initialOrar)

  const [fieldTouched, setFieldTouched] = useState<string | null>(null)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<string[]>([])

  useEffect(() => {
    setOrar(initialOrar)
  }, [initialOrar])

  const getCssFor = (field: string) =>
    `${fieldTouched === field && 'ion-touched'} ${fieldErrors.includes(field) && 'ion-invalid'} ${!fieldErrors.includes(field) && 'ion-valid'}`

  const setAndValidateAn = (an: string) => {
    const newOrarData = setAn(orar, an)
    setOrar(newOrarData)
    if(!an.match(/^\d{4}$/)) {
      setFieldErrors([...fieldErrors, 'an'])
      return
    }
    else {
      setFieldErrors(fieldErrors.filter((error) => error !== 'an'))
    }
  }

  const setAndValidateGrupa = (grupa: string) => {
    const newOrarData = setGrupa(orar, grupa)
    console.log(newOrarData)
    setOrar(newOrarData)
    if(grupa.length < 2) {
      setFieldErrors([...fieldErrors, 'grupa'])
      return
    }
    else {
      setFieldErrors(fieldErrors.filter((error) => error !== 'grupa'))
    }
  }

  const refreshOrar = () => {
    fetchOrar(orar.mainOrar.source).then((parsedOrar) => {
      // orar.orar = orar
      const newOrarData = setOrarModel(orar, parsedOrar.orar, parsedOrar.lastUpdate)
      setOrar(newOrarData)
      // @ts-ignore
      dispatch(setOrarDataRedux(newOrarData))
      saveOrarDataToStorage(newOrarData).catch((err) => {
        console.error("Error saving orar data", err)
      })
      setErrorText(null)
    }).catch((err) => {
      const an = getAn(orar)
      const semestru = getSemestru(orar)
      const grupa = getGrupa(orar)
      setErrorText(`Nu s-a putut obtine orarul. Am căutat un orar pentru anul ${an}, semestrul ${semestru} și grupa ${grupa}. Eroare este: ${err}`)
      console.error("Error fetching orar", err)
    })
  }

  const refreshAvailable = orarSourceExists(orar) && fieldErrors.length === 0
  const saveAvailable = orarExists(orar) && !equalsOrarSource(orar, initialOrar)

  return (
    <IonContent className="ion-padding">
      <div style={{marginBottom: '0.5em'}}>
        {!orarExists(orar) ?
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <IonButton disabled={!refreshAvailable} onClick={refreshOrar} color="primary">
              <IonIcon slot="start" icon={download}/>
              Get orar
            </IonButton>
          </div> :
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <IonLabel>
              Last updated: {getLastUpdateText(orar)}
            </IonLabel>
            {saveAvailable ?
              <>
                <IonButton onClick={() => setOrar(initialOrar)} color="success">
                  <IonIcon slot="start" icon={save}/> Save
                </IonButton>
                <IonButton onClick={() => setOrar(initialOrar)} color="primary">
                  <IonIcon slot="start" icon={close}/> Cancel
                </IonButton>
              </> :
              <IonButton onClick={refreshOrar} color="primary">
                <IonIcon slot="start" icon={refresh}/> Refresh orar
              </IonButton>
            }
          </div>
        }
      </div>
      <IonLabel color="danger">{errorText}</IonLabel>

      <IonInput
        className={getCssFor('an')}
        label="An"
        labelPlacement="floating"
        value={getAn(orar)}
        onIonInput={(e) => setAndValidateAn(e.detail.value)}
        onIonBlur={() => setFieldTouched('an')}
        errorText="Anul este incorect"
      />
      <IonSelect
        label="Semestru"
        labelPlacement="floating"
        value={getSemestru(orar)}
        onIonChange={(e) => setOrar(setSemestru(orar, e.detail.value))}
      >
        <IonSelectOption value="1">1</IonSelectOption>
        <IonSelectOption value="2">2</IonSelectOption>
      </IonSelect>
      <IonInput
        className={getCssFor('grupa')}
        label="Grupa"
        labelPlacement="floating"
        value={getGrupa(orar)}
        onIonInput={(e) => setAndValidateGrupa(e.detail.value)}
        onIonBlur={() => setFieldTouched('grupa')}
        errorText="Grupa este incorecta"
      />
      {orarExists(orar) &&
        <>
          <h3 style={{marginTop: "1em"}}>Setari suplimentare</h3>
          {/*<IonSelect*/}
          {/*  label="Semigrupa"*/}
          {/*  labelPlacement="floating"*/}
          {/*  value={orar.semigrupa}*/}
          {/*  onIonInput={(e) => setOrar({...orar, semigrupa: e.detail.value})}*/}
          {/*>*/}
          {/*  <IonSelectOption value={null}>Ambele</IonSelectOption>*/}
          {/*  <IonSelectOption value="1">1</IonSelectOption>*/}
          {/*  <IonSelectOption value="2">2</IonSelectOption>*/}
          {/*</IonSelect>*/}
          <ListaMaterii orar={orar.mainOrar} grupa={initialOrar.mainOrar.source.grupa} setOrar={(orarGrupa) => setOrar(setOrarModel(orar, orarGrupa))} />
        </>
      }
    </IonContent>
  )
}