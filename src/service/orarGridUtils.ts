import {BaseOra, CustomOra, Ora, OraType} from "../model/orar"
import {getOraType} from "./orarUtils"

export const oraInBlock = (ora: BaseOra, hour: number, size: number): boolean => {
  const hourStart = parseInt(ora.hourStart)
  return hour <= hourStart && hour + size > hourStart
}

// TODO: add preferences, add mainOrar or orarSuplimentar priority
const tipPriority = {Curs: 2, Seminar: 1, Laborator: 0}
export const getOraPriority = (ora1: BaseOra, ora2: BaseOra) => {
  // ascendent by date
  if(ora1.hourStart < ora2.hourStart)
    return -1
  if(ora1.hourStart > ora2.hourStart)
    return 1
  if(ora1.minuteStart < ora2.minuteStart)
    return -1
  if(ora1.minuteStart > ora2.minuteStart)
    return 1
  // by type, facultate first
  const type1 = getOraType(ora1), type2 = getOraType(ora2)
  if(type1 < type2)
    return -1
  if(type1 > type2)
    return 1
  if(type1 === OraType.FACULTATE) {
    const ora1F = ora1 as Ora, ora2F = ora2 as Ora
    if(tipPriority[ora1F.tip] < tipPriority[ora2F.tip])
      return -1
    if(tipPriority[ora1F.tip] > tipPriority[ora2F.tip])
      return 1
    if(ora1F.numeMaterie < ora2F.numeMaterie)
      return -1
    if(ora1F.numeMaterie > ora2F.numeMaterie)
      return 1
  }
  else {
    const ora1P = ora1 as CustomOra, ora2P = ora2 as CustomOra
    if(ora1P.title < ora2P.title)
      return -1
    if(ora1P.title > ora2P.title)
      return 1
  }
  return 0
}

/**
 * Creates a map of ore by block
 * The key is the start hour of the block
 * The value is a map of ore by start date and end date
 * The key of the inner map is a Date, having:
 *  - hours: ora.hourStart
 *  - minutes: ora.minuteStart
 *  - days: ora.hourEnd
 *  - seconds: ora.minuteEnd
 * The representation in indeed weird, but assures js map equals work for intervals
 */
export const oreByBlockAndPriority = (ore: BaseOra[], breakpoints: number[]): Map<number, Map<Date, BaseOra[]>> => {
  const rez = new Map<number, Map<Date, BaseOra[]>>()
  const oreSorted = [...ore].sort(getOraPriority)
  for(let i = 0; i < breakpoints.length - 1; i++) {
    const size = breakpoints[i + 1] - breakpoints[i]
    const oreBlock = oreSorted
      .filter(ora => oraInBlock(ora, breakpoints[i], size)) // type is BaseOra
      .reduce((map, ora) => { // map<oraStart, ora[]>
        const key = new Date(0, 0, parseInt(ora.hourEnd), parseInt(ora.hourStart), parseInt(ora.minuteStart), parseInt(ora.minuteEnd))
        const list = map.get(key) || []
        list.push(ora)
        map.set(key, list)
        return map
      }, new Map<Date, BaseOra[]>())
    rez.set(breakpoints[i], oreBlock)
  }
  return rez
}

/**
 * todo: should not care about blocks. just put the hour where it belongs
 * take care of paddings and conflicts
 * should be able to put them in grid useing nrConflicts * 100% width
 */

export interface DateLimit {
  firstHour: number
  firstMinute: number
  lastHour: number
  lastMinute: number
}