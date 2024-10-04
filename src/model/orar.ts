import {formatDatePart, getAcademicYear, getSemester} from "../service/utils"

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

class ParsedOra {
  ziua: Ziua
  timeStart: Date
  timeEnd: Date
  saptamana?: "1" | "2" | undefined
  numeMaterie: string
  tip: Tip
  sala: string
  profesor: string
  formatie: string

  get timeText() {
    const oraStart = formatDatePart(this.timeStart.getHours())
    const oraEnd = formatDatePart(this.timeEnd.getHours())
    const minutStart = formatDatePart(this.timeStart.getMinutes())
    const minutEnd = formatDatePart(this.timeEnd.getMinutes())
    return `${oraStart}:${minutStart} - ${oraEnd}:${minutEnd}`
  }

  get timeStartText() {
    const hour = formatDatePart(this.timeStart.getHours())
    const minute = formatDatePart(this.timeStart.getMinutes())
    return `${hour}:${minute}`
  }

  get timeEndText() {
    const hour = formatDatePart(this.timeEnd.getHours())
    const minute = formatDatePart(this.timeEnd.getMinutes())
    return `${hour}:${minute}`
  }

  set timeText(value: string) {
    const timeText = value.replaceAll(' ', '').split('-')
    const timeStart = timeText ? timeText[0].split(':') : ['0', '0']
    const timeEnd = timeText ? timeText[1].split(':') : ['0', '0']
    this.timeStart = new Date(0, 0, 0, parseInt(timeStart[0]), parseInt(timeStart[1]))
    this.timeEnd = new Date(0, 0, 0, parseInt(timeEnd[0]), parseInt(timeEnd[1]))
  }
}

export class Source {
  an: string = getAcademicYear()
  semestru: string = getSemester()
  grupa: string = ""

  constructor(an: string, semestru: string, grupa: string) {
    this.an = an
    this.semestru = semestru
    this.grupa = grupa
  }

  get url() {
    return `https://horatiu-udrea.github.io/cs-ubb-timetable-parser/${this.an}-${this.semestru}/${this.grupa}.html`
  }
}

export class Ora extends ParsedOra {
  hidden: boolean = false
}

export class Orar {
  ore: Ora[]
  sources: Source[]
  lastUpdate: Date

  get lastUpdateText() {
    const day = formatDatePart(this.lastUpdate.getDate())
    const month = formatDatePart(this.lastUpdate.getMonth())
    const year = this.lastUpdate.getFullYear()
    return `${day}.${month}.${year}`
  }

  get materii() {
    const materii = this.ore.map(ora => ora.numeMaterie)
    return [...new Set(materii)].sort()
  }

  getOrarByDay(day: Ziua) {
    return this.ore.filter(ora => ora.ziua === day)
  }

  getOrarByWeek(week: 1 | 2 | undefined) {
    return this.ore.filter(ora => ora.saptamana === week)
  }
}