import State from '../Interfaces/State';
import observable from '../../../node_modules/@riotjs/observable/dist/observable';

export default class Model {
  private state: State;
  private announcer: any = observable(this);

  constructor (state: State) {
    const {max, value2, range} = state;

    this.state = state;
    if (range && ! value2) {
      this.state.value2 = max;
    }
  }

  getState(): State {
    return this.state;
  }

  onEmitState(callback) {
    this.announcer.on('emit.state', callback);
  }

  onChangeValue(callback) {
    this.announcer.on('change.value', callback);
    this.announcer.on('change.value2', callback);
  }

  emitState() {
    this.announcer.trigger(
      'emit.state',
      Object.assign({}, this.state)
    );
  }

  get(key: string): number|boolean {
    return this.state[key];
  }

  set(key: string, value: any, data?: any) {
    switch (key) {
      case 'value':
      case 'value2':
        if (value === null) {
          const {percent} = data;
          value = this.positionToValue(percent);
          value = this.validateValue(key, value);

          this.state[key] = value;
          this.announcer.trigger(
            `change.${key}`,
            Object.assign({}, this.state)
          );
        } else {
          value = this.validateValue(key, value);

          this.state[key] = value;
          this.emitState();
        }
        break;
      case 'min':
      case 'max':
      case 'step':
        this.state[key] = Number(value);
        this.emitState();
        break;
      default:
        this.state[key] = value;
        this.emitState();
    }
  }

  private validateValue(prop: string, v: number): number {
    const {min, max, value, value2, range} = this.state;

    v = v > max ? max : v;
    v = v < min ? min : v;

    if (range) {
      switch (prop) {
        case 'value':
          v = Number(v) > Number(value2) ? value2 : v;
          break;
        case 'value2':
          v = Number(v) < Number(value) ? value : v;
          break;
      }
    }

    return Number(v);
  }

  private positionToValue(percent: number): number {
    const {min, max, step} = this.state;
    const range = max - min;

    let value = percent * (range / 100) + min;

    if (step) {
      return Math.floor(value / step) * step;
     }

    return Math.round(value);
  }
}