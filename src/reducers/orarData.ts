import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { Orar, OrarGrupa} from "../model/orar"
import {RootState} from "../store"
import {getAcademicYear, getSemester} from "../service/orarUtils"

const initialState = {
  mainOrar: {
    ore: [],
    source: {an: getAcademicYear(), semestru: getSemester(), grupa: ""},
  } as OrarGrupa,
  orareSuplimentare: [],
  orePersonale: []
} as Orar

export const orarDataSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setOrarData: (state, action: PayloadAction<Orar>) => {
      if(!action.payload)
        return
      // state.mainOrar = action.payload.mainOrar
      // state.orareSuplimentare = action.payload.orareSuplimentare
      // state.orePersonale = action.payload.orePersonale
      // state.lastUpdate = action.payload.lastUpdate
      return action.payload
    }
  }
})

export const {setOrarData} = orarDataSlice.actions
export default orarDataSlice.reducer
export const orarDataSelector = (state: RootState): Orar => state.orarData