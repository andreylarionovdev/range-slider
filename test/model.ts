import Model from '../src/ts/Model/Model';
import State from "../src/ts/Interfaces/State";

const options: State = {
  min: 0,
  max: 100,
  step: 1,
  value: 0,
  value2: 0,
  range: false,
  vertical: false,
  showConfig: false,
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
      min: 0,
      max: 50,
      step: 1,
      value: 0,
      value2: 0,
      range: false,
      vertical: false,
      showConfig: true,
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

    model.set(key, value);

    expect(model.get(key)).toEqual(value)
  });
});