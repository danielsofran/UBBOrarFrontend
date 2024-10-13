import {useState} from "react"
import {days, ziuaToDayOfWeek} from "../../service/utils"
import {Ziua} from "../../model/orar"
import {IonCard, IonCardContent, IonText} from "@ionic/react"

interface WeekDayPickerProps {
  selectedDate: number
  onDatePicked: (Date) => void
}

export const WeekDayPicker = (props: WeekDayPickerProps) => {
  const [now, setNow] = useState(new Date()) // new Date() "2021-10-11T10:00:00

  const lastMonday = new Date(now.getTime())
  lastMonday.setDate(now.getDate() - now.getDay() + 1)

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexWrap: "nowrap",
        overflowX: "auto",
      }} >
      {Array.from({ length: 1 }).flatMap(() => days.slice(1,6).map((day, index) => {
        const date = new Date(lastMonday)
        date.setDate(lastMonday.getDate() + ziuaToDayOfWeek(day as Ziua) - 1)
        const isSelected = date.getDay() === props.selectedDate
        return (
          <IonCard
            key={index}
            onClick={() => props.onDatePicked(date)}
            style={{
              marginRight: 0, marginLeft: 0,
              width: "20vw",
              minWidth: "70px",
              textAlign: "center",
              backgroundColor: isSelected ? "var(--ion-color-primary)" : "var(--ion-color-light)",
              color: isSelected ? "var(--ion-color-light)" : "var(--ion-color-dark)",
              transition: "background-color 0.8s ease, color 0.5s ease",
            }}>
            <IonCardContent>
              <IonText style={{fontSize: "1.2rem"}}>{day.substring(0, 3)}</IonText>
              {/*<h1 style={{fontSize: "1.2rem"}}>{date.getDate()}.{date.getMonth()}</h1>*/}
            </IonCardContent>
          </IonCard>
        )
      }))}
    </div>
  )
}