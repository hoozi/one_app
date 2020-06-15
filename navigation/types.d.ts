export type RootStackParamList = {
  Home: undefined,
  Login: undefined,
  Account: undefined,
  SignOutPlaceholder: undefined,
  SelectPosition: undefined
}
export type ROOT_NAME_TYPE = keyof RootStackParamList;
export interface IInitialState {
  token?: string | null,
  signing?: boolean,
  isPlaceholder?: boolean,
  drawerOpen?: boolean,
  user?:{}
}