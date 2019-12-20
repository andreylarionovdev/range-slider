import SliderViewExtraData from './SliderViewExtraData';
import State from './State';

export default interface SliderModelWithState {
  getState(): State;
  setState(state: State): this;
  updateState(key: string, value: null|number|boolean, extra?: SliderViewExtraData): this;
  onChangeState(callback: (state: State) => void): void;
  onChangeValue(callback: (state: State) => void): void;
}
