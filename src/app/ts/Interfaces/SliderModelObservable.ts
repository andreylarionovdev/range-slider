import Observable from './Observable';
import State from './State';

interface SliderModelObservable {
  announcer: Observable;
  onChange(callback: (state: State) => void): void;
}

export default SliderModelObservable;
