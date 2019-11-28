import $ from 'jquery';
import App from './App/App';
import State from './Interfaces/State';

declare global {
  interface JQuery {
    range(options?: State): JQuery;
  }
}

(function ($: JQueryStatic): void {
  $.fn.range = function(this: JQuery, options?: State): JQuery {
    const defaults: State = {
      orientation: 'horizontal',
      min: 0,
      max: 100,
      step: 0,
      values: [0, 0],
      range: false,
      showConfig: false,
      onChange: null,
      onBlur: null
    };

    return this.each(function () {
      $.data(this, 'range', new App($(this), Object.assign({}, defaults, options)));
    });
  };
})($);