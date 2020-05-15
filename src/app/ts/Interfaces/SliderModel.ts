import SliderViewExtraData from './SliderViewExtraData';
import State from './State';

interface SliderModel {
  getState(): State;
  setState(state: State): this;
  update(state: State, extra?: SliderViewExtraData): this;
}

export default SliderModel;
