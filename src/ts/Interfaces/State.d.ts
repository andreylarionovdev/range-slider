export default interface State {
  orientation?: string,
  min?: number,
  max?: number,
  step?: number,
  values?: Array<number>,
  range?: boolean,
  showConfig?: boolean,
  onChange?: null | Function,
  onBlur?: null | Function
}