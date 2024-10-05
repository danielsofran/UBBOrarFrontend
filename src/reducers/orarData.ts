import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {Ora, Orar, Source} from "../model/orar"
import {RootState} from "../store"
import {saveOrarDataToStorage} from "../storage/orarData";
import {getAcademicYear, getSemester} from "../service/orarUtils";

export interface OrarDataProps {
  source?: Source
  semigrupa?: string
  orar?: Orar
  oreAdaugate?: Ora[]
  oreSterse?: Ora[]
  oreModificate?: Ora[]
}

const initialState = {
  source: {an: getAcademicYear(), semestru: getSemester(), grupa: ""},
  semigrupa: null,
  orar: null
} as OrarDataProps

export const orarDataSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setOrarData: (state, action: PayloadAction<OrarDataProps>) => {
      if(!action.payload)
        return

      state.source.an = action.payload.source?.an ?? state.source.an
      state.source.semestru = action.payload.source?.semestru ?? state.source.semestru
      state.source.grupa = action.payload.source?.grupa ?? state.source.grupa
      state.semigroupa = action.payload.semigrupa ?? state.semigroupa
      state.orar = action.payload.orar ?? state.orar
    }
  }
})

export const {setOrarData} = orarDataSlice.actions
export default orarDataSlice.reducer
export const orarDataSelector = (state: RootState) => state.orarData