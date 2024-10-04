import {Ora, Orar, Source, Tip, Ziua} from "../model/orar"

export const parseOrarHtml = (html: string, source: Source): Orar => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const table = doc.querySelector('tbody')
  if (!table)
    throw new Error('Invalid HTML')
  const rows = Array.from(table.querySelectorAll('tr'))
  const ore: Ora[] = rows.map(row => {
    const cells = Array.from(row.querySelectorAll('td'))
    const ora = new Ora()
    ora.ziua = cells[0].textContent as Ziua
    ora.timeText = cells[1].textContent
    ora.saptamana = cells[2].textContent === '' ? undefined : cells[2].textContent as "1" | "2"
    ora.numeMaterie = cells[3].textContent
    ora.tip = cells[4].textContent as Tip
    ora.sala = cells[5].textContent
    ora.profesor = cells[6].textContent
    ora.formatie = cells[7].textContent
    return ora
  })
  // find the text after "Ultima actualizare: (date)"
  const lastUpdateText = doc.body.textContent.match(/Ultima actualizare: (\d{1,2}.\d{1,2}.\d{4})/)
  if (!lastUpdateText)
    throw new Error('Invalid HTML')
  if(!lastUpdateText[1])
    throw new Error('Invalid HTML')
  const lastUpdate = new Date(lastUpdateText[1])
  const orar = new Orar()
  orar.ore = ore
  orar.sources = [source]
  orar.lastUpdate = lastUpdate
  return orar
}