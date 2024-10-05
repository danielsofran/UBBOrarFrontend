export enum Ziua {
  LUNI = "Luni",
  MARTI = "Marți",
  MIERCURI = "Miercuri",
  JOI = "Joi",
  VINERI = "Vineri",
  SAMBATA = "Sâmbătă",
  DUMINICA = "Duminică"
}

export enum Tip {
  CURS = "Curs",
  SEMINAR = "Seminar",
  LABORATOR = "Laborator"
}

export interface BaseOra {
  ziua: Ziua
  hourStart: string
  minuteStart: string
  hourEnd: string
  minuteEnd: string
  saptamana?: "1" | "2" | " "
  hidden: boolean
}

export interface Ora extends BaseOra {
  numeMaterie: string
  tip: Tip
  sala: string
  profesor: string
  formatie: string
}

export interface Source {
  an: string
  semestru: string
  grupa: string
}

export interface OrarGrupa {
  ore: Ora[]
  source: Source
}

export interface CustomOra extends BaseOra {
  title: string
  details: string
}

export enum OraType {
  FACULTATE,
  PERSONAL
}

export interface Orar {
  mainOrar: OrarGrupa
  orareSuplimentare: OrarGrupa[]
  orePersonale: CustomOra[]
  lastUpdate?: Date
}