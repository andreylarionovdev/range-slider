import $ from 'jquery';

$(document).ready(() => {
  $('input#simple').range({
    showConfig: true,
  });
  $('input#with-step').range({
    step: 10,
    showConfig: true,
  });
  $('input#with-range').range({
    range: true,
    showConfig: true,
  });
  $('input#vertical').range({
    showConfig: true,
    vertical: true,
  });
  $('input#with-bubble').range({
    value: 20,
    showBubble: true,
    showConfig: true,
  });
  $('input#empty-params').range();
});
