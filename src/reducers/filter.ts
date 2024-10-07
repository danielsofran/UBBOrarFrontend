import {defaultFilterData, FilterData} from "../model/filter"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"

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
      state.filterData.semigrupa = action.payload.semigrupa ?? state.filterData.semigrupa
      state.filterData.ziua = action.payload.ziua ?? state.filterData.ziua
      state.filterData.lastSaptamanaCaptured = action.payload.lastSaptamanaCaptured ?? state.filterData.lastSaptamanaCaptured
    }
  }
})

export const {setFilterData} = filterSlice.actions
export default filterSlice.reducer
export const filterDataSelector = (state: RootState): FilterData => state.filter.filterData