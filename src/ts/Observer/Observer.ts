import Observable from '../Interfaces/Observable';

export default class Observer implements Observable{
  callbacks: { [name: string]: Function[] } = {};

  static slice = [].slice;

  on(events: string, fn: Function) {
    events.replace(/\S+/g, (name, pos) => {
      this.callbacks[name] = this.callbacks[name] || [];
      this.callbacks[name].push(fn);
      return '';
    });
  }

  trigger(name: string, ...any) {
    const args = Observer.slice.call([name, ...any], 1);
    const fns = this.callbacks[name] || [];

    fns.map((fn) => fn.apply(this, args));
  }
}
