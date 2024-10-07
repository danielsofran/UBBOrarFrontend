import {Preferences} from '@capacitor/preferences'
import {defaultFilterData, FilterData} from "../model/filter"

export const getFilterDataFromStorage = async (): Promise<FilterData> => {
  const filterData = await Preferences.get({key: 'filterData'})
  if(!filterData.value)
    return defaultFilterData
  const rez: FilterData = JSON.parse(filterData.value)
  return {...rez, lastSaptamanaCaptured: new Date(rez.lastSaptamanaCaptured)}
}

export const saveFilterDataToStorage = async (filterData: FilterData) => {
  await Preferences.set({key: 'filterData', value: JSON.stringify(filterData)})
}

export const clearFilterData = async () => {
  await Preferences.remove({key: 'filterData'})
}