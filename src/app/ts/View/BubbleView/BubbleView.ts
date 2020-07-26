import $ from 'jquery';
import State from '../../Interfaces/State';
import Observable from '../../Interfaces/Observable';
import Observer from '../../Observer/Observer';

const template = require('./BubbleView.pug');

class BubbleView {
  protected $handle: JQuery;

  protected $element: JQuery;

  protected type: 'from' | 'to' | 'range';

  private announcer: Observable;

  constructor($handle, state: State) {
    this.$handle = $handle;

    this.init(state);
  }

  update(state: State): void {
    const { value, value2 } = state;

    this.$element.text(this.type === 'from' ? value : value2);
    if (this.type !== 'range') {
      this.detectCollision();
    }
  }

  onCollision(callback): void {
    if (this.type !== 'range') {
      this.announcer.on('bubble.collision', callback);
    }
  }

  hide(): void {
    this.$element.addClass('range-slider__bubble_hidden');
  }

  show(): void {
    this.$element.removeClass('range-slider__bubble_hidden');
  }

  private detectCollision(): void {
    const oppositeType = this.type === 'from' ? 'to' : 'from';
    const oppositeBubble = this.$handle.closest('.js-range-slider__track')
      .find(`.js-range-slider__bubble_type_${oppositeType}`);

    if (oppositeBubble.length === 0) {
      return;
    }

    const thisBubbleClientRect = this.$element[0].getBoundingClientRect();
    const oppositeBubbleClientRect = oppositeBubble[0].getBoundingClientRect();

    const isOverlapping = thisBubbleClientRect.right > oppositeBubbleClientRect.left
      && thisBubbleClientRect.left < oppositeBubbleClientRect.right
      && thisBubbleClientRect.bottom > oppositeBubbleClientRect.top
      && thisBubbleClientRect.top < oppositeBubbleClientRect.bottom;

    if (isOverlapping) {
      this.announcer.trigger('bubble.collision', true);
    } else {
      this.announcer.trigger('bubble.collision', false);
    }
  }

  protected init(state: State): void {
    this.announcer = new Observer();
    this.type = this.$handle.hasClass('js-range-slider__handle_type_to') ? 'to' : 'from';
    this.$element = $(template({ state, type: this.type }));
    this.$handle.append(this.$element);
  }
}

export default BubbleView;
