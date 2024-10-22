import {IonButton, IonContent} from "@ionic/react"
import {useAppDispatch, useAppSelector} from "../store"
import {orarDataSelector} from "../reducers/orarData"
import {useEffect, useState} from "react"
import {setCurrentTab} from "../reducers/navigation"
import {OrarZi} from "../components/OrarZi"
import {getOrarOre, orarSourceExists} from "../service/orarUtils"
import {FilterMenu} from "../model/navigation"
import {applyFilters, ziuaToDayOfWeek} from "../service/utils"
import {filterDataSelector, setFilterData, setFilterDay} from "../reducers/filter"
import {WeekDayPicker} from "../components/core/WeekDayPicker"
import {basePath} from "../App"

export const OrarDayView: React.FC = () => {
  const dispatch = useAppDispatch()
  const orarData = useAppSelector(orarDataSelector)
  const filterData = useAppSelector(filterDataSelector)
  const [ore, setOre] = useState([])

  useEffect(() => {
    const ore = getOrarOre(orarData)
    setOre(applyFilters(ore, filterData))
    //@ts-ignore
    dispatch(setCurrentTab({title: 'Orar', filterMenu: FilterMenu.ORAR_ZI}))
  }, [])

  useEffect(() => {
    const ore = getOrarOre(orarData)
    setOre(applyFilters(ore, filterData))
  }, [filterData, orarData])

  const setZiua = (date: Date) => {
    // @ts-ignore
    dispatch(setFilterDay(date))
  }

  const screenProps = ore.length <= 0 ? {width: "100%", height: "100%"} : {}

  const Picker = ({haveRight}) => {
    return (
      <div style={{
        position: 'sticky',
        width: "100vw",
        top: 0,
        zIndex: 20,
        paddingLeft: 10,
        paddingRight: haveRight ? 10 : 0,
        paddingBottom: 10,
        backgroundColor: "var(--ion-color-light)"
      }}>
        <WeekDayPicker selectedDate={ziuaToDayOfWeek(filterData.ziua)} onDatePicked={setZiua}/>
      </div>
    )
  }

  return (
    <IonContent>
      <div style={{marginRight: 10, ...screenProps}}>
        {orarSourceExists(orarData) ? (
          ore.length > 0 ? (
            <div style={{width: "100%"}}>
              <Picker haveRight={false}/>
              <OrarZi ore={ore}/>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: "column", height: "100%", width: "100%"}}>
              <Picker haveRight={true}/>
              <div style={{flexGrow: 1, height: "90%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <div style={{margin: "auto", textAlign: "center"}}>
                  <h2>Horray!</h2>
                  <h4>Nici o oră la care trebuie mers</h4>
                </div>
              </div>
            </div>
          )
        ) : (
          <>
            <h4 style={{textAlign: 'center', marginBottom: "1em"}}>Nu există date pentru orar</h4>
            <h4 style={{textAlign: 'center'}}>
              Pentru a vizualiza orarul, apasă
              <IonButton routerLink={basePath + "orar-settings"}>Configurează</IonButton>
            </h4>
          </>
        )}
      </div>
    </IonContent>
  )
}