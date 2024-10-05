import {Ziua} from "../model/orar"

export function formatDatePart(part: number) {
  return part.toString().padStart(2, '0')
}

const days = ['Duminica', 'Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata']
export const dateToZiua = (date: Date) => {
  return days[date.getDay()] as Ziua
}

export const ziuaToDayOfWeek = (ziua: Ziua) => {
  return days.indexOf(ziua)
}
