import {Orar} from "../model/orar"
import {parseHtml} from "./parser"

const buildUrl = (an: string, semestru: string, grupa: string) => {
  return `https://horatiu-udrea.github.io/cs-ubb-timetable-parser/${an}-${semestru}/${grupa}.html`
}

export async function fetchOrar(an: string | number, semestru: string | number, grupa: string | number): Promise<Orar> {
  const url = buildUrl(an.toString(), semestru.toString(), grupa.toString())
  if (!url)
    throw new Error('Invalid URL')
  return await fetch(url).then(response => response.text()).then(parseHtml)
}