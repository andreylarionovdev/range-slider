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

  it('handle 1/2 track click properly', () => {
    const app: App = new App($('input[type="range"]'), defaultOptions);

    const $track = $('.js-range-slider .js-range-slider__track');

    const halfTrackClickX = $track.outerWidth() / 2 + $track.offset().left;
    const halfTrackClickY = $track.outerHeight() / 2 + $track.offset().top;

    const event = $.Event('mousedown');

    event.pageX = halfTrackClickX;
    event.pageY = halfTrackClickY;

    $track.trigger(event);

    const $handle = $('.js-range-slider .js-range-slider__handle');

    expect($handle.css('left')).toEqual('50%');
  });

  it('handle 1/4 track click with two handles properly', () => {
    const app: App = new App($('input[type="range"]'), { ...defaultOptions, range: true });

    const $track = $('.js-range-slider .js-range-slider__track');

    const quarterTrackClickX = $track.outerWidth() / 4 + $track.offset().left;
    const halfTrackClickY = $track.outerHeight() / 2 + $track.offset().top;

    const event = $.Event('mousedown');

    event.pageX = quarterTrackClickX;
    event.pageY = halfTrackClickY;

    $track.trigger(event);

    const $handleFrom = $('.js-range-slider .js-range-slider__handle_type_from');
    const $handleTo = $('.js-range-slider .js-range-slider__handle_type_to');

    expect($handleFrom.css('left')).toEqual('25%');
    expect($handleTo.css('left')).toEqual('100%');
  });

  it('handle 3/4 track click with two handles properly', () => {
    const app: App = new App($('input[type="range"]'), { ...defaultOptions, range: true });

    const $track = $('.js-range-slider .js-range-slider__track');

    const threeQuartersTrackClickX = ($track.outerWidth() / 4) * 3 + $track.offset().left;
    const halfTrackClickY = $track.outerHeight() / 2 + $track.offset().top;

    const event = $.Event('mousedown');

    event.pageX = threeQuartersTrackClickX;
    event.pageY = halfTrackClickY;

    $track.trigger(event);

    const $handleFrom = $('.js-range-slider .js-range-slider__handle_type_from');
    const $handleTo = $('.js-range-slider .js-range-slider__handle_type_to');

    expect($handleFrom.css('left')).toEqual('0%');
    expect($handleTo.css('left')).toEqual('75%');
  });

  it('handle 1/2 track click with two handles', () => {
    const app: App = new App($('input[type="range"]'), { ...defaultOptions, range: true });

    const $track = $('.js-range-slider .js-range-slider__track');

    const halfTrackClickX = $track.outerWidth() / 2 + $track.offset().left;
    const halfTrackClickY = $track.outerHeight() / 2 + $track.offset().top;

    const event = $.Event('mousedown');

    event.pageX = halfTrackClickX;
    event.pageY = halfTrackClickY;

    $track.trigger(event);

    const handleFrom = '.js-range-slider .js-range-slider__handle_type_from';
    const handleTo = '.js-range-slider .js-range-slider__handle_type_to';

    expect($(handleFrom).css('left')).toEqual('50%');
    expect($(handleTo).css('left')).toEqual('100%');

    $(handleFrom).trigger('mousedown');
    $(document).trigger('mousemove');
    $(document).trigger('mouseup');

    expect($(handleFrom).hasClass('js-range-slider__handle_active')).toBeTruthy();

    event.pageX = ($track.outerWidth() / 4) * 3 + $track.offset().left;
    event.pageY = halfTrackClickY;

    $track.trigger(event);

    expect($(handleFrom).css('left')).toEqual('75%');
    expect($(handleTo).css('left')).toEqual('100%');
  });

  it('handle tick click properly', () => {
    const options = {
      ...defaultOptions,
      showGrid: true,
      gridDensity: 5,
      showBubble: true,
    };
    const app: App = new App($('input[type="range"]'), options);
    const $tickLabel = $('.js-range-slider').find('.js-range-slider__grid-label:eq(2)');
    const $bubble = $('.js-range-slider .js-range-slider__bubble');

    $tickLabel.trigger('click');
    expect($bubble.text()).toEqual('40');

    app.update({ ...options, range: true });

    const $tickLabelFirstQuarter = $('.js-range-slider').find('.js-range-slider__grid-label:eq(1)');
    $tickLabelFirstQuarter.trigger('click');
    expect($('.js-range-slider .js-range-slider__bubble_type_from').text()).toEqual('20');

    const $tickLabelLastQuarter = $('.js-range-slider').find('.js-range-slider__grid-label:eq(4)');
    $tickLabelLastQuarter.trigger('click');
    expect($('.js-range-slider .js-range-slider__bubble_type_to').text()).toEqual('80');
  });

  it('render vertical grid properly', () => {
    const options: State = {
      ...defaultOptions,
      showGrid: true,
      showBubble: true,
      vertical: true,
      gridDensity: 5,
    };
    const app: App = new App($('input[type="range"]'), options);
    const $ticks = $('.js-range-slider .js-range-slider__grid-point');

    const tickLabels = [];
    const tickPositions = [];
    $ticks.each((_, tick) => {
      const $tick = $(tick);
      const $label = $tick.find('.js-range-slider__grid-label');

      tickLabels.push(Number($label.text()));
      tickPositions.push($tick.css('top'));
    });

    expect(tickLabels).toEqual([0, 20, 40, 60, 80, 100]);
    expect(tickPositions).toEqual(['0%', '20%', '40%', '60%', '80%', '100%']);
  });

  it('rendered properly with `showBar` option', () => {
    const options: State = { ...defaultOptions, showBar: true, value: 50 };
    const app: App = new App($('input[type="range"]'), options);

    const barSelector = '.js-range-slider .js-range-slider__bar';

    expect($(barSelector).length).toEqual(1);
    expect($(barSelector).css('right')).toEqual('50%');

    app.update({ ...options, vertical: true });

    expect($(barSelector).css('bottom')).toEqual('50%');

    app.update({
      ...options, range: true, value: 50, value2: 100,
    });
    expect($(barSelector).css('left')).toEqual('50%');
    expect($(barSelector).css('right')).toEqual('0%');
  });
});
