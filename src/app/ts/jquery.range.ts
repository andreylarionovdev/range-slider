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
  DEFAULT_SHOW_CONFIG,
} from './const';
import '../styles/jquery.range.scss';

declare global {
  interface JQuery {
    range(options?: State): JQuery;
  }
}

const fetchOptionsFromDataAttr = (attr: State): State => Object.assign(
  {}, ...Object.keys(attr).map((key) => (
    { [key]: attr[key] === '' ? true : attr[key] }
  )),
);

$.fn.range = function (this: JQuery, options?: State): JQuery {
  const defaults: State = {
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

  const dataAttrOptions: State = fetchOptionsFromDataAttr(this.data());

  return this.each(function () {
    new App($(this), { ...defaults, ...options, ...dataAttrOptions });
  });
};

export default $.fn.range;
