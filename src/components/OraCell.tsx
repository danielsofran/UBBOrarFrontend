import {BaseOra, Ora, OraType} from "../model/orar"
import {getOraType} from "../service/orarUtils"
import {OraFacultateCell} from "./OraFacultateCell"

interface OraCellProps {
  ora: BaseOra
  compact?: boolean
}

export const OraCell = (props: OraCellProps) => {
  const type = getOraType(props.ora)

  if(type === OraType.FACULTATE)
    return <OraFacultateCell ora={props.ora as Ora} compact={props.compact} />

  return null
}