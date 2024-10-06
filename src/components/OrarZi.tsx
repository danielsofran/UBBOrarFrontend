import {BaseOra, Orar, Ziua} from "../model/orar"
import {useCallback, useEffect, useMemo} from "react"
import {getOrarOre, getOraType, orarFirstLastHourInDay} from "../service/orarUtils"
import {createHoursBlocks, orarClashes} from "../service/orarGridUtils"
import {IonCol, IonContent, IonGrid, IonRow, IonText} from "@ionic/react"
import {NowMarker} from "./core/NowMarker"
import {OraCell} from "./OraCell"

interface OrarZiProps {
  orar: Orar
  zi: Ziua
}

const DisplayTime = ({ora}: {ora: BaseOra}) => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between'}}>
      <IonText>{ora.hourStart}:{ora.minuteStart}</IonText>
      <IonText>{ora.hourEnd}:{ora.minuteEnd}</IonText>
    </div>
  )
}

export const oneHourHeight = window.innerHeight / 12
export const orarPadding = 20

export const OrarZi = (props: OrarZiProps) => {
  const dateLimit = orarFirstLastHourInDay(props.orar, props.zi)
  if(!dateLimit) return null
  const hoursBlocks = createHoursBlocks(dateLimit)

  const oreByInterval = useMemo(() => {
    const ore = getOrarOre(props.orar)
      .filter(ora => ora.ziua === props.zi && !ora.hidden)
    return orarClashes(ore)
  }, [props.orar, props.zi])

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
                }}>
                  {ore.map((ora, index) => ( // TODO: use swipe js
                      <OraCell ora={ora} compact={ore.length > 1} key={index} />
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