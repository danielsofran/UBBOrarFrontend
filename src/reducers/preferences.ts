import {Preferences} from "../model/preferences"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"

export const initialPreferences = {
  darkMode: true,
  colorCurs: 'danger',
  colorSeminar: 'warning',
  colorLaborator: 'success',
  colorPersonal: 'quaternary',
  colorMarker: 'primary',
  oneHourHeight: 8,
} as Preferences

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState: initialPreferences,
  reducers: {
    setPreferences: (state, action: PayloadAction<Preferences>) => {
      if(!action.payload)
        return
      // return action.payload
      state.darkMode = action.payload.darkMode ?? state.darkMode
      state.colorCurs = action.payload.colorCurs ?? state.colorCurs
      state.colorSeminar = action.payload.colorSeminar ?? state.colorSeminar
      state.colorLaborator = action.payload.colorLaborator ?? state.colorLaborator
      state.colorPersonal = action.payload.colorPersonal ?? state.colorPersonal
      state.colorMarker = action.payload.colorMarker ?? state.colorMarker
      state.oneHourHeight = action.payload.oneHourHeight ?? state.oneHourHeight
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload
    },
  }
})

export const {setPreferences, setDarkMode} = preferencesSlice.actions
export default preferencesSlice.reducer
export const preferencesSelector = (state: RootState): Preferences => state.preferences