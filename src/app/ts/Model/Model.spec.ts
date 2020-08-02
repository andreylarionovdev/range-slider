import Model from './Model';
import State from '../Interfaces/State';

import {
  DEFAULT_MIN,
  DEFAULT_MAX,
  DEFAULT_STEP,
  DEFAULT_VALUE,
  DEFAULT_VALUE_2,
  DEFAULT_GRID_DENSITY,
  DEFAULT_RANGE,
  DEFAULT_VERTICAL,
  DEFAULT_SHOW_BUBBLE,
  DEFAULT_SHOW_GRID,
  DEFAULT_SHOW_BAR,
  GRID_DENSITY_MIN,
  GRID_DENSITY_MAX,
} from '../const';

const defaultOptions: State = {
  min: DEFAULT_MIN,
  max: DEFAULT_MAX,
  step: DEFAULT_STEP,
  value: DEFAULT_VALUE,
  value2: DEFAULT_VALUE_2,
  gridDensity: DEFAULT_GRID_DENSITY,
  range: DEFAULT_RANGE,
  vertical: DEFAULT_VERTICAL,
  showBubble: DEFAULT_SHOW_BUBBLE,
  showGrid: DEFAULT_SHOW_GRID,
  showBar: DEFAULT_SHOW_BAR,
};

describe('Model', () => {
  it('has correct values when created with default options', () => {
    const model: Model = new Model(defaultOptions);
    const state: State = model.getState();

    // compare state object and options
    expect(defaultOptions).toEqual(state);
    // compare some properties from state and options
    expect(defaultOptions.min).toEqual(state.min);
  });

  it('has correct values when created with non-default options', () => {
    const max = Math.floor(Math.random() * 100);
    const options: State = { ...defaultOptions, max };
    const model: Model = new Model(options);
    const state: State = model.getState();

    // compare state object and options
    expect(options).toEqual(state);
    // compare random properties from state and options
    expect(options.min).toEqual(state.min);
    expect(state.max).toEqual(max);
  });

  it('has correct values after setting random property', () => {
    const model = new Model(defaultOptions);
    const stateProperty = 'value';
    const stateValue = Math.floor(Math.random() * 100);
    const state: State = { [stateProperty]: stateValue };

    model.update(state);

    expect(model.get(stateProperty)).toEqual(stateValue);
  });

  it('has correct value2 after setting `range` true', () => {
    const model = new Model(defaultOptions);

    expect(model.get('value2')).toEqual(null);

    const state: State = { range: true };

    model.update(state);

    expect(model.get('value2')).toEqual(DEFAULT_MAX);
  });

  it('has correct values with specified `step` parameter', () => {
    const options: State = { ...defaultOptions, step: 5, value: 23 };
    const model = new Model(options);

    expect(model.get('value')).toEqual(20);

    model.update({ value2: 46 });

    expect(model.get('value2')).toEqual(45);

    model.update({ step: 10 });

    expect(model.get('value')).toEqual(20);
    expect(model.get('value2')).toEqual(40);
  });

  it('switch `value` and `value2` if `value` > `value2` when init', () => {
    const options = {
      ...defaultOptions, range: true, value: 50, value2: 25,
    };
    const model = new Model(options);

    expect(model.get('value')).toEqual(25);
    expect(model.get('value2')).toEqual(50);
  });

  it('bound `value` to `value2` if `value` > `value2` when updated single `value`', () => {
    const options = {
      ...defaultOptions, range: true, value: 21, value2: 12,
    };
    const model = new Model(options);

    expect(model.get('value')).toEqual(12);
    expect(model.get('value2')).toEqual(21);

    model.update({ value: 25 });

    expect(model.get('value')).toEqual(21);
  });

  it('bound `value2` to `value` if `value2` < `value` when updated single `value2`', () => {
    const options = {
      ...defaultOptions, range: true, value: 24, value2: 42,
    };
    const model = new Model(options);

    expect(model.get('value')).toEqual(24);
    expect(model.get('value2')).toEqual(42);

    model.update({ value2: 20 });

    expect(model.get('value2')).toEqual(24);
  });

  it('can not contain `min` greater than `max`', () => {
    const options = { ...defaultOptions, max: 200, min: 100 };
    const model = new Model(options);

    expect(model.get('min')).toEqual(100);
    expect(model.get('max')).toEqual(200);

    model.update({ min: 300 });

    expect(model.get('min')).toEqual(200);
    expect(model.get('max')).toEqual(300);
  });

  it('can not contain values greater than `max`', () => {
    const options = { ...defaultOptions, max: 1234, value: 12345 };
    const model = new Model(options);

    expect(model.get('value')).toEqual(1234);

    model.update({ value2: 12345 });

    expect(model.get('value2')).toEqual(1234);
  });

  it('can not contain values less than `min`', () => {
    const options = { ...defaultOptions, min: -1234, value: -12345 };
    const model = new Model(options);

    expect(model.get('value')).toEqual(-1234);

    model.update({ value2: -12345 });

    expect(model.get('value2')).toEqual(-1234);
  });

  it('convert percent to values correct', () => {
    const options = { ...defaultOptions, min: 1000, max: 2000 };
    const model = new Model(options);

    model.update({ value: null }, { percent: 50 });

    expect(model.get('value')).toEqual(1500);

    model.update({ value: null }, { percent: 25 });
    model.update({ value2: null }, { percent: 75 });

    expect(model.get('value')).toEqual(1250);
    expect(model.get('value2')).toEqual(1750);

    model.update({ value: null }, { percent: 85 });

    expect(model.get('value2')).toEqual(1750);
  });

  it('convert percent to values correct with negative minmax', () => {
    const options = { ...defaultOptions, min: -50, max: 50 };
    const model = new Model(options);

    model.update({ value: null }, { percent: 50 });
    expect(model.get('value')).toEqual(0);

    model.update({ value: null }, { percent: 0 });
    expect(model.get('value')).toEqual(-50);

    model.update({ value: null }, { percent: 100 });
    expect(model.get('value')).toEqual(50);
  });

  it('handle negative minmax correct', () => {
    const min = -50;
    const max = 50;
    const options = { ...defaultOptions, min, max };
    const model: Model = new Model(options);

    expect(model.getState()).toEqual(options);

    model.update({ value: -100 });
    expect(model.getState().value).toEqual(min);

    model.update({ value: 100 });
    expect(model.getState().value).toEqual(max);
  });

  it('convert value to percent properly', () => {
    expect(Model.valueToPercent(0, 1000, 500)).toEqual(50);
    expect(Model.valueToPercent(0, 1000, 1500)).toEqual(100);
    expect(Model.valueToPercent(0, 1000, -500)).toEqual(0);
  });

  it('call `onCreate` callback when init', () => {
    let callbackAffectedNumber = 0;
    const callback = (state: State) => {
      callbackAffectedNumber += state.max;
    };
    const model: Model = new Model({ ...defaultOptions, onCreate: callback });

    expect(callbackAffectedNumber).toEqual(DEFAULT_MAX);
  });

  it('call `onChange` callback when update', () => {
    let callbackAffectedNumber = 0;
    const value = 23;
    const callback = (state: State) => {
      callbackAffectedNumber += state.value;
    };
    const model: Model = new Model({ ...defaultOptions, onChange: callback });
    model.update({ value });

    expect(callbackAffectedNumber).toEqual(value);
  });

  it('update `gridDensity` properly', () => {
    const model: Model = new Model({ ...defaultOptions, showGrid: true});

    model.update({ gridDensity: 20 });
    expect(model.getState().gridDensity).toEqual(20);

    model.update({ gridDensity: -10 });
    expect(model.getState().gridDensity).toEqual(GRID_DENSITY_MIN);

    model.update({ gridDensity: 200 });
    expect(model.getState().gridDensity).toEqual(GRID_DENSITY_MAX);
  });

  it('update `step` properly', () => {
    const model: Model = new Model(defaultOptions);

    model.update({ step: 20 });
    expect(model.getState().step).toEqual(20);

    model.update({ step: 0 });
    expect(model.getState().step).toEqual(DEFAULT_STEP);
  });
});
