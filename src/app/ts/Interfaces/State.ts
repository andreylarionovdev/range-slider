interface State {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  value2?: null|number;
  isRange?: boolean;
  isVertical?: boolean;
  showBubble?: boolean;
  showGrid?: boolean;
  showBar?: boolean;
  gridDensity?: number;
  onCreate?: (state: this) => void;
  onChange?: (state: this) => void;
}

export default State;
