import {BaseOra, CustomOra, Ora, OraType} from "../model/orar"
import {getOraType} from "./orarUtils"
import {convertFromDateInterval, convertToDateInterval, getHourFloatForOra} from "./utils"

export interface DateInterval {
  firstHour: number
  firstMinute: number
  lastHour: number
  lastMinute: number
}

interface HourBlock {
  size: number
  breakpoints: number[]
}

export interface OrarClashes {
  ore: Map<DateInterval, BaseOra[]> // ore[interval] = [ora1, ora2, ...], sorted by priority
  unsupported: BaseOra[] // ore that conflicts and are not supported
  maxConflicts: number
}

export const oraInBlock = (ora: BaseOra, hour: number, size: number): boolean => {
  const hourStart = parseInt(ora.hourStart)
  return hour <= hourStart && hour + size > hourStart
}

// TODO: add preferences, add mainOrar or orarSuplimentar priority
const tipPriority = {Curs: 2, Seminar: 1, Laborator: 0}
export const getOraPriority = (ora1: BaseOra, ora2: BaseOra) => {
  // descendant by duration
  const duration1 = getHourFloatForOra(ora1)
  const duration2 = getHourFloatForOra(ora2)
  if(duration1 < duration2)
    return 1
  if(duration1 > duration2)
    return -1
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
        const key = convertToDateInterval(ora)
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

export const orarClashes = (ore: BaseOra[]): OrarClashes => {
  const firstRez = {ore: new Map<Date, BaseOra[]>(), unsupported: []}
  const oreSorted = [...ore].sort((ora1, ora2) => getHourFloatForOra(ora1).start - getHourFloatForOra(ora2).start)
  for(let i = 0; i < oreSorted.length; i++) {
    const ora = oreSorted[i]
    const oraHour = getHourFloatForOra(ora)
    let found = false
    for(const [key, value] of firstRez.ore) {
      const keyData = convertFromDateInterval(key)
      const keyHour = getHourFloatForOra(keyData as unknown as BaseOra)
      // there are 2 accepted states: oraHour is completely included in keyHour or oraHour is completely outside keyHour
      // the other cases go in unsupported, by priority
      const conditionStart = oraHour.start >= keyHour.start
      const conditionEnd = oraHour.end <= keyHour.end

      // if(oraHour.start == 16)
      //   debugger

      if(conditionStart && conditionEnd) {
        value.push(ora)
        found = true
        break
      }
      if(!conditionStart && !conditionEnd) { // this is the reverse of the previous condition, so we switch the order
        // but we need to check the rest of the list, because we might have more conflicts
        const newKey = convertToDateInterval(ora)
        // the new key should not conflict with the rest of the keys
        let newKeyConflicts = false
        for(const oldKey of firstRez.ore.keys()) {
          const oldKeyData = convertFromDateInterval(oldKey)
          const oldKeyHour = getHourFloatForOra(oldKeyData as unknown as BaseOra)
          const conditionStart = oraHour.start <= oldKeyHour.start
          const conditionEnd = oraHour.end >= oldKeyHour.end
          if(conditionStart && conditionEnd ||
            !conditionStart && !conditionEnd || // or there is no conflict
            oraHour.end <= oldKeyHour.start || oraHour.start >= oldKeyHour.end) {
            // everything is fine
          }
          else {
            newKeyConflicts = true
            break
          }
        }
        if(newKeyConflicts) {
          firstRez.unsupported.push(ora)
          found = true
          break
        }
        firstRez.ore.delete(key)
        firstRez.ore.set(newKey, [ora, ...value])
        found = true
        break
      }
      // inclusion case has been treated above, moving to the next case: no conflict
      if(oraHour.end <= keyHour.start || oraHour.start >= keyHour.end) {
        // everything is fine, but we must continue checking for other conflicts
        continue
      }
      // if we are here, the conflict is not supported
      firstRez.unsupported.push(ora)
      found = true
      break
    }
    if(!found) {
      firstRez.ore.set(convertToDateInterval(ora), [ora])
    }
  }
  // change Date key to DateINterval key
  const rez = {ore: new Map<DateInterval, BaseOra[]>(), unsupported: firstRez.unsupported, maxConflicts: 0}
  for(const [key, value] of firstRez.ore) {
    const keyData = convertFromDateInterval(key)
    const keyLimit = {
      firstHour: parseInt(keyData.hourStart),
      firstMinute: parseInt(keyData.minuteStart),
      lastHour: parseInt(keyData.hourEnd),
      lastMinute: parseInt(keyData.minuteEnd)
    }
    rez.ore.set(keyLimit, value.sort(getOraPriority))
    rez.maxConflicts = Math.max(rez.maxConflicts, value.length)
  }
  return rez
}

export const createHoursBlocks = (dateLimit: DateInterval, hoursInBlock = 2): HourBlock => {
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

export const getOraDuration = (ora: BaseOra): number => { // returns the duration in hours
  const start = parseInt(ora.hourStart) + parseInt(ora.minuteStart) / 60
  const end = parseInt(ora.hourEnd) + parseInt(ora.minuteEnd) / 60
  return end - start
}