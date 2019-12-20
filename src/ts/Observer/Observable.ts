export default class Observable {
  callbacks: { [name: string]: Function[] } = {};

  static slice = [].slice;

  on(events: string, fn: Function) {
    events.replace(/\S+/g, (name, pos) => {
      (this.callbacks[name] = this.callbacks[name] || []).push(fn);
      return '';
    });
  }

  trigger(name: string, ...any) {
    const args = Observable.slice.call(arguments, 1);
    const fns = this.callbacks[name] || [];

    for (let i = 0; i < fns.length; i++) {
      fns[i].apply(this, args);
    }
  }
}
