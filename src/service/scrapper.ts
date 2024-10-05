import {Orar, Source} from "../model/orar"
import {parseOrarHtml} from "./parser"

const buildUrl = (source: Source) => {
  return `https://horatiu-udrea.github.io/cs-ubb-timetable-parser/${source.an}-${source.semestru}/${source.grupa}.html`
}

export async function fetchOrar(an: string | number, semestru: string | number, grupa: string | number): Promise<Orar> {
  const source = {an: an.toString(), semestru: semestru.toString(), grupa: grupa.toString()}
  console.info('fetching orar', source)
  return await fetch(buildUrl(source)).then(response => response.text()).then((html) => parseOrarHtml(html, source))
}