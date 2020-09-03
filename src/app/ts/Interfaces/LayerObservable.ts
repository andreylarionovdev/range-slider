import Observable from './Observable';
import State from './State';
import SliderModelExtraData from './SliderModelExtraData';
import SliderViewExtraData from './SliderViewExtraData';

interface LayerObservable {
  announcer: Observable;
  onChange: (
    callback: (state: State, extra?: SliderModelExtraData|SliderViewExtraData) => void
  ) => void;
}

export default LayerObservable;
