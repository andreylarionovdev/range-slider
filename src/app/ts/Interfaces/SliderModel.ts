import SliderViewExtraData from './SliderViewExtraData';
import State from './State';

interface SliderModel {
  getState(): State;
  update(state: State, extra?: SliderViewExtraData): this;
}

export default SliderModel;
