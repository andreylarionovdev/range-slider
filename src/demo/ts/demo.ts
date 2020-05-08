import $ from 'jquery';
import '../styles/style.scss';
import '../../app/ts/jquery.range';

$('.js-slider-group__target-input').each((_, input) => {
  $(input).range();
});
