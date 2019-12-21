import Model from '../src/ts/Model/Model';
import State from '../src/ts/Interfaces/State';

import {
  DEFAULT_MAX,
  DEFAULT_MIN,
  DEFAULT_STEP,
  DEFAULT_VALUE,
  DEFAULT_VALUE_2,
  DEFAULT_RANGE,
  DEFAULT_VERTICAL,
  DEFAULT_SHOW_BUBBLE,
  DEFAULT_SHOW_CONFIG,
} from '../src/ts/const';

const options: State = {
  min: DEFAULT_MIN,
  max: DEFAULT_MAX,
  step: DEFAULT_STEP,
  value: DEFAULT_VALUE,
  value2: DEFAULT_VALUE_2,
  range: DEFAULT_RANGE,
  vertical: DEFAULT_VERTICAL,
  showBubble: DEFAULT_SHOW_BUBBLE,
  showConfig: DEFAULT_SHOW_CONFIG,
};

describe('State', () => {
  it('has correct values when created with default options', () => {
    const model: Model = new Model(options);
    const state: State = model.getState();

    // compare state object and options
    expect(options).toEqual(state);
    // compare some properties from state and options
    expect(options.showConfig).toEqual(state.showConfig);
    expect(options.min).toEqual(state.min);
  });

  it('has correct values when created with non-default options', () => {
    const options: State = {
      min: DEFAULT_MIN,
      max: 50,
      step: DEFAULT_STEP,
      value: DEFAULT_VALUE,
      value2: DEFAULT_VALUE_2,
      range: DEFAULT_RANGE,
      vertical: DEFAULT_VERTICAL,
      showBubble: DEFAULT_SHOW_BUBBLE,
      showConfig: DEFAULT_SHOW_CONFIG,
    };
    const model: Model = new Model(options);
    const state: State = model.getState();

    // compare state object and options
    expect(options).toEqual(state);
    // compare random properties from state and options
    expect(options.showConfig).toEqual(state.showConfig);
    expect(options.min).toEqual(state.min);
  });

  it('has correct values after setting random property', () => {
    const model = new Model(options);
    const value = Math.floor(Math.random() * 100);
    const key = 'value';

    model.updateState(key, value);

    expect(model.get(key)).toEqual(value);
  });

  it('has correct value2 after setting `range` true', () => {
    const model = new Model(options);
    const key = 'value2';

    expect(model.get(key)).toEqual(null);

    model.updateState('range', true);

    expect(model.get(key)).toEqual(DEFAULT_MAX);
  });
});
