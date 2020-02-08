import $ from 'jquery';
import State from '../Interfaces/State';
import View from './View';
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
  showConfig: DEFAULT_SHOW_CONFIG,
};

describe('View', () => {
  beforeEach(() => {
    $('<input/>').attr({ type: 'range' }).appendTo($('body'));
  });
  afterEach(() => {
    $('body').empty();
  });

  it('rendered properly with default options', () => {
    const view = new View($('input[type="range"]'));

    view.update(defaultOptions);

    const $slider = $('.range-slider');

    expect($slider.length).toEqual(1);
    expect($slider.find('.range-slider__handle').length).toEqual(1);
    expect($slider.hasClass('range-slider--vertical')).toBeFalsy();
  });

  it('rendered properly with `vertical` option', () => {
    const view = new View($('input[type="range"]'));
    const options = { ...defaultOptions, vertical: true };

    view.update(options);

    const $slider = $('.range-slider');

    expect($slider.hasClass('range-slider--vertical')).toBeTruthy();
  });

  it('rendered properly with `range` option', () => {
    const view = new View($('input[type="range"]'));
    const options = { ...defaultOptions, range: true };

    view.update(options);

    const $slider = $('.range-slider');

    expect($slider.find('.range-slider__handle').length).toEqual(2);
    expect($slider.find('.range-slider__handle--from').length).toEqual(1);
    expect($slider.find('.range-slider__handle--to').length).toEqual(1);
  });

  it('rendered properly with `showConfig` option', () => {
    const view = new View($('input[type="range"]'));
    const options = { ...defaultOptions, showConfig: true };

    view.update(options);

    const $slider = $('.range-slider');

    expect($slider.find('.range-slider__conf').length).toEqual(1);
    expect($slider.find('.range-slider__conf-input-group').length)
      .toEqual(Object.entries(defaultOptions).length);
  });

  it('rendered properly with `showBubble` option', () => {
    const value = Math.floor(Math.random());
    const view = new View($('input[type="range"]'));
    const options = {
      ...defaultOptions,
      value,
      showBubble: true,
    };

    view.update(options);

    const $slider = $('.range-slider');

    expect($slider.hasClass('range-slider--with-bubble')).toBeTruthy();
    expect($slider.find('.range-slider__bubble').length).toEqual(1);
    expect($slider.find('.range-slider__bubble').text()).toEqual(value.toString());
  });
});
