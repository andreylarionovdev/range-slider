import SliderViewExtraData from './SliderViewExtraData';
import State from './State';

interface SliderModel {
  getState(): State;
  setState(state: State): this;
  updateStateProp(prop: string, value: null|number|boolean, extra?: SliderViewExtraData): this;
}

export default SliderModel;
