import $ from 'jquery';

$(document).ready(function () {
  $('input#simple').range();
  $('input#with-step').range({
    step: 10
  });
  $('input#with-config').range({
    range: true,
    // value: 20,
    // value2: 30,
    showConfig: true
  });
});
