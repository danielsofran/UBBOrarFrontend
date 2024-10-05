import {IonButton, IonIcon} from "@ionic/react"
import {close, save} from "ionicons/icons"

interface SaveCancelButtonsProps {
  onSave: () => void
  onCancel: () => void
}

export function SaveCancelButtons(props: SaveCancelButtonsProps) {
  return <>
    <IonButton onClick={props.onSave} color="success">
      <IonIcon slot="start" icon={save}/>
      Save
    </IonButton>
    <IonButton onClick={props.onCancel} color="warning">
      <IonIcon slot="start" icon={close}/>
      Cancel
    </IonButton>
  </>
}