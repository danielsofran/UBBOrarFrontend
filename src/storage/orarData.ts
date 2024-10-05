import { Preferences } from '@capacitor/preferences'
import {Orar} from "../model/orar"

export const getOrarDataFromStorage = async (): Promise<Orar> => {
    return await Preferences.get({ key: 'orarData' }).then(data => {
        if (!data.value)
            return null
        let orarData = JSON.parse(data.value)
        orarData = {...orarData, lastUpdate: new Date(orarData.lastUpdate)}
        return orarData
    })
}

export const saveOrarDataToStorage = async (data: any) => {
    await Preferences.set({ key: 'orarData', value: JSON.stringify(data) })
}

export const clearOrarDataFromStorage = async () => {
    await Preferences.remove({ key: 'orarData' })
}


