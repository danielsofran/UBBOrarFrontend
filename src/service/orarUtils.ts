import {formatDatePart} from "./utils"
import {BaseOra, CustomOra, Ora, Orar, OrarGrupa, OraType, Ziua} from "../model/orar"
import {DateInterval} from "./orarGridUtils"

export enum MaterieHiddenState {
  CHECKED = "checked",
  UNCHECKED = "unchecked",
  INDETERMINATE = "indeterminate"
}

// gettters

export const getAn = (orar: Orar) => orar.mainOrar.source.an
export const getSemestru = (orar: Orar) => orar.mainOrar.source.semestru
export const getGrupa = (orar: Orar) => orar.mainOrar.source.grupa

export const getLastUpdateText = (orar: Orar) => {
  if(!orar.lastUpdate)
    return ""
  const day = formatDatePart(orar.lastUpdate.getDate())
  const month = formatDatePart(orar.lastUpdate.getMonth())
  const year = orar.lastUpdate.getFullYear()
  return `${day}.${month}.${year}`
}

export const getMaterii = (orar: OrarGrupa) => {
  const materii = orar.ore.map(ora => ora.numeMaterie)
  return [...new Set(materii)].sort()
}

export const getMaterieCheckedState = (orar: OrarGrupa, materie: string) => {
  const ore = orar.ore.filter((ora) => ora.numeMaterie === materie)
  const isCheck = ore.every((ora) => !ora.hidden)
  const isUncheck = ore.every((ora) => ora.hidden)
  const rez = isCheck ? MaterieHiddenState.CHECKED : isUncheck ? MaterieHiddenState.UNCHECKED : MaterieHiddenState.INDETERMINATE
  return rez
}

export const getOrarOreFacultate = (orar: Orar): Ora[] => {
  const ore = orar.mainOrar.ore
  for (const orarSuplimentar of orar.orareSuplimentare)
    ore.push(...orarSuplimentar.ore)
  return ore
}

export const getOrarOre = (orar: Orar): BaseOra[] => {
  const ore: BaseOra[] = getOrarOreFacultate(orar)
  for (const oraPersonal of orar.orePersonale)
    ore.push(oraPersonal)
  return ore
}

export const getOraType = (ora: BaseOra): OraType => {
  return ora.hasOwnProperty("numeMaterie") ? OraType.FACULTATE : OraType.PERSONAL
}

export const getDateStart = (ora: BaseOra): Date => {
  const date = new Date()
  date.setHours(parseInt(ora.hourStart), parseInt(ora.minuteStart))
  return date
}

// setters

export const setAn = (orar: Orar, an: string) => {
  return {...orar, mainOrar: {...orar.mainOrar, source: {...orar.mainOrar.source, an}}}
}

export const setSemestru = (orar: Orar, semestru: string) => {
  return {...orar, mainOrar: {...orar.mainOrar, source: {...orar.mainOrar.source, semestru}}}
}

export const setGrupa = (orar: Orar, grupa: string) => {
  return {...orar, mainOrar: {...orar.mainOrar, source: {...orar.mainOrar.source, grupa}}}
}

export const setOrar = (orar: Orar, orarGrupa: OrarGrupa, lastUpdate?: Date): Orar => {
  return {...orar, mainOrar: orarGrupa, lastUpdate}
}

export const setMaterieHidden = (orarGrupa: OrarGrupa, materie: string, hidden: boolean) => {
  const ore = orarGrupa.ore.map(ora => ora.numeMaterie === materie ? {...ora, hidden} : ora)
  return {...orarGrupa, ore}
}

export const setOraHidden = (orarGrupa: OrarGrupa, ora: Ora, hidden: boolean) => {
  const ore = orarGrupa.ore.map(item => ora === item ? {...item, hidden} : item)
  return {...orarGrupa, ore}
}

// props

export const orarExists = (orar: Orar): boolean => {
  if (!orar)
    return false
  return orar.mainOrar.ore.length > 0 ||
    orar.orareSuplimentare.length > 0 ||
    orar.orePersonale.length > 0
}

export const orarAnSemestruExists = (orar: Orar): boolean => {
  return orar.mainOrar.source.an !== "" && orar.mainOrar.source.semestru !== ""
}

export const orarSourceExists = (orar: Orar): boolean => {
  return orarAnSemestruExists(orar) && orar.mainOrar.source.grupa !== ""
}

export const orarFirstLastHourInDay = (ore: BaseOra[]): DateInterval | undefined => {
  if (ore.length === 0)
    return
  let firstHour = ore[0].hourStart, lastHour = ore[0].hourEnd, firstMinute = ore[0].minuteStart, lastMinute = ore[0].minuteEnd
  for (const ora of ore) {
    if (ora.hourStart < firstHour || (ora.hourStart === firstHour && ora.minuteStart < firstMinute)) {
      firstHour = ora.hourStart
      firstMinute = ora.minuteStart
    }
    if (ora.hourEnd > lastHour || (ora.hourEnd === lastHour && ora.minuteEnd > lastMinute)) {
      lastHour = ora.hourEnd
      lastMinute = ora.minuteEnd
    }
  }
  return {
    firstHour: parseInt(firstHour),
    firstMinute: parseInt(firstMinute),
    lastHour: parseInt(lastHour),
    lastMinute: parseInt(lastMinute)
  }
}

export const oraStartsBefore = (ora: BaseOra, hour: number, minute: number = 0): boolean => {
  return parseInt(ora.hourStart) < hour || (parseInt(ora.hourStart) === hour && parseInt(ora.minuteStart) < minute)
}


// equals

export const equalsOra = (ora1: Ora, ora2: Ora): boolean => {
  return ora1.ziua === ora2.ziua &&
    ora1.hourStart === ora2.hourStart &&
    ora1.minuteStart === ora2.minuteStart &&
    ora1.hourEnd === ora2.hourEnd &&
    ora1.minuteEnd === ora2.minuteEnd &&
    ora1.saptamana === ora2.saptamana &&
    ora1.numeMaterie === ora2.numeMaterie &&
    ora1.tip === ora2.tip &&
    ora1.sala === ora2.sala &&
    ora1.profesor === ora2.profesor &&
    ora1.formatie === ora2.formatie &&
    ora1.hidden === ora2.hidden
}

export const equalsCustomOra = (ora1: CustomOra, ora2: CustomOra): boolean => {
  return ora1.ziua === ora2.ziua &&
    ora1.hourStart === ora2.hourStart &&
    ora1.minuteStart === ora2.minuteStart &&
    ora1.hourEnd === ora2.hourEnd &&
    ora1.minuteEnd === ora2.minuteEnd &&
    ora1.title === ora2.title &&
    ora1.details === ora2.details &&
    ora1.hidden === ora2.hidden
}

export const  equalsOrarSource = (orar1: Orar, orar2: Orar): boolean => {
  return orar1.mainOrar.source.an === orar2.mainOrar.source.an && orar1.mainOrar.source.semestru === orar2.mainOrar.source.semestru && orar1.mainOrar.source.grupa === orar2.mainOrar.source.grupa
}

export const equalsOrarGrupa = (orar1: OrarGrupa, orar2: OrarGrupa): boolean => {
  if(orar1.source.an !== orar2.source.an)
    return false
  if(orar1.source.semestru !== orar2.source.semestru)
    return false
  if(orar1.source.grupa !== orar2.source.grupa)
    return false
  if (orar1.ore.length !== orar2.ore.length)
    return false
  for (let i = 0; i < orar1.ore.length; i++)
    if (!equalsOra(orar1.ore[i], orar2.ore[i]))
      return false
  return true
}

export const equalsOrar = (orar1: Orar, orar2: Orar): boolean => {
  if(orar1.mainOrar.ore.length !== orar2.mainOrar.ore.length)
    return false
  if(orar1.orareSuplimentare.length !== orar2.orareSuplimentare.length)
    return false
  if(orar1.orePersonale.length !== orar2.orePersonale.length)
    return false
  if(!equalsOrarGrupa(orar1.mainOrar, orar2.mainOrar))
    return false
  for(let i = 0; i < orar1.orareSuplimentare.length; i++)
    if(!equalsOrarGrupa(orar1.orareSuplimentare[i], orar2.orareSuplimentare[i]))
      return false
  for(let i = 0; i < orar1.orePersonale.length; i++)
    if(!equalsCustomOra(orar1.orePersonale[i], orar2.orePersonale[i]))
      return false
  return true
}