import {FilterMenu, NavigationState} from "../model/navigation"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"

const initialState = {
  title: "Orar UBB",
  showSOSButton: false,
  filterMenu: undefined
} as NavigationState

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentTab: (state, action: PayloadAction<NavigationState>) => {
      if(!action.payload)
        return
      state.title = action.payload.title
      state.showSOSButton = action.payload.showSOSButton ?? initialState.showSOSButton
      state.filterMenu = action.payload.filterMenu ?? initialState.filterMenu
    }
  }
})

export const {setCurrentTab} = navigationSlice.actions
export default navigationSlice.reducer
export const navigationSelector = (state: RootState): NavigationState => state.navigation
