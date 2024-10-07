import {IonButton, IonContent} from "@ionic/react"
import {useAppDispatch, useAppSelector} from "../store"
import {orarDataSelector} from "../reducers/orarData"
import {useEffect, useState} from "react"
import {setCurrentTab} from "../reducers/navigation"
import {OrarZi} from "../components/OrarZi"
import {getOrarOre, orarSourceExists} from "../service/orarUtils"
import {FilterMenu} from "../model/navigation"
import {applyFilters} from "../service/utils"
import {filterDataSelector} from "../reducers/filter"

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

  return (
    <IonContent>
      <div style={{marginRight: '10px'}}>
        {orarSourceExists(orarData) ?
          <OrarZi ore={ore}/> :
          <>
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