import State from './State';

interface SliderView {
  update(state: State): void;
  updateValues(state: State): void;
  moveHandle(state: State): void;
}

export default SliderView;
