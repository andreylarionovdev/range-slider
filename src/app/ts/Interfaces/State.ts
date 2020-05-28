interface State {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  value2?: null|number;
  range?: boolean;
  vertical?: boolean;
  showBubble?: boolean;
  showGrid?: boolean;
  gridDensity?: number;
  onCreate?: Function;
  onChange?: Function;
}

export default State;
