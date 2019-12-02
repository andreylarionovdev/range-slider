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
      min: 0,
      max: 100,
      step: 0,
      value: 0,
      value2: 0,
      range: false,
      vertical: false,
      showConfig: false,
    };

    return this.each(function () {
      $.data(this, 'range', new App($(this), Object.assign({}, defaults, options)));
    });
  };
})($);