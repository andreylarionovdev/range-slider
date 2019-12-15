import State from '../Interfaces/State';
import observable from '../../../node_modules/@riotjs/observable/dist/observable';
import {DEFAULT_STEP} from '../const';

export default class Model {
  private state: State;
  private announcer: any = observable(this);

  constructor (state: State) {
    this.setState(state);
  }

  get(key: string): number|boolean {
    return this.state[key];
  }

  set(key: string, value: any, data?: any) {
    let state = Object.assign({}, this.state);
    let event = 'change.state';
    switch (key) {
      case 'value':
      case 'value2':
        if (value === null) {
          event = `change.${key}`;
          value = this.positionToValue(data.percent);
        }
        state[key] = Model.validateValue(key, value, state);
        break;
      case 'min':
      case 'max':
      case 'step':
        state[key] = Number(value);
        break;
      default:
        state[key] = value;
    }

    this.state = Model.validateState(state);

    this.announcer.trigger(event, Object.assign({}, this.state));
  }

  getState(): State {
    return this.state;
  }

  setState(state: State): this {
    this.state = Model.validateState(state);

    return this;
  }

  emitState() {
    this.announcer.trigger(
      'change.state',
      Object.assign({}, this.state)
    );
  }

  onEmitState(callback) {
    this.announcer.on('change.state', callback);
  }

  onChangeValue(callback) {
    this.announcer.on('change.value', callback);
    this.announcer.on('change.value2', callback);
  }

  private positionToValue(percent: number): number {
    const {min, max} = this.state;
    const range = max - min;

    let value = percent * (range / 100) + min;

    return Math.round(value);
  }

  private static validateState(state: State): State {
    const { min, max }  = Model.validateMinMax(state);
    const { step }      = Model.validateStep(state);
    const { value2 }    = Model.validateValue2(state);

    state.min = min;
    state.max = max;
    state.step = step;
    state.value = Model.validateValue('value', state.value, state);
    state.value2 = Model.validateValue('value2', value2, state);

    return state;
  }

  private static validateStep(state: State): State {
    const { step } = state;

    state.step = Number(step) < DEFAULT_STEP ? DEFAULT_STEP : Math.round(step);

    return state;
  }

  private static validateMinMax(state: State): State {
    const { min, max } = state;

    state.min = min > max ? Math.round(Math.min(max, min)) : min;
    state.max = min > max ? Math.round(Math.max(max, min)) : max;

    return state;
  }

  private static validateValue2(state: State): State {
    const { range, value2, max } = state;

    state.value2 = (range && value2 === null) ? max : value2;

    return state;
  }

  private static validateValue(prop: string, v: number, state: State): number {
    const {min, max, value, value2, range, step} = state;

    if (v === null) return null;

    v = Number(v) > max ? max : Number(v);
    v = Number(v) < min ? min : Number(v);

    if (range) {
      switch (prop) {
        case 'value':
          v = v > Number(value2) ? Number(value2) : v;
          break;
        case 'value2':
          v = v < Number(value) ? Number(value) : v;
          break;
      }
    }

    return Math.floor(v / step) * step;
  }
}