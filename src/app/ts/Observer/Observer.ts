import Observable from '../Interfaces/Observable';
import State from '../Interfaces/State';
import SliderModelExtraData from '../Interfaces/SliderModelExtraData';
import SliderViewExtraData from '../Interfaces/SliderViewExtraData';

class Observer implements Observable {
  callbacks: { [name: string]: Array<(data: State|number) => void> } = {};

  on(events: string, fn: (data: State|number) => void): void {
    events.replace(/\S+/g, (name): string => {
      this.callbacks[name] = this.callbacks[name] || [];
      this.callbacks[name].push(fn);
      return '';
    });
  }

  trigger(
    name: string,
    data?: State|number,
    extra?: SliderModelExtraData|SliderViewExtraData,
  ): void {
    const fns = this.callbacks[name] || [];

    fns.map((fn) => fn.apply(this, [data, extra]));
  }
}

export default Observer;
