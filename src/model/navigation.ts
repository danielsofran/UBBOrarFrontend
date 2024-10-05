
export enum FilterMenu {
  ORAR_ZI,
  ORAR_SAPTAMANA,
}

export interface NavigationState {
  title: string,
  showSOSButton: boolean,
  filterMenu?: FilterMenu
}