import Observable from '../Interfaces/Observable';

class Observer implements Observable {
  callbacks: { [name: string]: Function[] } = {};

  static slice = [].slice;

  on(events: string, fn: Function): void {
    events.replace(/\S+/g, (name): string => {
      this.callbacks[name] = this.callbacks[name] || [];
      this.callbacks[name].push(fn);
      return '';
    });
  }

  trigger(name: string, ...any): void {
    const args = Observer.slice.call([name, ...any], 1);
    const fns = this.callbacks[name] || [];

    fns.map((fn) => fn.apply(this, args));
  }
}

export default Observer;
