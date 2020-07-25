import $ from 'jquery';
import State from '../../Interfaces/State';
import Observer from '../../Observer/Observer';
import BubbleView from '../BubbleView/BubbleView';

const template = require('./HandleView.pug');

class HandleView {
  private announcer: Observer;

  private $slider: JQuery;

  private $track: JQuery;

  private $element: JQuery;

  private bubbleView: BubbleView;

  constructor($slider, state: State) {
    this.announcer = new Observer();
    this.$slider = $slider;
    this.$track = this.$slider.find('.js-range-slider__track');
    this.init(state);
  }

  update(state: State, position: number): void {
    this.move(position);
    this.updateDataset(state);

    const { showBubble } = state;

    if (showBubble) {
      this.bubbleView.update(state);
    }
  }

  getCurrentPosition(): number {
    const prop = this.isVertical() ? 'top' : 'left';

    return parseInt(this.$element.prop('style')[prop], 10);
  }

  getCurrentValue(): number {
    return Number(this.$element.attr('data-value'));
  }

  private init(state: State): void {
    const type = this.$track.find('.js-range-slider__handle').length === 0
      ? 'from'
      : 'to';
    this.$element = $(template({ state, type }));

    const { showBubble } = state;

    this.bubbleView = showBubble === true ? new BubbleView(this.$element, state) : null;

    this.$track.append(this.$element);
  }

  private move(position: number): void {
    const prop = this.isVertical() ? 'top' : 'left';
    this.$element.css({ [prop]: `${position}%` });
  }

  private updateDataset(state: State): void {
    const { value, value2 } = state;
    const val = this.$element.hasClass('js-range-slider__handle_type_to') ? value2 : value;

    this.$element.attr('data-value', val);
  }

  private isVertical(): boolean {
    return this.$slider.hasClass('js-range-slider_orientation_vertical');
  }
}

export default HandleView;
