import State from './State';
import SliderModelExtraData from './SliderModelExtraData';

interface SliderView {
  update(state: State, extra: SliderModelExtraData): void;
}

export default SliderView;
