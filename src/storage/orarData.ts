import { Preferences } from '@capacitor/preferences'
import {Orar} from "../model/orar"

export const getOrarDataFromStorage = async (): Promise<Orar> => {
  return await Preferences.get({ key: 'orarData' }).then(data => {
    if (!data.value)
      throw new Error('Orar data not found')
    let orarData = JSON.parse(data.value)
    let lastUpdate = new Date(), tokens = orarData.lastUpdate.split('.')
    lastUpdate.setDate(parseInt(tokens[0]))
    lastUpdate.setMonth(parseInt(tokens[1]))
    lastUpdate.setFullYear(parseInt(tokens[2]))
    orarData = {...orarData, lastUpdate: lastUpdate}
    return orarData
  })
}

export const saveOrarDataToStorage = async (data: any) => {
  data.lastUpdate = `${data.lastUpdate.getDate()}.${data.lastUpdate.getMonth()}.${data.lastUpdate.getFullYear()}`
  await Preferences.set({ key: 'orarData', value: JSON.stringify(data) })
}

export const clearOrarDataFromStorage = async () => {
  await Preferences.remove({ key: 'orarData' })
}


