import {
  IonButton,
  IonButtons, IonCol,
  IonContent, IonGrid,
  IonHeader, IonIcon,
  IonItem,
  IonLabel,
  IonModal, IonRow,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import {useState} from "react";
import {checkmarkOutline} from "ionicons/icons";

interface ColorPickerProps {
  label: string
  color: string
  onChange: (color: string) => void
}

const preferredColors = [
  'primary',
  'secondary',
  'tertiary',
  'success',
  'warning',
  'danger',
  'light',
  'dark',
]

export const ColorPicker = ({label, color, onChange}: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleColorChoice = (color: string) => {
    setIsOpen(false)
    onChange(color)
  }

  return (
    <>
      <IonItem
        detail={false}
        button
        onClick={() => setIsOpen(true)}
      >
        <IonLabel>{label}</IonLabel>
        <div
          slot="end"
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: `var(--ion-color-${color})`,
            borderRadius: '50%',
          }}
        >
        </div>
      </IonItem>
      <IonModal
        isOpen={isOpen}
        onDidDismiss={() => setIsOpen(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Alege culoarea</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsOpen(false)}>Închide</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonGrid>
            <IonRow>
              {preferredColors.map((preferredColor, index) => (
                <IonCol
                  key={index}
                  size="3"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IonButton
                    color={preferredColor}
                    onClick={() => handleColorChoice(preferredColor)}
                    size="large"
                    shape="round"
                  >
                    <IonIcon slot="icon-only" icon={preferredColor === color ? checkmarkOutline : ""}></IonIcon>
                  </IonButton>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    </>
  )
}