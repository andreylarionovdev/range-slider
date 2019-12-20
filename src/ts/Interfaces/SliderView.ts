import State from './State';
import SliderViewExtraData from './SliderViewExtraData';

export default interface SliderView {
  update(state: State): void;
  updateValues(state: State): void;
  moveHandle(state: State): void;
  onDrag(callback: (key: string, value: null, extra?: SliderViewExtraData) => void): void;
  onJump(callback: (key: string, value: null, extra?: SliderViewExtraData) => void): void;
  onChangeConfig(callback: (key: string, value: null|number|boolean) => void): void;
}
