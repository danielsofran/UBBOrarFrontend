import {BaseOra, Ora, Orar, OraType, Ziua} from "../model/orar"
import {useCallback, useEffect, useMemo} from "react"
import {getOrarOre, getOraType, orarFirstLastHourInDay} from "../service/orarUtils"
import {DateLimit, oraInBlock, oreByBlockAndPriority} from "../service/orarGridUtils"
import {IonCol, IonGrid, IonRow, IonText} from "@ionic/react"

interface OrarZiProps {
  orar: Orar
  zi: Ziua
}

interface HourBlock {
  size: number
  breakpoints: number[]
}

const DisplayTime = ({ora}: {ora: BaseOra}) => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between'}}>
      <IonText>{ora.hourStart}:{ora.minuteStart}</IonText>
      <IonText>{ora.hourEnd}:{ora.minuteEnd}</IonText>
    </div>
  )
}

const createHoursBlocks = (dateLimit: DateLimit, hoursInBlock = 2): HourBlock => {
  let breakpoint = {...dateLimit}
  if(breakpoint.firstHour % hoursInBlock !== 0) breakpoint.firstHour += hoursInBlock - breakpoint.firstHour % hoursInBlock
  if(breakpoint.lastHour % hoursInBlock !== 0) breakpoint.lastHour -= breakpoint.lastHour % hoursInBlock
  let blocks = []
  blocks.push(dateLimit.firstHour - 1)
  for(let i = breakpoint.firstHour; i <= breakpoint.lastHour; i += hoursInBlock)
    blocks.push(i)
  blocks.push(dateLimit.lastHour + 1)
  return {
    size: hoursInBlock,
    breakpoints: blocks
  }
}

const oneHourHeight = window.innerHeight / 8

export const OrarZi: React.FC<OrarZiProps> = (props) => {
  const dateLimit = orarFirstLastHourInDay(props.orar, props.zi)
  if(!dateLimit) return null
  const hoursBlocks = createHoursBlocks(dateLimit)

  console.log("OrarZi", dateLimit, hoursBlocks)

  const oreByBlock = useMemo(() => {
    const ore = getOrarOre(props.orar)
      .filter(ora => ora.ziua === props.zi && !ora.hidden)
    return oreByBlockAndPriority(ore, hoursBlocks.breakpoints)
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
    <div>
      <h2>{Ziua[props.zi]}</h2>
      <IonGrid>
        <IonRow>
          <IonCol size="2">
            <div style={{width: '100%', height: '100%', position: 'relative'}}>
              {hoursBlocks.breakpoints.map((hour, index) => {
                if(index === hoursBlocks.breakpoints.length - 1) return null
                const size = hoursBlocks.breakpoints[index + 1] - hour
                return (
                  <div key={index} style={{height: size * oneHourHeight, position: 'relative', margin: '7px 0'}}>
                    <IonText
                      style={{
                        fontSize: '1.5em',
                        position: 'absolute',
                        top: '-10px',
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
              {hoursBlocks.breakpoints.map((hour, index) => {
                if(index === hoursBlocks.breakpoints.length - 1) return null
                const breakpoint = hoursBlocks.breakpoints[index]
                const size = hoursBlocks.breakpoints[index + 1] - hour
                const nowHour = 11//new Date().getHours()
                const isNowHere = nowHour >= hour && nowHour < hour + size
                const ore = Array.from(oreByBlock.get(breakpoint).values()).reduce((acc, val) => acc.concat(val), [])
                // add the index within the inner map
                //const ore = Array.from(oreByBlock.get(breakpoint).values()).reduce((acc, val) => acc.concat(val), [])

                return (
                  <div key={index} style={{height: size * oneHourHeight, position: 'relative', border: '1px solid white', margin: '7px 0'}}>
                    {isNowHere &&
                        <div id="now-marker" style={{
                          position: 'absolute',
                          top: `${((nowHour - hour) / size) * 100}%`,
                          left: 0,
                          width: '100%',
                          height: '5px',
                          backgroundColor: 'purple',
                          zIndex: 5,
                        }}>
                          <span style={{
                            position: 'absolute',
                            top: '-7px',
                            left: '-20px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: 'purple',
                            content: '',
                          }}></span>
                        </div>
                    }
                    {ore.map((ora, index) => {
                      const oraType = getOraType(ora)
                      const hourStart = parseInt(ora.hourStart) + parseInt(ora.minuteStart) / 60
                      const hourEnd = parseInt(ora.hourEnd) + parseInt(ora.minuteEnd) / 60
                      const numberOfBlocks = ((hourEnd - hour) / size) > 1 ? Math.floor((hourEnd - hour) / size) : 0
                      if(oraType === OraType.PERSONAL) return null
                      const oraToRender = ora as Ora
                      const oraTypeColor = 'blue'
                      return (
                        <div key={index} className="TEST" style={{
                          position: 'absolute',
                          top: `${(hourStart - hour) * oneHourHeight}px`,
                          left: 0,
                          width: '100%',
                          height: `${(hourEnd - hourStart) * oneHourHeight + numberOfBlocks * 7}px`, // 7 is the padding
                          backgroundColor: oraTypeColor,
                          color: 'white',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '15px',
                        }}>
                          <IonText>{oraToRender.numeMaterie}</IonText>
                          <DisplayTime ora={oraToRender}/>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  )
}