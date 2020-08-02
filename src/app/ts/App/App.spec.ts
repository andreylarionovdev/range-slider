import $ from 'jquery';
import App from './App';
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

describe('App', () => {
  beforeEach(() => {
    $('<input/>').attr({ type: 'range' }).appendTo($('body'));
  });
  afterEach(() => {
    $('body').empty();
  });

  it('initialized with default options', () => {
    const app: App = new App($('input[type="range"]'), defaultOptions);
    const $rangeSlider:JQuery = $('.js-range-slider');

    expect($rangeSlider.length).toEqual(1);

    app.update({ ...defaultOptions });
  });

  it('updated properly ', () => {
    const app: App = new App($('input[type="range"]'), defaultOptions);
    const handleSelector = '.js-range-slider .js-range-slider__handle';

    expect($(handleSelector).length).toEqual(1);

    app.update({ ...defaultOptions, range: true });

    expect($(handleSelector).length).toEqual(2);
  });

  it('handle tick click properly', () => {
    const app: App = new App(
      $('input[type="range"]'),
      {
        ...defaultOptions, showGrid: true, gridDensity: 5, showBubble: true,
      },
    );
    const $tickLabel = $('.js-range-slider').find('.js-range-slider__grid-label:eq(2)');
    const $bubble = $('.js-range-slider .js-range-slider__bubble');

    $tickLabel.trigger('click');
    expect($bubble.text()).toEqual('40');
  });
});
