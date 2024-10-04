
export enum Ziua {
  LUNI = "Luni",
  MARTI = "Marti",
  MIERCURI = "Miercuri",
  JOI = "Joi",
  VINERI = "Vineri",
  SAMBATA = "Sambata",
  DUMINICA = "Duminica"
}

export enum Tip {
  CURS = "Curs",
  SEMINAR = "Seminar",
  LABORATOR = "Laborator"
}

export class Ora {
  ziua: Ziua
  timeStart: Date
  timeEnd: Date
  saptamana?: 1 | 2
  numeMaterie: string
  tip: Tip
  sala: string
  profesor: string
  formatie: string

  get timeText() {
    const oraStart = Ora.formatDatePart(this.timeStart.getHours())
    const oraEnd = Ora.formatDatePart(this.timeEnd.getHours())
    const minutStart = Ora.formatDatePart(this.timeStart.getMinutes())
    const minutEnd = Ora.formatDatePart(this.timeEnd.getMinutes())
    return `${oraStart}:${minutStart} - ${oraEnd}:${minutEnd}`
  }

  get timeStartText() {
    const hour = Ora.formatDatePart(this.timeStart.getHours())
    const minute = Ora.formatDatePart(this.timeStart.getMinutes())
    return `${hour}:${minute}`
  }

  get timeEndText() {
    const hour = Ora.formatDatePart(this.timeEnd.getHours())
    const minute = Ora.formatDatePart(this.timeEnd.getMinutes())
    return `${hour}:${minute}`
  }

  set timeText(value: string) {
    const timeText = value.replaceAll(' ', '').split('-')
    const timeStart = timeText ? timeText[0].split(':') : ['0', '0']
    const timeEnd = timeText ? timeText[1].split(':') : ['0', '0']
    this.timeStart = new Date(0, 0, 0, parseInt(timeStart[0]), parseInt(timeStart[1]))
    this.timeEnd = new Date(0, 0, 0, parseInt(timeEnd[0]), parseInt(timeEnd[1]))
  }

  private static formatDatePart(part: number) {
    return part.toString().padStart(2, '0')
  }
}

export class OraSuplimentara {
  ora: Ora
  source: {

  }
}

export class Orar {
  orar: Ora[]
  lastUpdate: Date
}