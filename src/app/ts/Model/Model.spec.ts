import Model from './Model';
import State from '../Interfaces/State';

import {
  DEFAULT_MAX,
  DEFAULT_MIN,
  DEFAULT_STEP,
  DEFAULT_VALUE,
  DEFAULT_VALUE_2,
  DEFAULT_RANGE,
  DEFAULT_VERTICAL,
  DEFAULT_SHOW_BUBBLE,
} from '../const';

const defaultOptions: State = {
  min: DEFAULT_MIN,
  max: DEFAULT_MAX,
  step: DEFAULT_STEP,
  value: DEFAULT_VALUE,
  value2: DEFAULT_VALUE_2,
  range: DEFAULT_RANGE,
  vertical: DEFAULT_VERTICAL,
  showBubble: DEFAULT_SHOW_BUBBLE,
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
      ...defaultOptions, range: true, value: 12, value2: 21,
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
});
