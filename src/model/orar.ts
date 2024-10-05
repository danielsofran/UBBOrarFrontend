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

interface ParsedOra {
  ziua: Ziua
  hourStart: string
  minuteStart: string
  hourEnd: string
  minuteEnd: string
  saptamana?: "1" | "2" | " "
  numeMaterie: string
  tip: Tip
  sala: string
  profesor: string
  formatie: string
}

export interface Ora extends ParsedOra {
  hidden: boolean
}

export interface Source {
  an: string
  semestru: string
  grupa: string
}

export interface Orar {
  ore: Ora[]
  sources: Source[]
  lastUpdate: Date
}