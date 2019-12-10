import $ from 'jquery';

$(document).ready(function () {
  $('input#simple').range({
    showConfig: true
  });
  $('input#with-step').range({
    step: 10,
    showConfig: true
  });
  $('input#with-config').range({
    range: true,
    // value: 20,
    // value2: 30,
    showConfig: true
  });
});
