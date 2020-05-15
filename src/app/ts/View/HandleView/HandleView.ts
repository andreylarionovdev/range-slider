import $ from 'jquery';
import State from '../../Interfaces/State';
import Observer from '../../Observer/Observer';

const template = require('./HandleView.pug');

class HandleView {
  private announcer: Observer;

  private $slider: JQuery;

  private $track: JQuery;

  private $element: JQuery;

  constructor($slider, state: State) {
    this.announcer = new Observer();
    this.$slider = $slider;
    this.$track = this.$slider.find('.js-range-slider__track');
    this.init(state);
  }

  update(state: State, position: number): void {
    this.move(position);
    this.updateBubbles(state);
  }

  getCurrentPosition(): number {
    const prop = this.isVertical() ? 'top' : 'left';

    return parseInt(this.$element.prop('style')[prop], 10);
  }

  private init(state: State): void {
    const type = this.$track.find('.js-range-slider__handle').length === 0
      ? 'from'
      : 'to';
    this.$element = $(template({ state, type }));
    this.$track.append(this.$element);
  }

  private move(position: number): void {
    const prop = this.isVertical() ? 'top' : 'left';
    this.$element.css({ [prop]: `${position}%` });
  }

  private updateBubbles(state: State): void {
    const {
      value, value2, showBubble,
    } = state;

    const val = this.$element.hasClass('js-range-slider__handle_type_to') ? value2 : value;

    if (showBubble) {
      const $bubble = this.$element.find('.js-range-slider__bubble');
      $bubble.text(val);
    }
  }

  private isVertical(): boolean {
    return this.$slider.hasClass('js-range-slider_orientation_vertical');
  }
}

export default HandleView;
