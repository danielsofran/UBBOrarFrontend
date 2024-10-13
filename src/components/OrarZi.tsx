import {BaseOra, Orar, Ziua} from "../model/orar"
import {useCallback, useEffect, useMemo} from "react"
import {getOrarOre, getOraType, orarFirstLastHourInDay} from "../service/orarUtils"
import {createHoursBlocks, getOraDuration, orarClashes} from "../service/orarGridUtils"
import {IonCol, IonContent, IonGrid, IonRow, IonText} from "@ionic/react"
import {NowMarker} from "./core/NowMarker"
import {OraCell} from "./OraCell"
import {useAppSelector} from "../store"
import {preferencesSelector} from "../reducers/preferences"

interface OrarZiProps {
  ore: BaseOra[]
}

// export const oneHourHeight = window.innerHeight / 11
export const orarPadding = 20

export const OrarZi = (props: OrarZiProps) => {
  const preferences = useAppSelector(preferencesSelector)
  const oneHourHeight = window.innerHeight / preferences.oneHourHeight

  const dateLimit = orarFirstLastHourInDay(props.ore)
  if(!dateLimit) return null
  const hoursBlocks = createHoursBlocks(dateLimit)

  const oreByInterval = useMemo(() => {
    return orarClashes(props.ore)
  }, [props.ore])

  const scrollToNow = useCallback(() => {
    const nowMarker = document.getElementById('now-marker')
    if(nowMarker) {
      nowMarker.scrollIntoView({behavior: 'smooth', block: 'center'})
    }
  }, [])

  useEffect(() => {
    scrollToNow()
  }, [scrollToNow])

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="2">
          <div style={{width: '100%', height: '100%', position: 'relative'}}>
            {hoursBlocks.breakpoints.map((hour, index) => {
              if(index === hoursBlocks.breakpoints.length - 1) return null
              const size = hoursBlocks.breakpoints[index + 1] - hour
              return (
                <div key={index} style={{height: size * oneHourHeight, position: 'relative', margin: `${orarPadding}px 0`}}>
                  <IonText
                    style={{
                      fontSize: '1.5em',
                      position: 'absolute',
                      top: `${-1*orarPadding}px`,
                      left: '50%',
                      transform: 'translate(-50%)'
                    }}
                  >{index !== 0 && hour}</IonText>
                </div>
              )
            })}
          </div>
        </IonCol>
        <IonCol size="10">
          <div style={{width: '100%', height: '100%', position: 'relative'}}>
            {/*<div style={{width: `${3}00%`, height: '100%', position: 'absolute', border: "5px solid green"}}/>*/}
            {Array.from(oreByInterval.ore.keys()).map((interval, index) => {
              const ore = oreByInterval.ore.get(interval)!
              const start = interval.firstHour + interval.firstMinute / 60
              const end = interval.lastHour + interval.lastMinute / 60
              const size = end - start
              const nrPaddingsStart = hoursBlocks.breakpoints.reduce((acc, bp) => {
                if (bp <= start) return acc + 1
                return acc
              }, -1)
              const nrPaddingsIncluding = hoursBlocks.breakpoints.reduce((acc, bp) => {
                if (bp > start && bp < end) return acc + 1
                return acc
              }, 0)
              const top = (start - hoursBlocks.breakpoints[0]) * oneHourHeight + orarPadding * nrPaddingsStart

              return (
                <div key={index} style={{
                  position: 'absolute',
                  top: `${top}px`,
                  left: '0',
                  width: '100%',
                  height: `${size * oneHourHeight + nrPaddingsIncluding * orarPadding}px`,
                  display: 'flex',
                  flexDirection: 'row',
                  gap: orarPadding,
                  flexWrap: 'nowrap',
                  overflowX: 'auto',
                }}>
                  {ore.map((ora, index) => (
                      <OraCell ora={ora} compact={ore.length > 1 || getOraDuration(ora) < 2} key={index} />
                    ))
                  }
                </div>
              )
            })}
            <NowMarker breakpoints={hoursBlocks.breakpoints}/>
            {hoursBlocks.breakpoints.map((hour, index) => {
              if(index === hoursBlocks.breakpoints.length - 1) return null
              const size = hoursBlocks.breakpoints[index + 1] - hour
              return (
                <div key={index} style={{height: size * oneHourHeight, border: '0px solid white', margin: `${orarPadding}px 0`}}/>
              )
            })}
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}