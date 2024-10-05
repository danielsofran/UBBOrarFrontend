import {formatDatePart} from "./utils"
import {Ora, Orar, OrarGrupa} from "../model/orar"

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
  console.log(ore)
  return {...orarGrupa, ore}
}

export const setOraHidden = (orarGrupa: OrarGrupa, ora: Ora, hidden: boolean) => {
  const ore = orarGrupa.ore.map(item => ora === item ? {...item, hidden} : item)
  return {...orarGrupa, ore}
}

// props + equals

export const orarExists = (orar: Orar): boolean => {
  if (!orar)
    return false
  const rez =
    orar.mainOrar.ore.length > 0 ||
    orar.orareSuplimentare.length > 0 ||
    orar.orePersonale.length > 0
  return rez
}

export const orarAnSemestruExists = (orar: Orar): boolean => {
  return orar.mainOrar.source.an !== "" && orar.mainOrar.source.semestru !== ""
}

export const orarSourceExists = (orar: Orar): boolean => {
  return orarAnSemestruExists(orar) && orar.mainOrar.source.grupa !== ""
}

export const  equalsOrarSource = (orar1: Orar, orar2: Orar): boolean => {
  return orar1.mainOrar.source.an === orar2.mainOrar.source.an && orar1.mainOrar.source.semestru === orar2.mainOrar.source.semestru && orar1.mainOrar.source.grupa === orar2.mainOrar.source.grupa
}

// date utils

export const getAcademicYear = () => {
  const date = new Date()
  const month = date.getMonth()
  let rez = date.getFullYear()
  if (month < 9)
    rez--
  return rez.toString()
}

export const getSemester = () => {
  const date = new Date()
  const month = date.getMonth()
  if (month >= 9 || month < 2)
    return "1"
  return "2"
}

export const getTimeFormat = (ora: Ora) => {
  return `${ora.hourStart}:${ora.minuteStart} - ${ora.hourEnd}:${ora.minuteEnd}`
}

export const getSaptamanaFormat = (ora: Ora) => {
  if (ora.saptamana === "1")
    return "S1"
  if (ora.saptamana === "2")
    return "S2"
  return "S1/S2"
}