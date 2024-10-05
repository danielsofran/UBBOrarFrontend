import {formatDatePart} from "./utils"
import {Ora, Orar} from "../model/orar"

export enum MaterieHiddenState {
  CHECKED = "checked",
  UNCHECKED = "unchecked",
  INDETERMINATE = "indeterminate"
}

export const getLastUpdateText = (orar: Orar) => {
  const day = formatDatePart(orar.lastUpdate.getDate())
  const month = formatDatePart(orar.lastUpdate.getMonth())
  const year = orar.lastUpdate.getFullYear()
  return `${day}.${month}.${year}`
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

export const getMaterii = (orar: Orar) => {
  const materii = orar.ore.map(ora => ora.numeMaterie)
  return [...new Set(materii)].sort()
}

export const getMaterieCheckedState = (orar: Orar, materie: string) => {
  const ore = orar.ore.filter((ora) => ora.numeMaterie === materie)
  const isCheck = ore.every((ora) => !ora.hidden)
  const isUncheck = ore.every((ora) => ora.hidden)
  const rez = isCheck ? MaterieHiddenState.CHECKED : isUncheck ? MaterieHiddenState.UNCHECKED : MaterieHiddenState.INDETERMINATE
  return rez
}

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