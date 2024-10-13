import {Source} from "../model/orar"
import {parseOrarHtml, ParseResult} from "./parser"

const buildUrl = (source: Source) => {
  return `https://horatiu-udrea.github.io/cs-ubb-timetable-parser/${source.an}-${source.semestru}/${source.grupa}.html`
}

export async function fetchOrar(source: Source, defaultOraHidden = false): Promise<ParseResult> {
  console.info('fetching orar', source)
  return await fetch(buildUrl(source)).then(response => response.text()).then((html) => parseOrarHtml(html, source, defaultOraHidden))
}