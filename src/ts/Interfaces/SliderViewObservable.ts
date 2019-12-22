import SliderViewExtraData from './SliderViewExtraData';
import Observable from './Observable';

export default interface SliderViewObservable {
  announcer: Observable;
  onDrag(callback: (key: string, value: null, extra?: SliderViewExtraData) => void): void;
  onJump(callback: (key: string, value: null, extra?: SliderViewExtraData) => void): void;
  onChangeConfig(callback: (key: string, value: null|number|boolean) => void): void;
}
