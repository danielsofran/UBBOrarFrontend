import {Ora, OrarGrupa, Source, Tip, Ziua} from "../model/orar"

export interface ParseResult {
  orar: OrarGrupa
  lastUpdate: Date
}

export const parseOrarHtml = (html: string, source: Source, defaultOraHidden: boolean): ParseResult => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const table = doc.querySelector('tbody')
  if (!table)
    throw new Error('Invalid HTML')
  const rows = Array.from(table.querySelectorAll('tr'))
  const ore: Ora[] = rows.map(row => {
    const cells = Array.from(row.querySelectorAll('td'))
    const timeText = cells[1].textContent.replaceAll(' ', '')?.split('-')
    if (!timeText)
      throw new Error('Invalid HTML')
    const timeStart = timeText[0].split(':')
    const timeEnd = timeText[1].split(':')
    const saptamana = cells[2].textContent.replaceAll(String.fromCharCode(160), " ")
    const rez = {
      ziua: cells[0].textContent as Ziua,
      hourStart: timeStart[0],
      minuteStart: timeStart[1],
      hourEnd: timeEnd[0],
      minuteEnd: timeEnd[1],
      saptamana: saptamana,
      numeMaterie: cells[3].textContent,
      tip: cells[4].textContent as Tip,
      sala: cells[5].textContent,
      profesor: cells[6].textContent,
      formatie: cells[7].textContent,
      hidden: defaultOraHidden
    } as Ora
    return rez
  })
  // find the text after "Ultima actualizare: (date)"
  const lastUpdateText = doc.body.textContent.match(/Ultima actualizare: (\d{1,2}.\d{1,2}.\d{4})/)
  if (!lastUpdateText)
    throw new Error('Invalid HTML')
  if(!lastUpdateText[1])
    throw new Error('Invalid HTML')
  const lastUpdate = new Date()
  lastUpdate.setDate(parseInt(lastUpdateText[1].split('.')[0]))
  lastUpdate.setMonth(parseInt(lastUpdateText[1].split('.')[1]))
  lastUpdate.setFullYear(parseInt(lastUpdateText[1].split('.')[2]))
  return {
    orar: {
      ore,
      source
    },
    lastUpdate
  }
}