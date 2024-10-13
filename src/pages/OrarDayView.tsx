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

export const OrarDayView: React.FC = () => {
  const dispatch = useAppDispatch()
  const orarData = useAppSelector(orarDataSelector)
  const filterData = useAppSelector(filterDataSelector)
  const [ore, setOre] = useState([])

  useEffect(() => {
    const ore = getOrarOre(orarData)
    setOre(applyFilters(ore, filterData, orarData.mainOrar.source.grupa))
    //@ts-ignore
    dispatch(setCurrentTab({title: 'Orar', filterMenu: FilterMenu.ORAR_ZI}))
  }, [])

  useEffect(() => {
    const ore = getOrarOre(orarData)
    setOre(applyFilters(ore, filterData, orarData.mainOrar.source.grupa))
  }, [filterData, orarData])

  const setZiua = (date: Date) => {
    // @ts-ignore
    dispatch(setFilterDay(date))
  }

  const screenProps = ore.length <= 0 ? {width: "100%", height: "100%"} : {}

  return (
    <IonContent>
      <div style={{marginRight: 10, ...screenProps}}>
        {orarSourceExists(orarData) ? (
          ore.length > 0 ? (
            <div>
              {/* WeekDayPicker always stays at the top */}
              <div style={{position: 'sticky', top: 0, zIndex: 10, marginLeft: 10,}}>
                <WeekDayPicker selectedDate={ziuaToDayOfWeek(filterData.ziua)} onDatePicked={setZiua}/>
              </div>
              <OrarZi ore={ore}/>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: "column", height: "100%"}}>
              {/* WeekDayPicker always stays at the top */}
              <div style={{position: 'sticky', top: 0, zIndex: 10, marginLeft: 10, marginRight: 10,}}>
                <WeekDayPicker selectedDate={ziuaToDayOfWeek(filterData.ziua)} onDatePicked={setZiua}/>
              </div>
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
              <IonButton routerLink="/orar-settings">Configurează</IonButton>
            </h4>
          </>
        )}
      </div>
    </IonContent>
  )
}