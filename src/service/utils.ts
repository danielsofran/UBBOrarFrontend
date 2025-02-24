import {BaseOra, Ora, OraType, Ziua} from "../model/orar"
import {FilterData} from "../model/filter"
import {getOraType} from "./orarUtils"

export function formatDatePart(part: number) {
  return part.toString().padStart(2, '0')
}

export const getHourFloat = (date: Date) => {
  return date.getHours() + date.getMinutes() / 60
}

export const getHourFloatForOra = (ora: BaseOra) => {
  return {
    start: parseInt(ora.hourStart) + parseInt(ora.minuteStart) / 60,
    end: parseInt(ora.hourEnd) + parseInt(ora.minuteEnd) / 60
  }
}

export const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']
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
  if(month < 8)
    rez--
  return rez.toString()
}

export const getSemester = () => {
  const date = new Date()
  const month = date.getMonth()
  if(month >= 8 || month < 1) // 8 - September, 1 - February
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

export const convertToDateInterval = (ora: BaseOra) => {
  return new Date(0, 0, parseInt(ora.hourEnd), parseInt(ora.hourStart), parseInt(ora.minuteStart), parseInt(ora.minuteEnd))
}

export const convertFromDateInterval = (date: Date) => {
  return {
    hourStart: formatDatePart(date.getHours()),
    minuteStart: formatDatePart(date.getMinutes()),
    hourEnd: formatDatePart(date.getDate()),
    minuteEnd: formatDatePart(date.getSeconds())
  }
}

export const applyFilters = (ore: BaseOra[], filterData: FilterData) => {
  return ore.filter(ora => {
    if(ora.hidden)
      return false
    if(ora.ziua !== filterData.ziua)
      return false
    if(filterData.saptamana === " " || ora.saptamana === " "){}
    else if(ora.saptamana !== filterData.saptamana)
      return false
    const oraType = getOraType(ora)
    if(oraType === OraType.PERSONAL)
      return true
    const oraF = ora as Ora
    if(filterData.tip === " "){}
    else if(oraF.tip !== filterData.tip)
      return false
    if(filterData.formatii.length === 0)
      return true
    if(!oraF.formatie.includes("/"))
      return true // nu are semigrupa
    if(!filterData.formatii.includes(oraF.formatie as never))
      return false
    return true
  })
}