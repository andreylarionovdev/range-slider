import $ from 'jquery';
import State from '../src/ts/Interfaces/State';
import App from '../src/ts/App/App';

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

describe('View', () => {
  beforeEach(() => {
    $('<input/>').attr({type: 'range'}).appendTo($('body'));
  });
  afterEach(() => {
    $('input[type="range"]').remove();
    $('.range-slider').remove();
  });

  it('rendered properly with default options', () => {
    new App($('input[type="range"]'), options);
    const $slider = $('.range-slider');

    expect($slider.length).toEqual(1);
    expect($slider.find('.range-slider__handle').length).toEqual(1);
    expect($slider.hasClass('range-slider--vertical')).toBeFalsy();
  });
  it ('rendered properly with `vertical` option', () => {
    new App($('input[type="range"]'), Object.assign({}, options, {
      vertical: true
    }));
    const $slider = $('.range-slider');

    expect($slider.hasClass('range-slider--vertical')).toBeTruthy();
  });
  it('rendered properly with `range` option', () => {
    new App($('input[type="range"]'), Object.assign({}, options, {
      range: true
    }));
    const $slider = $('.range-slider');

    expect($slider.find('.range-slider__handle').length).toEqual(2);
    expect($slider.find('.range-slider__handle--from').length).toEqual(1);
    expect($slider.find('.range-slider__handle--to').length).toEqual(1);
  });
  it('rendered correct with `showConfig` option', () => {
    new App($('input[type="range"]'), Object.assign({}, options, {
      showConfig: true
    }));
    const $slider = $('.range-slider');

    expect($slider.find('.range-slider__conf').length).toEqual(1);
    expect($slider.find('.range-slider__conf-input-group').length)
      .toEqual(Object.entries(options).length);
  });
});