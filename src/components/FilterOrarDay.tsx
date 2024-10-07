import {IonItem, IonLabel, IonList, IonSelect, IonSelectOption} from "@ionic/react"
import {useAppDispatch, useAppSelector} from "../store"
import {filterDataSelector, setFilterData as setFilterDataRedux} from "../reducers/filter"
import {saveFilterDataToStorage} from "../storage/filterData"

export const FilterOrarDay: React.FC = () => {
  const dispatch = useAppDispatch()
  const filterDataRedux = useAppSelector(filterDataSelector)

  const setProperty = (property: string, value: any) => {
    const newFilterData = {...filterDataRedux, [property]: value}
    // @ts-ignore
    dispatch(setFilterDataRedux(newFilterData))
    saveFilterDataToStorage(newFilterData).then(() => {
      console.log("Filter data saved")
    }).catch((err) => {
      console.error("Error saving filter data", err)
    })
  }

  return (
    <IonList>
      <IonItem>
        <IonLabel>Ziua</IonLabel>
        <IonSelect interface="popover"
          value={filterDataRedux.ziua}
          onIonChange={e => setProperty('ziua', e.detail.value)}
        >
          <IonSelectOption value="Luni">Luni</IonSelectOption>
          <IonSelectOption value="Marți">Marți</IonSelectOption>
          <IonSelectOption value="Miercuri">Miercuri</IonSelectOption>
          <IonSelectOption value="Joi">Joi</IonSelectOption>
          <IonSelectOption value="Vineri">Vineri</IonSelectOption>
        </IonSelect>
      </IonItem>
      <IonItem>
        <IonLabel>Săptămâna</IonLabel>
        <IonSelect interface="popover"
          value={filterDataRedux.saptamana}
          onIonChange={e => setProperty('saptamana', e.detail.value)}
        >
          <IonSelectOption value="1">Impara</IonSelectOption>
          <IonSelectOption value="2">Para</IonSelectOption>
        </IonSelect>
      </IonItem>
      <IonItem>
        <IonLabel>Semigrupa</IonLabel>
        <IonSelect interface="popover"
          value={filterDataRedux.semigrupa}
          onIonChange={e => setProperty('semigrupa', e.detail.value)}
        >
          <IonSelectOption value=" ">Toate</IonSelectOption>
          <IonSelectOption value="1">1</IonSelectOption>
          <IonSelectOption value="2">2</IonSelectOption>
        </IonSelect>
      </IonItem>
      <IonItem>
        <IonLabel>Tip</IonLabel>
        <IonSelect interface="popover"
          value={filterDataRedux.tip}
          onIonChange={e => setProperty('tip', e.detail.value)}
        >
          <IonSelectOption value=" ">Toate</IonSelectOption>
          <IonSelectOption value="Curs">Curs</IonSelectOption>
          <IonSelectOption value="Seminar">Seminar</IonSelectOption>
          <IonSelectOption value="Laborator">Laborator</IonSelectOption>
        </IonSelect>
      </IonItem>
    </IonList>
  )
}