import {BaseOra, OraType} from "../model/orar"
import {getOraType} from "../service/orarUtils"
import {OraFacultateCell} from "./OraFacultateCell"

interface OraCellProps {
  ora: BaseOra
  flex?: number
  compact?: boolean
}

export const OraCell = (props: OraCellProps) => {
  const type = getOraType(props.ora)

  if(type === OraType.FACULTATE)
    return <OraFacultateCell {...props} />

  return null
}