import { Preferences } from '@capacitor/preferences'
import {OrarDataProps} from "../reducers/orarData"

export const getOrarDataFromStorage = async (): Promise<OrarDataProps> => {
    return await Preferences.get({ key: 'orarData' }).then(data => {
        if (!data.value)
            return null
        let orarData = JSON.parse(data.value)
        orarData = {...orarData, orar: {...orarData.orar, lastUpdate: new Date(orarData.orar.lastUpdate)}}
        return orarData
    })
}

export const saveOrarDataToStorage = async (data: any) => {
    await Preferences.set({ key: 'orarData', value: JSON.stringify(data) })
}

export const clearOrarDataFromStorage = async () => {
    await Preferences.remove({ key: 'orarData' })
}


