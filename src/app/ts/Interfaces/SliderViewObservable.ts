import SliderViewExtraData from './SliderViewExtraData';
import Observable from './Observable';
import State from './State';

interface SliderViewObservable {
  announcer: Observable;
  onChange(callback: (state: State, extra?: SliderViewExtraData) => void): void;
}

export default SliderViewObservable;
