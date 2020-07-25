import $ from 'jquery';
import State from '../../Interfaces/State';
import Observer from '../../Observer/Observer';

const template = require('./BubbleView.pug');

class BubbleView {
  private $handle: JQuery;

  private $element: JQuery;

  constructor($handle, state: State) {
    this.$handle = $handle;

    this.init(state);
  }

  update(state: State): void {
    const { value, value2 } = state;

    this.$element.text(
      this.$handle.hasClass('js-range-slider__handle_type_to')
        ? value2
        : value,
    );
  }

  private init(state: State): void {
    const type = this.$handle.hasClass('js-range-slider__handle_type_to') ? 'to' : 'from';
    this.$element = $(template({ state, type }));
    this.$handle.append(this.$element);
  }
}

export default BubbleView;
