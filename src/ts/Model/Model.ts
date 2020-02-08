import Observer from '../Observer/Observer';
import { DEFAULT_STEP } from '../const';

import State from '../Interfaces/State';
import SliderViewExtraData from '../Interfaces/SliderViewExtraData';
import Observable from '../Interfaces/Observable';
import SliderModel from '../Interfaces/SliderModel';
import SliderModelObservable from '../Interfaces/SliderModelObservable';

class Model implements SliderModel, SliderModelObservable {
  announcer: Observable;

  private state: State;

  constructor(state: State) {
    this.announcer = new Observer();
    this.setState(state);
  }

  get(key: string): null|number|boolean {
    return this.state[key];
  }

  getState(): State {
    return this.state;
  }

  setState(state: State): this {
    this.state = Model.validateState({ ...this.state, ...state });

    return this;
  }

  updateStateProp(prop: string, value: null|number|boolean, extra?: SliderViewExtraData): this {
    const state = { ...this.state };
    let event = 'change.state';
    let newValue = value;
    switch (prop) {
      case 'value':
      case 'value2':
        if (newValue === null) {
          event = `change.${prop}`;
          newValue = this.positionToValue(extra.percent);
        }
        state[prop] = Model.validateValue(prop, Number(newValue), state);
        break;
      case 'min':
      case 'max':
      case 'step':
        state[prop] = Number(newValue);
        break;
      default:
        state[prop] = newValue;
    }

    this.state = Model.validateState(state);

    this.announcer.trigger(event, { ...this.state });

    return this;
  }

  emitChangeState(): void {
    this.announcer.trigger(
      'change.state',
      { ...this.state },
    );
  }

  onChangeState(callback): void {
    this.announcer.on('change.state', callback);
  }

  onChangeValue(callback): void {
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
    const step = Model.validateStep(state);
    const { value, value2 } = Model.validateValues(state);

    return {
      ...state, min, max, step, value, value2,
    };
  }

  private static validateStep(state: State): number {
    const { step } = state;

    return Number(step) < DEFAULT_STEP ? DEFAULT_STEP : Math.round(step);
  }

  private static validateMinMax(state: State): State {
    const { min, max } = state;

    return {
      min: min > max ? Math.round(Math.min(max, min)) : min,
      max: min > max ? Math.round(Math.max(max, min)) : max,
    };
  }

  private static validateValues(state: State): State {
    const {
      value, value2, max, range,
    } = state;

    let outValue = this.validateValue('value', value, state);
    let outValue2 = this.validateValue('value2', value2, state);

    if (range) {
      if (outValue2 === null) {
        outValue2 = max;
      }
      outValue = outValue > outValue2
        ? Math.round(Math.min(outValue2, outValue))
        : outValue;
      outValue2 = outValue > outValue2
        ? Math.round(Math.max(outValue2, outValue))
        : outValue2;
    }

    return {
      value: outValue,
      value2: outValue2,
    };
  }

  private static validateValue(prop: string, valueToValidate: number, state: State): number {
    const {
      min, max, value, value2, range, step,
    } = state;

    if (valueToValidate === null) return null;

    let outValue = Number(valueToValidate);

    outValue = outValue > max ? max : outValue;
    outValue = outValue < min ? min : outValue;

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

export default Model;
