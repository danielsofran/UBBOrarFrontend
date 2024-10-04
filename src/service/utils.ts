export const getAcademicYear = () => {
  const date = new Date()
  const month = date.getMonth()
  const year = date.getFullYear()
  if (month >= 9)
    return year
  return year - 1
}

export const getSemester = () => {
  const date = new Date()
  const month = date.getMonth()
  if (month >= 9 || month < 2)
    return 1
  return 2
}