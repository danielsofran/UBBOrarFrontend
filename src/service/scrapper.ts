import {Orar, Source} from "../model/orar"
import {parseOrarHtml} from "./parser"

const buildUrl = (an: string, semestru: string, grupa: string) => {
  return `https://horatiu-udrea.github.io/cs-ubb-timetable-parser/${an}-${semestru}/${grupa}.html`
}

export async function fetchOrar(an: string | number, semestru: string | number, grupa: string | number): Promise<Orar> {
  const source = new Source(an.toString(), semestru.toString(), grupa.toString())
  return await fetch(source.url).then(response => response.text()).then((html) => parseOrarHtml(html, source))
}