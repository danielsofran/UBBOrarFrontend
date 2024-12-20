import {Ora, Tip} from "../model/orar"
import {IonText} from "@ionic/react"
import {preferencesSelector} from "../reducers/preferences"
import {useAppSelector} from "../store"

interface OraFacultateCellProps {
  ora: Ora
  compact?: boolean
}

const cellPadding = 3
const cellBorderRadius = 10
const cellFontSize = '1.1em'

export const OraFacultateCell = (props: OraFacultateCellProps) => {
  const preferences = useAppSelector(preferencesSelector)
  const {numeMaterie, tip, sala, profesor, formatie} = props.ora
  const oraStart = `${props.ora.hourStart}:${props.ora.minuteStart}`
  const oraEnd = `${props.ora.hourEnd}:${props.ora.minuteEnd}`
  const profName = profesor.split(" ").splice(1).reduce((acc, word) => acc + word + ' ', '')

  const oraStyle = {
    position: 'absolute',
    right: cellPadding * 2,
  }

  const getColor = () => {
    switch(tip) {
      case Tip.CURS: return preferences.colorCurs
      case Tip.SEMINAR: return preferences.colorSeminar
      case Tip.LABORATOR: return preferences.colorLaborator
      default: return 'black'
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%', height: '100%',
        fontSize: cellFontSize,
        backgroundColor: `var(--ion-color-${getColor()})`,
        opacity: 0.9,
        borderRadius: cellBorderRadius,
        padding: cellPadding,
        zIndex: 6,
      }}
      className='ion-text-center'
    >
      {props.compact ?
        <div style={{height: "100%", marginLeft: cellPadding, marginRight: cellPadding, marginTop: cellPadding}}>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: cellPadding, height: "70%"}}>
            <h4 style={{margin: 0}}>{numeMaterie}</h4>
            <IonText>{tip} - {sala}</IonText>
          </div>
          <IonText style={{position: 'absolute', bottom: cellPadding, left: cellPadding * 2}}>{oraStart}</IonText>
          <IonText style={{position: 'absolute', bottom: cellPadding, right: cellPadding * 2}}>{oraEnd}</IonText>
        </div> :
        <div style={{height: "70%", marginLeft: cellPadding, marginRight: cellPadding}}>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
            <h3>{numeMaterie}</h3>
            <h4 style={{
              backgroundColor: 'rgba(255,255,255,0.39)',
              borderRadius: cellBorderRadius,
              width: 'fit-content',
              margin: 'auto',
              padding: cellPadding,
              paddingLeft: cellPadding * 2,
              paddingRight: cellPadding * 2,
              marginBottom: cellPadding / 2,
            }}>{tip} - {sala}</h4>
          </div>
          <IonText style={{
            position: 'absolute',
            bottom: cellPadding,
            left: cellPadding * 2,
          }}>{profName}</IonText>
          <IonText style={{...oraStyle, top: cellPadding,}}>{oraStart}</IonText>
          <IonText style={{...oraStyle, bottom: cellPadding,}}>{oraEnd}</IonText>
          <IonText style={{position: 'absolute', top: cellPadding, left: cellPadding * 2}}>{formatie}</IonText>
        </div>
      }
    </div>
  )
}