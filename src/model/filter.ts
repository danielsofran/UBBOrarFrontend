import {Tip, Ziua} from "./orar"
import {dateToZiua} from "../service/utils"

export interface FilterData {
  ziua: Ziua
  saptamana: "1" | "2" | " "
  semigrupa: "1" | "2" | " "
  tip: Tip | " "
  // metadata
  lastSaptamanaCaptured: Date
}

export const defaultFilterData: FilterData = {
  ziua: dateToZiua(new Date()),
  saptamana: "1",
  lastSaptamanaCaptured: new Date(),
  tip: " ",
  semigrupa: " "
}

export const updateData = (filterData: FilterData) => {
  const now = new Date()
  const lastMondayBeforeTimeCaptured = new Date(filterData.lastSaptamanaCaptured)
  lastMondayBeforeTimeCaptured.setDate(lastMondayBeforeTimeCaptured.getDate() - lastMondayBeforeTimeCaptured.getDay() + 1)
  lastMondayBeforeTimeCaptured.setHours(0, 0, 0, 0)
  const diff = now.getTime() - lastMondayBeforeTimeCaptured.getTime()
  if(diff > 7 * 24 * 60 * 60 * 1000) {
    return {
      ...filterData,
      ziua: dateToZiua(now),
      saptamana: filterData.saptamana === "1" ? "2" : "1",
      lastSaptamanaCaptured: now
    }
  }
  return filterData
}