import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {getAcademicYear, getSemester} from "../service/utils"
import {Ora, Orar} from "../model/orar"
import {fetchOrar} from "../service/scrapper"
import {RootState} from "../store"

interface OrarData {
  an?: number
  semestru?: number
  grupa?: string
  semigroupa?: string
  orar?: Orar,
  oreAdaugate?: Ora[],
  oreSterse?: Ora[]
}

const initialState = {
  an: getAcademicYear(),
  semestru: getSemester(),
  grupa: "211",
  semigroupa: null,
  orar: null
} as OrarData

export const orarDataSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setOrarData: (state, action: PayloadAction<OrarData>) => {
      state.an = action.payload.an || state.an
      state.semestru = action.payload.semestru || state.semestru
      state.grupa = action.payload.grupa || state.grupa
      state.semigroupa = action.payload.semigroupa || state.semigroupa
      // const orarShouldBeFetched = !state.orar || state.an !== action.payload.an || state.semestru !== action.payload.semestru || state.grupa !== action.payload.grupa
      // if(orarShouldBeFetched) {
      //   fetchOrar(state.an, state.semestru, state.grupa).then(orar => {
      //     state.orar = orar
      //   })
      // }
    }
  }
})

export const {setOrarData} = orarDataSlice.actions
export default orarDataSlice.reducer
export const orarDataSelector = (state: RootState) => state.orarData