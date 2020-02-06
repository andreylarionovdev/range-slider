import Observable from './Observable';
import State from './State';

interface SliderModelObservable {
  announcer: Observable;
  onChangeState(callback: (state: State) => void): void;
  onChangeValue(callback: (state: State) => void): void;
}

export default SliderModelObservable;
