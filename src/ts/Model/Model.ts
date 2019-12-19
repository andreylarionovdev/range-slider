import State from '../Interfaces/State';
import ExtraDataFromView from '../Interfaces/ExtraDataFromView';
import observable from '../../../node_modules/@riotjs/observable/dist/observable';
import { DEFAULT_STEP } from '../const';

export default class Model {
  private state: State;

  private announcer: any = observable(this);

  constructor(state: State) {
    this.setState(state);
  }

  get(key: string): null|number|boolean {
    return this.state[key];
  }

  set(key: string, value: null|number|boolean, extra?: ExtraDataFromView) {
    const state = { ...this.state };
    let event = 'change.state';
    let newValue = value;
    switch (key) {
      case 'value':
      case 'value2':
        if (newValue === null) {
          event = `change.${key}`;
          newValue = this.positionToValue(extra.percent);
        }
        state[key] = Model.validateValue(key, Number(newValue), state);
        break;
      case 'min':
      case 'max':
      case 'step':
        state[key] = Number(newValue);
        break;
      default:
        state[key] = newValue;
    }

    this.state = Model.validateState(state);

    this.announcer.trigger(event, { ...this.state });
  }

  getState(): State {
    return this.state;
  }

  setState(state: State): this {
    this.state = Model.validateState(state);

    return this;
  }

  emitState(): void {
    this.announcer.trigger(
      'change.state',
      { ...this.state },
    );
  }

  onChangeState(callback): void {
    this.announcer.on('change.state', callback);
  }

  onChangeValue(callback) {
    this.announcer.on('change.value', callback);
    this.announcer.on('change.value2', callback);
  }

  private positionToValue(percent: number): number {
    const { min, max } = this.state;
    const range = max - min;

    const value = percent * (range / 100) + min;

    return Math.round(value);
  }

  private static validateState(state: State): State {
    const { min, max } = Model.validateMinMax(state);
    const { step } = Model.validateStep(state);
    const { value2 } = Model.validateValue2(state);

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

    return {
      min: min > max ? Math.round(Math.min(max, min)) : min,
      max: min > max ? Math.round(Math.max(max, min)) : max,
    };
  }

  private static validateValue2(state: State): State {
    const { range, value2, max } = state;

    state.value2 = (range && value2 === null) ? max : value2;

    return state;
  }

  private static validateValue(prop: string, inValue: number, state: State): number {
    const {
      min, max, value, value2, range, step,
    } = state;

    if (inValue === null) return null;

    let outValue = Number(inValue);

    if (outValue > max) {
      outValue = max;
    }
    if (outValue < min) {
      outValue = min;
    }

    if (range) {
      if (prop === 'value' && outValue > value2) {
        outValue = value2;
      }
      if (prop === 'value2' && outValue < value) {
        outValue = value;
      }
    }

    return Math.floor(outValue / step) * step;
  }
}
