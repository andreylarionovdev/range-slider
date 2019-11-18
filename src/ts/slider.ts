import $ from 'jquery';
import App from './App/App';
import Options from './Interfaces/Options';

declare global {
  interface JQuery {
    range(options?: Options): JQuery;
  }
}

(function ($: JQueryStatic): void {
  $.fn.range = function(this: JQuery, options?: Options): JQuery {
    const defaults: Options = {
      orientation: 'horizontal',
      onChange: null,
      onBlur: null
    };

    return this.each(function () {
      $.data(this, 'range', new App($(this), Object.assign({}, defaults, options)));
    });
  };
})($);

$(document).ready(function () {
  $('h1').range({orientation: 'vertical'});
  $('h2').range({orientation: 'horizontal'});
});