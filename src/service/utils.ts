import {BaseOra, Ora, Ziua} from "../model/orar"

export function formatDatePart(part: number) {
  return part.toString().padStart(2, '0')
}

export const getHourFloat = (date: Date) => {
  return date.getHours() + date.getMinutes() / 60
}

const days = ['Duminica', 'Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata']
export const dateToZiua = (date: Date) => {
  return days[date.getDay()] as Ziua
}

export const ziuaToDayOfWeek = (ziua: Ziua) => {
  return days.indexOf(ziua)
}

export const getAcademicYear = () => {
  const date = new Date()
  const month = date.getMonth()
  let rez = date.getFullYear()
  if(month < 9)
    rez--
  return rez.toString()
}

export const getSemester = () => {
  const date = new Date()
  const month = date.getMonth()
  if(month >= 9 || month < 2)
    return "1"
  return "2"
}

export const getTimeFormat = (ora: Ora) => {
  return `${ora.hourStart}:${ora.minuteStart} - ${ora.hourEnd}:${ora.minuteEnd}`
}

export const getSaptamanaFormat = (ora: Ora) => {
  if(ora.saptamana === "1")
    return "S1"
  if(ora.saptamana === "2")
    return "S2"
  return "S1/S2"
}