import Observer from '../Observer/Observer';
import {
  DEFAULT_STEP,
  GRID_DENSITY_MIN,
  GRID_DENSITY_MAX,
} from '../const';

import State from '../Interfaces/State';
import SliderViewExtraData from '../Interfaces/SliderViewExtraData';
import Observable from '../Interfaces/Observable';
import SliderModel from '../Interfaces/SliderModel';
import LayerObservable from '../Interfaces/LayerObservable';
import SliderModelExtraData from '../Interfaces/SliderModelExtraData';

class Model implements SliderModel, LayerObservable {
  announcer: Observable;

  private state: State;

  constructor(state: State) {
    this.announcer = new Observer();
    this.init(state);
  }

  get(key: string): null|number|boolean {
    return this.state[key];
  }

  getState(): State {
    return this.state;
  }

  setState(state: State): void {
    this.init(state);
    const extra: SliderModelExtraData = { redraw: true };

    this.announcer.trigger(
      'change.state',
      { ...this.state },
      this.updateModelExtraPosition(extra),
    );
  }

  update(state: State, viewExtra?: SliderViewExtraData): this {
    const [stateProperty, stateValue] = Object.entries(state)[0];
    const thisState: State = { ...this.state };
    const modelExtra: SliderModelExtraData = { redraw: true };

    const { percent } = viewExtra || {};
    let newValue = stateValue;

    switch (stateProperty) {
      case 'value':
      case 'value2':
        modelExtra.redraw = false;
        if (typeof percent !== 'undefined') {
          const { min, max } = thisState;
          newValue = Model.percentToValue(min, max, percent);
        }
        thisState[stateProperty] = Model.validateValue(stateProperty, Number(newValue), thisState);
        break;
      case 'min':
      case 'max':
      case 'step':
      case 'gridDensity':
        thisState[stateProperty] = Number(newValue);
        break;
      default:
        thisState[stateProperty] = newValue;
    }

    this.state = Model.validateState(thisState);

    this.announcer.trigger(
      'change.state',
      { ...this.state },
      this.updateModelExtraPosition(modelExtra),
    );

    if (typeof this.state.onChange === 'function') this.state.onChange(this.state);

    return this;
  }

  emitChangeState(): void {
    const state: State = { ...this.state };
    const extra: SliderModelExtraData = { redraw: true };

    this.announcer.trigger(
      'change.state',
      state,
      this.updateModelExtraPosition(extra),
    );
  }

  onChange(callback: (state: State, extra?: SliderModelExtraData) => void): void {
    this.announcer.on('change.state', callback);
  }

  static percentToValue(min: number, max: number, percent: number): number {
    const range = Number(max) - Number(min);
    const value = Number(percent) * (range / 100) + Number(min);

    return Math.round(value);
  }

  static valueToPercent(min: number, max: number, value: number): number {
    const range = max - min;

    return Model.checkBoundaries(((value - min) * 100) / range);
  }

  private init(state: State): this {
    this.state = Model.validateState({ ...this.state, ...state });

    if (typeof this.state.onCreate === 'function') this.state.onCreate(this.state);

    return this;
  }

  private static validateState(state: State): State {
    const { min, max } = Model.validateMinMax(state);
    const step = Model.validateStep(state);
    const { value, value2 } = Model.validateValues({
      ...state, min, max, step,
    });
    const gridDensity = Model.validateGridDensity({
      ...state, min, max, step,
    });

    return {
      ...state, min, max, step, value, value2, gridDensity,
    };
  }

  private static validateGridDensity(state: State): number {
    const {
      gridDensity, min, max, step,
    } = state;

    const autoGridDensity = Math.round((max - min) / step);

    const validatedGridDensity = autoGridDensity < gridDensity ? autoGridDensity : gridDensity;

    if (validatedGridDensity < GRID_DENSITY_MIN) return GRID_DENSITY_MIN;
    if (validatedGridDensity > GRID_DENSITY_MAX) return GRID_DENSITY_MAX;

    return validatedGridDensity;
  }

  private static validateStep(state: State): number {
    const { step } = state;

    return Number(step) < DEFAULT_STEP ? DEFAULT_STEP : step;
  }

  private static validateMinMax(state: State): State {
    let { min, max } = state;

    min = Number(min);
    max = Number(max);

    return {
      min: min > max ? Math.round(Math.min(max, min)) : min,
      max: min > max ? Math.round(Math.max(max, min)) : max,
    };
  }

  private static validateValues(state: State): State {
    const {
      value, value2, max, isRange,
    } = state;

    return {
      value: this.validateValue('value', value, state),
      value2: isRange && value2 === null ? max : this.validateValue('value2', value2, state),
    };
  }

  private static validateValue(prop: string, valueToValidate: number, state: State): number {
    const {
      min, max, value, value2, isRange, step,
    } = state;

    if (valueToValidate === null) return null;

    let outValue = Model.snapToStep(min, max, step, valueToValidate);

    if (isRange) {
      const valueAlignedToStep = Model.snapToStep(min, max, step, value);
      const value2AlignedToStep = Model.snapToStep(min, max, step, value2);

      if (prop === 'value' && outValue > value2AlignedToStep) outValue = value2AlignedToStep;
      if (prop === 'value2' && outValue < valueAlignedToStep) outValue = valueAlignedToStep;
    }

    outValue = outValue > max ? max : outValue;
    outValue = outValue < min ? min : outValue;

    return outValue;
  }

  private static snapToStep(min: number, max: number, step: number, value: number): number {
    return value >= max ? max : Math.round((value - min) / step) * step + min;
  }

  private static checkBoundaries(position: number): number {
    const boundStart = 0;
    const boundEnd = 100;

    if (position > boundEnd) return boundEnd;
    if (position < boundStart) return boundStart;

    return position;
  }

  private updateModelExtraPosition(extra: SliderModelExtraData): SliderModelExtraData {
    const {
      min, max, value, value2,
    } = this.state;

    return {
      redraw: extra.redraw,
      fromPosition: Model.valueToPercent(min, max, value),
      toPosition: Model.valueToPercent(min, max, value2),
    };
  }
}

export default Model;
