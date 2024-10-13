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
      <div style={{marginRight: '10px', ...screenProps}}>
        {orarSourceExists(orarData) ?
          ore.length > 0 ?
            <>
              <WeekDayPicker selectedDate={ziuaToDayOfWeek(filterData.ziua)} onDatePicked={setZiua} />
              <OrarZi ore={ore}/>
            </> :
            <div style={{display: 'flex', flexDirection: "column", height: "100%"}}>
              <WeekDayPicker selectedDate={ziuaToDayOfWeek(filterData.ziua)} onDatePicked={setZiua} />
              <div style={{flexGrow: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <div style={{margin: "auto", textAlign: "center"}}>
                  <h2>Horray!</h2>
                  <h4>Nici o oră las care trebuie mers</h4>
                </div>
              </div>
            </div>
          : <>
            <h4 style={{textAlign: 'center', marginBottom: "1em"}}>Nu există date pentru orar</h4>
            <h4 style={{textAlign: 'center'}}>Pentru a vizualiza orarul, apasă
              <IonButton routerLink="/orar-settings">Configurează</IonButton>
            </h4>
          </>
        }
      </div>
    </IonContent>
  )
}