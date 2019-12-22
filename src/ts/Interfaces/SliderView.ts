import State from './State';

export default interface SliderView {
  update(state: State): void;
  updateValues(state: State): void;
  moveHandle(state: State): void;
}
