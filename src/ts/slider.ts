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
      onChange: null,
      onBlur: null
    };

    return this.each(function () {
      $.data(this, 'range', new App($(this), Object.assign({}, defaults, options)));
    });
  };
})($);

$(document).ready(function () {
  $('input#first').range();
  $('input#second').range({
    step: 10
  });
});