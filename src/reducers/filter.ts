import {defaultFilterData, FilterData} from "../model/filter"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"
import {dateToZiua, ziuaToDayOfWeek} from "../service/utils"
import {Ziua} from "../model/orar"

const initialState = {
  filterData: defaultFilterData,
}

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilterData: (state, action: PayloadAction<FilterData>) => {
      if(!action.payload)
        return
      state.filterData.tip = action.payload.tip ?? state.filterData.tip
      state.filterData.saptamana = action.payload.saptamana ?? state.filterData.saptamana
      state.filterData.formatii = action.payload.formatii ?? state.filterData.formatii
      state.filterData.ziua = action.payload.ziua ?? state.filterData.ziua
      state.filterData.lastSaptamanaCaptured = action.payload.lastSaptamanaCaptured ?? state.filterData.lastSaptamanaCaptured
    },
    setFilterDay: (state, action: PayloadAction<Date>) => {
      const ziua = dateToZiua(action.payload)
      state.filterData.ziua = ziua
    }
  }
})

export const {setFilterData, setFilterDay} = filterSlice.actions
export default filterSlice.reducer
export const filterDataSelector = (state: RootState): FilterData => {
  const data = state.filter.filterData
  if(data.ziua === Ziua.SAMBATA || data.ziua === Ziua.DUMINICA)
    return {...data, ziua: Ziua.LUNI}
  return data
}