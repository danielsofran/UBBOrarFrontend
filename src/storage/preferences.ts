import {Preferences} from "@capacitor/preferences"
import {Preferences as PreferencesModel} from "../model/preferences"

export const getPreferencesFromStorage = async (): Promise<PreferencesModel> => {
  return await Preferences.get({ key: 'preferences' }).then(data => {
    if (!data.value)
      throw new Error('Preferences not found')
    return JSON.parse(data.value)
  })
}

export const savePreferencesToStorage = async (data: any) => {
  await Preferences.set({ key: 'preferences', value: JSON.stringify(data) })
}

export const clearPreferencesFromStorage = async () => {
  await Preferences.remove({ key: 'preferences' })
}