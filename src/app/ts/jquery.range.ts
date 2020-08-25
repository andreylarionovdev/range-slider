import $ from 'jquery';
import App from './App/App';
import State from './Interfaces/State';
import {
  DEFAULT_MAX,
  DEFAULT_MIN,
  DEFAULT_STEP,
  DEFAULT_VALUE,
  DEFAULT_VALUE_2,
  DEFAULT_RANGE,
  DEFAULT_VERTICAL,
  DEFAULT_SHOW_BUBBLE,
  DEFAULT_SHOW_GRID,
  DEFAULT_SHOW_BAR,
  DEFAULT_GRID_DENSITY,
} from './const';
import '../styles/jquery.range.scss';

declare global {
  interface JQuery {
    range(options?: State): JQuery;
  }
}

const fetchOptionsFromDataAttr = (attr: State): State => Object.assign(
  {}, ...Object.keys(attr).map((key) => (
    /** Interpret empty `data-something` as boolean true */
    { [key]: attr[key] === '' ? true : attr[key] }
  )),
);

$.fn.range = function range(this: JQuery, options?: State): JQuery {
  const defaults: State = {
    min: DEFAULT_MIN,
    max: DEFAULT_MAX,
    step: DEFAULT_STEP,
    value: DEFAULT_VALUE,
    value2: DEFAULT_VALUE_2,
    gridDensity: DEFAULT_GRID_DENSITY,
    isRange: DEFAULT_RANGE,
    isVertical: DEFAULT_VERTICAL,
    showBubble: DEFAULT_SHOW_BUBBLE,
    showGrid: DEFAULT_SHOW_GRID,
    showBar: DEFAULT_SHOW_BAR,
  };

  const dataAttrOptions: State = fetchOptionsFromDataAttr(this.data());

  return this.each((_, element) => {
    $(element).data('api', new App($(element), { ...defaults, ...options, ...dataAttrOptions }));
  });
};

export default $.fn.range;
