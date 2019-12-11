import $ from 'jquery';
import State from '../src/ts/Interfaces/State';
import App from '../src/ts/App/App';
import View from '../src/ts/View/Slider/View'

const defaultOptions: State = {
  min: 0,
  max: 100,
  step: 1,
  value: 0,
  value2: 0,
  range: false,
  vertical: false,
  showConfig: false,
};

describe('View', () => {
  beforeEach(() => {
    $('<input/>').attr({type: 'range'}).appendTo($('body'));
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

  it ('rendered properly with `vertical` option', () => {
    const view    = new View($('input[type="range"]'));
    const options = Object.assign({}, defaultOptions, {
      vertical: true
    });

    view.update(options);

    const $slider = $('.range-slider');

    expect($slider.hasClass('range-slider--vertical')).toBeTruthy();
  });

  it('rendered properly with `range` option', () => {
    const view    = new View($('input[type="range"]'));
    const options = Object.assign({}, defaultOptions, {
      range: true
    });

    view.update(options);

    const $slider = $('.range-slider');

    expect($slider.find('.range-slider__handle').length).toEqual(2);
    expect($slider.find('.range-slider__handle--from').length).toEqual(1);
    expect($slider.find('.range-slider__handle--to').length).toEqual(1);
  });

  it('rendered correct with `showConfig` option', () => {
    const view    = new View($('input[type="range"]'));
    const options = Object.assign({}, defaultOptions, {
      showConfig: true
    });

    view.update(options);

    const $slider = $('.range-slider');

    expect($slider.find('.range-slider__conf').length).toEqual(1);
    expect($slider.find('.range-slider__conf-input-group').length)
      .toEqual(Object.entries(defaultOptions).length);
  });

  it('rendered correct with `showBubble` option', () => {
    const value   = Math.floor(Math.random());
    const view    = new View($('input[type="range"]'));
    const options = Object.assign({}, defaultOptions, {
      value     : value,
      showBubble: true
    });

    view.update(options);

    const $slider = $('.range-slider');

    expect($slider.hasClass('range-slider--with-bubble')).toBeTruthy();
    expect($slider.find('.range-slider__bubble').length).toEqual(1);
    expect($slider.find('.range-slider__bubble').text()).toEqual(value.toString());
  });

});