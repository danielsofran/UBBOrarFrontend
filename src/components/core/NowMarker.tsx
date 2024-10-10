import {oneHourHeight, orarPadding} from "../OrarZi"
import {useEffect, useState} from "react"
import {getHourFloat} from "../../service/utils"
import {useAppSelector} from "../../store"
import {preferencesSelector} from "../../reducers/preferences"

interface NowMarkerProps {
  breakpoints: number[]
}

export const NowMarker = (props: NowMarkerProps) => {
  const preferences = useAppSelector(preferencesSelector)
  const [realNowHour, setRealNowHour] = useState<number>(getHourFloat(new Date()))

  const firstHour = props.breakpoints[0], lastHour = props.breakpoints[props.breakpoints.length - 1]
  const nowHour = realNowHour < firstHour ? firstHour :
    realNowHour > lastHour ? lastHour : realNowHour
  const nrPaddings = props.breakpoints.reduce((acc, bp) => {
    if (bp < nowHour) return acc + 1
    if (bp === nowHour) return acc + 0.4
    return acc
  }, -1)

  useEffect(() => {
    const interval = setInterval(() => {
      setRealNowHour(getHourFloat(new Date()))
    }, 2 * 60 * 1000) // in milliseconds

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div id="now-marker" style={{
        position: 'absolute',
        top: `${(nowHour - firstHour) * oneHourHeight + nrPaddings * orarPadding}px`,
        left: 0,
        width: '100%',
        height: '5px',
        backgroundColor: `var(--ion-color-${preferences.colorMarker}`,
        zIndex: 5,
        transition: 'top 0.5s ease',
      }}>
        <span style={{
          position: 'absolute',
          top: '-7px',
          left: '-20px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: `var(--ion-color-${preferences.colorMarker}`,
          content: '',
          transition: 'top 0.5s ease, left 0.5s ease',
        }}></span>
      </div>
      <div style={{
        position: 'absolute',
        top: `${(nowHour - firstHour) * oneHourHeight + nrPaddings * orarPadding}px`,
        left: 0,
        width: '10%',
        height: '5px',
        backgroundColor: `var(--ion-color-${preferences.colorMarker}`,
        zIndex: 10,
        transition: 'top 0.5s ease, width 0.5s ease',
      }}/>
    </>
  )
}