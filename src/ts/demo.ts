import $ from 'jquery';

$(document).ready(function () {
  $('input#simple').range({
    showConfig: true
  });
  $('input#with-step').range({
    step: 10,
    showConfig: true
  });
  $('input#with-range').range({
    range: true,
    // value: 20,
    // value2: 30,
    showConfig: true
  });
  $('input#vertical').range({
    showConfig: true,
    vertical: true
  });
  $('input#with-bubble').range({
    value: 20,
    showBubble: true,
    showConfig: true
  });
});
