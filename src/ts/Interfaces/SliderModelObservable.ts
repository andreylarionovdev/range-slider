import State from './State';
import Observable from './Observable';

export default interface SliderModelObservable {
  announcer: Observable;
  onChangeState(callback: (state: State) => void): void;
  onChangeValue(callback: (state: State) => void): void;
}
