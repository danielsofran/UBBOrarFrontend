import {useEffect, useState} from "react"
import {orarDataSelector, setOrarData as setOrarDataRedux} from "../reducers/orarData"
import {useAppDispatch, useAppSelector} from "../store"
import {IonButton, IonContent, IonIcon, IonInput, IonLabel, IonSelect, IonSelectOption} from "@ionic/react"
import {download, refresh} from "ionicons/icons"
import {fetchOrar} from "../service/scrapper"
import {saveOrarDataToStorage} from "../storage/orarData"
import {equalsOrar, equalsOrarSource, getAn, getGrupa, getLastUpdateText, getSemestru, orarExists, orarSourceExists, setAn, setGrupa, setOrar as setOrarModel, setSemestru} from "../service/orarUtils"
import {ListaMaterii} from "../components/ListaMaterii"
import {Orar} from "../model/orar"
import {SaveCancelButtons} from "../components/core/SaveCancelButtons"
import {setCurrentTab} from "../reducers/navigation"

export const OrarSettings = () => {
  const dispatch = useAppDispatch()
  const initialOrar = useAppSelector(orarDataSelector)
  const [orar, setOrar] = useState<Orar>(initialOrar)

  const [fieldTouched, setFieldTouched] = useState<string | null>(null)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<string[]>([])

  useEffect(() => {
    // @ts-ignore
    dispatch(setCurrentTab({title: 'Configurează Orar'}))
  }, [])

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

  const saveOrar = () => {
    // check if the source is the same
    if(!equalsOrarSource(orar, initialOrar)) {
      // we need to fetch the orar again
      refreshOrar() // this will also save the additional settings
    }
    else {
      // we can save the orar locally
      // @ts-ignore
      dispatch(setOrarDataRedux(orar))
      saveOrarDataToStorage(orar).catch((err) => {
        console.error("Error saving orar data", err)
      })
    }
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
              <SaveCancelButtons onSave={saveOrar} onCancel={() => setOrar(initialOrar)}/> :
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
      {orarExists(orar) && equalsOrarSource(orar, initialOrar) &&
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
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: '0.5em'}}>
            {!equalsOrar(orar, initialOrar) && <SaveCancelButtons onSave={saveOrar} onCancel={() => setOrar(initialOrar)}/>}
          </div>
        </>
      }
    </IonContent>
  )
}